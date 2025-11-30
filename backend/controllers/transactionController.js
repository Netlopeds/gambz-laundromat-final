const db = require('../config/database');

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, c.name as customer_name, s.name as staff_name
      FROM TRANSACTION t
      LEFT JOIN CUSTOMER c ON t.customer_id = c.customer_id
      LEFT JOIN STAFF s ON t.staff_id = s.staff_id
      ORDER BY t.date DESC, t.time_received DESC
    `);
    res.json(rows);
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
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new transaction
exports.createTransaction = async (req, res) => {
  try {
    const { transaction_id, customer_id, staff_id, date, time_received, price, name, service_type, addon, status } = req.body;
    
    let newTransactionId;
    
    // If transaction_id is provided, use it; otherwise let DB auto-increment
    if (transaction_id) {
      await db.query(
        `INSERT INTO TRANSACTION (transaction_id, customer_id, staff_id, date, time_received, price, name, service_type, addon, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [transaction_id, customer_id, staff_id, date, time_received, price, name, service_type, addon, status]
      );
      newTransactionId = transaction_id;
    } else {
      const [result] = await db.query(
        `INSERT INTO TRANSACTION (customer_id, staff_id, date, time_received, price, name, service_type, addon, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [customer_id, staff_id, date, time_received, price, name, service_type, addon, status]
      );
      newTransactionId = result.insertId;
    }
    
    // Log the creation in edit log
    await db.query(
      `INSERT INTO EDIT_LOG (transaction_id, staff_id, action, old_valu, new_value) 
       VALUES (?, ?, ?, ?, ?)`,
      [newTransactionId, staff_id || null, 'Transaction Created', 'N/A', `Customer: ${name}, Service: ${service_type}, Amount: ₱${price}`]
    );
    
    res.status(201).json({ 
      transaction_id: newTransactionId,
      message: 'Transaction created successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { customer_id, staff_id, date, time_received, price, name, service_type, addon, status } = req.body;
    
    // Get old values for edit log
    const [oldData] = await db.query('SELECT * FROM TRANSACTION WHERE transaction_id = ?', [req.params.id]);
    
    if (oldData.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    const old = oldData[0];
    const fieldMapping = {
      customer_id: 'Customer ID',
      name: 'Customer Name',
      service_type: 'Service Type',
      addon: 'Add-ons',
      status: 'Status',
      date: 'Date',
      time_received: 'Time Received',
      price: 'Price'
    };
    
    // Track only changed fields
    const changes = [];
    if (name && old.name !== name) changes.push({ field: 'Customer Name', oldValue: old.name, newValue: name });
    if (service_type && old.service_type !== service_type) changes.push({ field: 'Service Type', oldValue: old.service_type, newValue: service_type });
    if (addon && old.addon !== addon) changes.push({ field: 'Add-ons', oldValue: old.addon, newValue: addon });
    if (status && old.status !== status) changes.push({ field: 'Status', oldValue: old.status, newValue: status });
    if (date && old.date !== date) changes.push({ field: 'Date', oldValue: old.date, newValue: date });
    if (time_received && old.time_received !== time_received) changes.push({ field: 'Time Received', oldValue: old.time_received, newValue: time_received });
    if (price && parseFloat(old.price) !== parseFloat(price)) changes.push({ field: 'Price', oldValue: old.price, newValue: price });
    
    // Update transaction
    await db.query(
      `UPDATE TRANSACTION 
       SET customer_id = ?, staff_id = ?, date = ?, time_received = ?, price = ?, name = ?, service_type = ?, addon = ?, status = ?
       WHERE transaction_id = ?`,
      [customer_id, staff_id, date, time_received, price, name, service_type, addon, status, req.params.id]
    );
    
    // Log each changed field separately
    for (const change of changes) {
      await db.query(
        `INSERT INTO EDIT_LOG (transaction_id, staff_id, action, old_valu, new_value) 
         VALUES (?, ?, ?, ?, ?)`,
        [req.params.id, staff_id, change.field, change.oldValue, change.newValue]
      );
    }
    
    res.json({ message: 'Transaction updated successfully', changesLogged: changes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    // First, delete related edit logs to avoid foreign key constraint errors
    await db.query('DELETE FROM EDIT_LOG WHERE transaction_id = ?', [req.params.id]);
    
    // Then delete the transaction
    const [result] = await db.query('DELETE FROM TRANSACTION WHERE transaction_id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
