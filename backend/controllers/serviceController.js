const db = require('../config/database');

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM SERVICES ORDER BY name');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM SERVICES WHERE service_id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new service
exports.createService = async (req, res) => {
  try {
    const { name, base_price, is_active } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO SERVICES (name, base_price, is_active) VALUES (?, ?, ?)',
      [name, base_price, is_active !== undefined ? is_active : true]
    );
    
    res.status(201).json({ 
      service_id: result.insertId,
      message: 'Service created successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const { name, base_price, is_active } = req.body;
    
    let query = 'UPDATE SERVICES SET name = ?, base_price = ?';
    let params = [name, base_price];
    
    if (is_active !== undefined) {
      query += ', is_active = ?';
      params.push(is_active);
    }
    
    query += ' WHERE service_id = ?';
    params.push(req.params.id);
    
    const [result] = await db.query(query, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete service
exports.deleteService = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM SERVICES WHERE service_id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
