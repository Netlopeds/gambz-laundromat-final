const db = require('../config/database');

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM CUSTOMER');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM CUSTOMER WHERE customer_id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new customer
exports.createCustomer = async (req, res) => {
  try {
    const { customer_id, name } = req.body;
    
    // If customer_id is provided, use it; otherwise let DB auto-increment
    if (customer_id) {
      await db.query(
        'INSERT INTO CUSTOMER (customer_id, name) VALUES (?, ?)',
        [customer_id, name]
      );
      
      res.status(201).json({ 
        customer_id: customer_id,
        name,
        message: 'Customer created successfully'
      });
    } else {
      const [result] = await db.query(
        'INSERT INTO CUSTOMER (name) VALUES (?)',
        [name]
      );
      
      res.status(201).json({ 
        customer_id: result.insertId,
        name,
        message: 'Customer created successfully'
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  try {
    const { name } = req.body;
    
    await db.query(
      'UPDATE CUSTOMER SET name = ? WHERE customer_id = ?',
      [name, req.params.id]
    );
    
    res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    await db.query('DELETE FROM CUSTOMER WHERE customer_id = ?', [req.params.id]);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
