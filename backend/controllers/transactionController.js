const db = require('../config/database');

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    // Get pagination parameters from query string (optional)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000; // Default to 1000 if not specified
    const offset = (page - 1) * limit;
    
    // Get total count for pagination info
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM TRANSACTION');
    const totalTransactions = countResult[0].total;
    
    // Single optimized query to get all data at once
    const [rows] = await db.query(`
      SELECT 
        t.*,
        c.name as customer_name,
        s.name as staff_name,
        GROUP_CONCAT(DISTINCT CONCAT(serv.service_id, ':', serv.name, ':', serv.base_price, ':', IFNULL(ts.extra_dry, 0)) SEPARATOR '||') as services_data,
        GROUP_CONCAT(DISTINCT CONCAT(a.addon_id, ':', a.name, ':', a.price, ':', ta.quantity) SEPARATOR '||') as addons_data
      FROM TRANSACTION t
      LEFT JOIN CUSTOMER c ON t.customer_id = c.customer_id
      LEFT JOIN STAFF s ON t.staff_id = s.staff_id
      LEFT JOIN TRANSACTION_SERVICES ts ON t.transaction_id = ts.transaction_id
      LEFT JOIN SERVICES serv ON ts.service_id = serv.service_id
      LEFT JOIN TRANSACTION_ADDONS ta ON t.transaction_id = ta.transaction_id
      LEFT JOIN ADDON a ON ta.addon_id = a.addon_id
      GROUP BY t.transaction_id
      ORDER BY t.date DESC, t.time_received DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);
    
    // Parse the concatenated data
    const transactions = rows.map(t => {
      // Parse services
      const services = [];
      if (t.services_data) {
        const servicesArray = t.services_data.split('||');
        servicesArray.forEach(serviceStr => {
          const [service_id, name, base_price, extra_dry] = serviceStr.split(':');
          if (service_id && name) {
            services.push({
              service_id: parseInt(service_id),
              name,
              base_price: parseFloat(base_price),
              extra_dry: parseInt(extra_dry) === 1
            });
          }
        });
      }
      
      // Parse addons
      const addons = [];
      if (t.addons_data) {
        const addonsArray = t.addons_data.split('||');
        addonsArray.forEach(addonStr => {
          const [addon_id, name, price, quantity] = addonStr.split(':');
          if (addon_id && name) {
            addons.push({
              addon_id: parseInt(addon_id),
              name,
              price: parseFloat(price),
              quantity: parseInt(quantity)
            });
          }
        });
      }
      
      // Remove the concatenated fields and add parsed arrays
      delete t.services_data;
      delete t.addons_data;
      t.services = services;
      t.addons = addons;
      
      return t;
    });
    
    // Send response with pagination metadata
    res.json({
      data: transactions,
      pagination: {
        page,
        limit,
        total: totalTransactions,
        totalPages: Math.ceil(totalTransactions / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, c.name as customer_name, s.name as staff_name
      FROM TRANSACTION t
      LEFT JOIN CUSTOMER c ON t.customer_id = c.customer_id
      LEFT JOIN STAFF s ON t.staff_id = s.staff_id
      WHERE t.transaction_id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    const transaction = rows[0];
    
    // Get services with extra_dry flag
    const [services] = await db.query(`
      SELECT serv.service_id, serv.name, serv.base_price, ts.extra_dry
      FROM TRANSACTION_SERVICES ts
      JOIN SERVICES serv ON ts.service_id = serv.service_id
      WHERE ts.transaction_id = ?
    `, [transaction.transaction_id]);
    transaction.services = services;
    
    // Get addons
    const [addons] = await db.query(`
      SELECT a.addon_id, a.name, a.price, ta.quantity
      FROM TRANSACTION_ADDONS ta
      JOIN ADDON a ON ta.addon_id = a.addon_id
      WHERE ta.transaction_id = ?
    `, [transaction.transaction_id]);
    transaction.addons = addons;
    
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new transaction
exports.createTransaction = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { 
      transaction_id, 
      customer_id, 
      staff_id, 
      date, 
      time_received, 
      price, 
      total,
      customer_name, 
      service_ids, 
      service_extra_dry, // Array of booleans for each service
      addon_ids,
      addon_quantities,
      status,
      extra_service,
      wash_promo,
      quantity_addons
    } = req.body;
    
    let newTransactionId;
    
    // Insert main transaction
    if (transaction_id) {
      await connection.query(
        `INSERT INTO TRANSACTION 
         (transaction_id, customer_id, staff_id, date, time_received, price, total, customer_name, status, extra_service, wash_promo, quantity_addons) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [transaction_id, customer_id, staff_id, date, time_received, price, total, customer_name, status, extra_service || false, wash_promo || false, quantity_addons || 0]
      );
      newTransactionId = transaction_id;
    } else {
      const [result] = await connection.query(
        `INSERT INTO TRANSACTION 
         (customer_id, staff_id, date, time_received, price, total, customer_name, status, extra_service, wash_promo, quantity_addons) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [customer_id, staff_id, date, time_received, price, total, customer_name, status, extra_service || false, wash_promo || false, quantity_addons || 0]
      );
      newTransactionId = result.insertId;
    }
    
    // Insert services with extra_dry flag
    if (service_ids && Array.isArray(service_ids) && service_ids.length > 0) {
      for (let i = 0; i < service_ids.length; i++) {
        const serviceId = service_ids[i];
        const extraDry = service_extra_dry && service_extra_dry[i] ? service_extra_dry[i] : false;
        await connection.query(
          `INSERT INTO TRANSACTION_SERVICES (transaction_id, service_id, extra_dry) VALUES (?, ?, ?)`,
          [newTransactionId, serviceId, extraDry]
        );
      }
    }
    
    // Insert addons
    if (addon_ids && Array.isArray(addon_ids) && addon_ids.length > 0) {
      for (let i = 0; i < addon_ids.length; i++) {
        const addonId = addon_ids[i];
        const quantity = addon_quantities && addon_quantities[i] ? addon_quantities[i] : 1;
        await connection.query(
          `INSERT INTO TRANSACTION_ADDONS (transaction_id, addon_id, quantity) VALUES (?, ?, ?)`,
          [newTransactionId, addonId, quantity]
        );
      }
    }
    
    // Get service names for log
    let serviceNames = 'None';
    if (service_ids && service_ids.length > 0) {
      const [services] = await connection.query(
        `SELECT name FROM SERVICES WHERE service_id IN (?)`,
        [service_ids]
      );
      serviceNames = services.map(s => s.name).join(', ');
    }
    
    // Log the creation in edit log
    await connection.query(
      `INSERT INTO EDIT_LOG (transaction_id, staff_id, action, old_value, new_value) 
       VALUES (?, ?, ?, ?, ?)`,
      [newTransactionId, staff_id || null, 'Transaction Created', 'N/A', `Customer: ${customer_name}, Services: ${serviceNames}, Amount: ₱${total}`]
    );
    
    await connection.commit();
    
    res.status(201).json({ 
      transaction_id: newTransactionId,
      message: 'Transaction created successfully'
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// Update transaction
exports.updateTransaction = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { 
      customer_id, 
      staff_id, 
      date, 
      time_received, 
      price,
      total, 
      customer_name, 
      service_ids,
      addon_ids,
      addon_quantities,
      status,
      extra_service,
      wash_promo,
      quantity_addons
    } = req.body;
    
    // Get old values for edit log
    const [oldData] = await connection.query('SELECT * FROM TRANSACTION WHERE transaction_id = ?', [req.params.id]);
    
    if (oldData.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    const old = oldData[0];
    
    // Get old customer name from CUSTOMER table
    let oldCustomerName = old.customer_name || 'N/A';
    if (old.customer_id) {
      const [oldCustomer] = await connection.query('SELECT name FROM CUSTOMER WHERE customer_id = ?', [old.customer_id]);
      if (oldCustomer.length > 0) {
        oldCustomerName = oldCustomer[0].name;
      }
    }
    
    // Build dynamic update query - only update fields that are provided
    const updateFields = [];
    const updateValues = [];
    
    if (customer_id !== undefined) {
      updateFields.push('customer_id = ?');
      updateValues.push(customer_id);
    }
    if (staff_id !== undefined) {
      updateFields.push('staff_id = ?');
      updateValues.push(staff_id);
    }
    if (date !== undefined) {
      updateFields.push('date = ?');
      updateValues.push(date);
    }
    if (time_received !== undefined) {
      updateFields.push('time_received = ?');
      updateValues.push(time_received);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(price);
    }
    if (total !== undefined) {
      updateFields.push('total = ?');
      updateValues.push(total);
    }
    if (customer_name !== undefined) {
      updateFields.push('customer_name = ?');
      updateValues.push(customer_name);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (extra_service !== undefined) {
      updateFields.push('extra_service = ?');
      updateValues.push(extra_service);
    }
    if (wash_promo !== undefined) {
      updateFields.push('wash_promo = ?');
      updateValues.push(wash_promo);
    }
    if (quantity_addons !== undefined) {
      updateFields.push('quantity_addons = ?');
      updateValues.push(quantity_addons);
    }
    
    // Track changes for edit log
    const changes = [];
    if (customer_name !== undefined && oldCustomerName !== customer_name) {
      changes.push({ field: 'Customer Name', oldValue: oldCustomerName, newValue: customer_name });
    }
    if (status !== undefined && old.status !== status) {
      changes.push({ field: 'Status', oldValue: old.status, newValue: status });
    }
    if (date !== undefined && old.date !== date) {
      changes.push({ field: 'Date', oldValue: old.date, newValue: date });
    }
    if (time_received !== undefined && old.time_received !== time_received) {
      changes.push({ field: 'Time Received', oldValue: old.time_received, newValue: time_received });
    }
    if (total !== undefined && parseFloat(old.total) !== parseFloat(total)) {
      changes.push({ field: 'Total', oldValue: old.total, newValue: total });
    }
    
    // Only execute update if there are fields to update
    if (updateFields.length > 0) {
      updateValues.push(req.params.id);
      await connection.query(
        `UPDATE TRANSACTION SET ${updateFields.join(', ')} WHERE transaction_id = ?`,
        updateValues
      );
    }
    
    // Update services only if provided - delete old and insert new
    if (service_ids !== undefined) {
      const service_extra_dry = req.body.service_extra_dry;
      await connection.query('DELETE FROM TRANSACTION_SERVICES WHERE transaction_id = ?', [req.params.id]);
      if (Array.isArray(service_ids) && service_ids.length > 0) {
        for (let i = 0; i < service_ids.length; i++) {
          const serviceId = service_ids[i];
          const extraDry = service_extra_dry && service_extra_dry[i] ? service_extra_dry[i] : false;
          await connection.query(
            `INSERT INTO TRANSACTION_SERVICES (transaction_id, service_id, extra_dry) VALUES (?, ?, ?)`,
            [req.params.id, serviceId, extraDry]
          );
        }
      }
    }
    
    // Update addons only if provided - delete old and insert new
    if (addon_ids !== undefined) {
      await connection.query('DELETE FROM TRANSACTION_ADDONS WHERE transaction_id = ?', [req.params.id]);
      if (Array.isArray(addon_ids) && addon_ids.length > 0) {
        for (let i = 0; i < addon_ids.length; i++) {
          const addonId = addon_ids[i];
          const quantity = addon_quantities && addon_quantities[i] ? addon_quantities[i] : 1;
          await connection.query(
            `INSERT INTO TRANSACTION_ADDONS (transaction_id, addon_id, quantity) VALUES (?, ?, ?)`,
            [req.params.id, addonId, quantity]
          );
        }
      }
    }
    
    // Log each changed field
    const logStaffId = staff_id || old.staff_id;
    for (const change of changes) {
      await connection.query(
        `INSERT INTO EDIT_LOG (transaction_id, staff_id, action, old_value, new_value) 
         VALUES (?, ?, ?, ?, ?)`,
        [req.params.id, logStaffId, change.field, change.oldValue, change.newValue]
      );
    }
    
    await connection.commit();
    
    res.json({ message: 'Transaction updated successfully', changesLogged: changes.length });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Delete related services (CASCADE should handle this, but being explicit)
    await connection.query('DELETE FROM TRANSACTION_SERVICES WHERE transaction_id = ?', [req.params.id]);
    
    // Delete related addons
    await connection.query('DELETE FROM TRANSACTION_ADDONS WHERE transaction_id = ?', [req.params.id]);
    
    // Delete related edit logs
    await connection.query('DELETE FROM EDIT_LOG WHERE transaction_id = ?', [req.params.id]);
    
    // Delete the transaction
    const [result] = await connection.query('DELETE FROM TRANSACTION WHERE transaction_id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    await connection.commit();
    
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// Import CSV
exports.importCSV = async (req, res) => {
  try {
    const multer = require('multer');
    const fs = require('fs');
    const path = require('path');
    
    // Configure multer for file upload
    const upload = multer({ 
      dest: path.join(__dirname, '../uploads/'),
      fileFilter: (req, file, cb) => {
        if (file.originalname.endsWith('.csv')) {
          cb(null, true);
        } else {
          cb(new Error('Only CSV files are allowed'));
        }
      }
    }).single('csvFile');
    
    // Handle file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      try {
        // Read uploaded CSV file
        const csvContent = fs.readFileSync(req.file.path, 'utf-8');
        const lines = csvContent.split('\n');
        
        if (lines.length < 2) {
          fs.unlinkSync(req.file.path); // Clean up
          return res.status(400).json({ error: 'CSV file is empty or invalid' });
        }
        
        // Get all services and addons from database for mapping
        const [services] = await db.query('SELECT service_id, name FROM SERVICES');
        const [addons] = await db.query('SELECT addon_id, name FROM ADDON');
        
        const serviceMap = new Map(services.map(s => [s.name.toLowerCase(), s.service_id]));
        const addonMap = new Map(addons.map(a => [a.name.toLowerCase(), a.addon_id]));
        
        // First, create a map of unique customers
        const customerMap = new Map();
        let customerCounter = 1;
        
        // Parse all rows to find unique customers
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = parseCSVLine(lines[i]);
          const customerName = values[6]; // name column
          
          if (customerName && !customerMap.has(customerName)) {
            customerMap.set(customerName, customerCounter++);
          }
        }
        
        // Insert customers first
        for (const [name, id] of customerMap) {
          try {
            await db.query(
              'INSERT INTO CUSTOMER (customer_id, name) VALUES (?, ?)',
              [id, name]
            );
          } catch (error) {
            if (error.code !== 'ER_DUP_ENTRY') {
              console.error(`Error inserting customer ${name}:`, error.message);
            }
          }
        }
        
        // Get default staff_id if req.user.staffId is not available
        let defaultStaffId = req.user?.staffId;
        if (!defaultStaffId) {
          const [staffRows] = await db.query('SELECT staff_id FROM STAFF LIMIT 1');
          if (staffRows.length === 0) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: 'No staff found in database. Please create a staff member first.' });
          }
          defaultStaffId = staffRows[0].staff_id;
        }
        
        let imported = 0;
        let skipped = 0;
        
        // Now insert transactions with junction tables
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const connection = await db.getConnection();
          
          try {
            await connection.beginTransaction();
            
            const values = parseCSVLine(lines[i]);
            
            // Parse the CSV columns
            const customerName = values[6];
            const customerId = customerMap.get(customerName);
            const csvStaffId = parseInt(values[2]);
            const date = parseDate(values[3]);
            const timeReceived = values[4];
            const price = parseFloat(values[5]) || 0;
            const serviceTypeStr = values[7] || '';
            const status = values[8] || 'pending';
            const addonsStr = values[9] || '';
            const quantityAddonsStr = values[10] || '';
            const extraService = values[11] === 'TRUE' || values[11] === '1' || values[11] === 'true';
            const washPromo = values[12] === 'TRUE' || values[12] === '1' || values[12] === 'true';
            const total = parseFloat(values[13]) || price;
            
            // Verify staff_id exists, otherwise use default
            let staffId = defaultStaffId;
            if (csvStaffId) {
              const [staffCheck] = await connection.query('SELECT staff_id FROM STAFF WHERE staff_id = ?', [csvStaffId]);
              if (staffCheck.length > 0) {
                staffId = csvStaffId;
              }
            }
            
            // Insert transaction
            const [result] = await connection.query(
              `INSERT INTO \`TRANSACTION\` (customer_id, staff_id, date, time_received, price, total, customer_name, status, extra_service, wash_promo) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [customerId, staffId, date, timeReceived, price, total, customerName, status, extraService, washPromo]
            );
            
            const transactionId = result.insertId;
            
            // Parse and insert services
            if (serviceTypeStr && serviceTypeStr.toLowerCase() !== 'none') {
              const serviceNames = serviceTypeStr.split(',').map(s => s.trim().toLowerCase());
              for (const serviceName of serviceNames) {
                const serviceId = serviceMap.get(serviceName);
                if (serviceId) {
                  await connection.query(
                    'INSERT INTO TRANSACTION_SERVICES (transaction_id, service_id) VALUES (?, ?)',
                    [transactionId, serviceId]
                  );
                }
              }
            }
            
            // Parse and insert addons with quantities
            if (addonsStr && addonsStr.toLowerCase() !== 'none') {
              const addonNames = addonsStr.split(',').map(a => a.trim().toLowerCase());
              const quantities = quantityAddonsStr.split(',').map(q => parseInt(q.trim()) || 1);
              
              for (let j = 0; j < addonNames.length; j++) {
                const addonName = addonNames[j];
                const quantity = quantities[j] || 1;
                const addonId = addonMap.get(addonName);
                
                if (addonId) {
                  await connection.query(
                    'INSERT INTO TRANSACTION_ADDONS (transaction_id, addon_id, quantity) VALUES (?, ?, ?)',
                    [transactionId, addonId, quantity]
                  );
                }
              }
            }
            
            await connection.commit();
            imported++;
          } catch (error) {
            await connection.rollback();
            if (error.code !== 'ER_DUP_ENTRY') {
              console.error(`Error on line ${i}:`, error.message);
            }
            skipped++;
          } finally {
            connection.release();
          }
        }
        
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        
        res.json({ 
          message: `Import complete! Imported: ${imported}, Skipped: ${skipped}`,
          imported,
          skipped,
          customers: customerMap.size
        });
      } catch (error) {
        // Clean up uploaded file
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to parse CSV line
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  
  return values;
}

// Helper function to parse date (MM/DD/YYYY format)
function parseDate(dateStr) {
  if (!dateStr || !dateStr.trim()) {
    return new Date().toISOString().split('T')[0];
  }
  
  const parts = dateStr.trim().split('/');
  if (parts.length === 3) {
    const month = parts[0].padStart(2, '0');
    const day = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return dateStr;
}
