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
    const { name, base_price } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO SERVICES (name, base_price) VALUES (?, ?)',
      [name, base_price]
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
    const { name, base_price } = req.body;
    
    const [result] = await db.query(
      'UPDATE SERVICES SET name = ?, base_price = ? WHERE service_id = ?',
      [name, base_price, req.params.id]
    );
    
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
