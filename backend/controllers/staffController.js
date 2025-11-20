const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Get all staff
exports.getAllStaff = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.staff_id, s.name, s.email, s.role_id, r.name as role_name
      FROM STAFF s
      LEFT JOIN ROLES r ON s.role_id = r.role_id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get staff by ID
exports.getStaffById = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.staff_id, s.name, s.email, s.role_id, r.name as role_name
      FROM STAFF s
      LEFT JOIN ROLES r ON s.role_id = r.role_id
      WHERE s.staff_id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login staff
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [rows] = await db.query(`
      SELECT s.*, r.name as role_name
      FROM STAFF s
      LEFT JOIN ROLES r ON s.role_id = r.role_id
      WHERE s.email = ?
    `, [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const staff = rows[0];
    const isValidPassword = await bcrypt.compare(password, staff.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Don't send password back
    delete staff.password;
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new staff
exports.createStaff = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(
      'INSERT INTO STAFF (name, email, password, role_id) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role_id]
    );
    
    res.status(201).json({ 
      staff_id: result.insertId, 
      name, 
      email, 
      role_id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update staff
exports.updateStaff = async (req, res) => {
  try {
    const { name, email, role_id } = req.body;
    
    await db.query(
      'UPDATE STAFF SET name = ?, email = ?, role_id = ? WHERE staff_id = ?',
      [name, email, role_id, req.params.id]
    );
    
    res.json({ message: 'Staff updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete staff
exports.deleteStaff = async (req, res) => {
  try {
    await db.query('DELETE FROM STAFF WHERE staff_id = ?', [req.params.id]);
    res.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
