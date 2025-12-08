const fs = require('fs');
const path = require('path');
const db = require('./config/database');

const csvFilePath = path.join(__dirname, 'edited_database.csv');

async function importCSV() {
  try {
    console.log('\n=== Importing Transactions from CSV ===\n');
    
    // Read CSV file
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    
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
    
    console.log(`Found ${customerMap.size} unique customers\n`);
    
    // Check if staff exists, if not use staff_id from CSV or create a default one
    const [staffRows] = await db.query('SELECT staff_id FROM STAFF LIMIT 1');
    let defaultStaffId = 1;
    
    if (staffRows.length === 0) {
      console.log('⚠️  No staff found in database. Please create a staff member first using addUser.js');
      console.log('Run: node addUser.js');
      process.exit(1);
    } else {
      defaultStaffId = staffRows[0].staff_id;
      console.log(`Using default staff_id: ${defaultStaffId}\n`);
    }
    
    // Insert customers first
    console.log('Inserting customers...');
    for (const [name, id] of customerMap) {
      try {
        await db.query(
          'INSERT INTO CUSTOMER (customer_id, name) VALUES (?, ?)',
          [id, name]
        );
        console.log(`✅ Customer ${id}: ${name}`);
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          console.error(`❌ Error inserting customer ${name}:`, error.message);
        }
      }
    }
    
    console.log('\n\nInserting transactions...');
    let transactionCounter = 1;
    let imported = 0;
    let skipped = 0;
    
    // Get all services and addons from database for mapping
    const [services] = await db.query('SELECT service_id, name FROM SERVICES');
    const [addons] = await db.query('SELECT addon_id, name FROM ADDON');
    
    const serviceMap = new Map(services.map(s => [s.name.toLowerCase(), s.service_id]));
    const addonMap = new Map(addons.map(a => [a.name.toLowerCase(), a.addon_id]));
    
    // Now insert transactions with junction tables
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const connection = await db.getConnection();
      
      try {
        await connection.beginTransaction();
        
        const values = parseCSVLine(lines[i]);
        
        // Parse the CSV columns:
        // 0: transaction_id, 1: customer_id, 2: staff_id, 3: date, 4: time_received, 
        // 5: price, 6: name, 7: service_type, 8: status, 9: addons, 10: quantity_addons,
        // 11: extra_service, 12: wash_promo, 13: total
        const customerName = values[6];
        const customerId = customerMap.get(customerName);
        const csvStaffId = parseInt(values[2]) || defaultStaffId;
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
        
        // Verify staff_id exists
        const [staffCheck] = await connection.query('SELECT staff_id FROM STAFF WHERE staff_id = ?', [csvStaffId]);
        const staffId = staffCheck.length > 0 ? csvStaffId : defaultStaffId;
        
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
        console.log(`✅ TN${String(transactionId).padStart(4, '0')}: ${customerName} - ${serviceTypeStr} - ₱${total}`);
        imported++;
        transactionCounter++;
      } catch (error) {
        await connection.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
          skipped++;
        } else {
          console.error(`❌ Error on line ${i}: ${error.message}`);
        }
      } finally {
        connection.release();
      }
    }
    
    console.log(`\n\n📊 Summary:`);
    console.log(`   Customers: ${customerMap.size}`);
    console.log(`   Transactions Imported: ${imported}`);
    console.log(`   Transactions Skipped: ${skipped}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

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

function parseDate(dateStr) {
  // Convert MM/DD/YYYY to YYYY-MM-DD
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

importCSV();
