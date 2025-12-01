const db = require('../config/database');

// Get all addons
exports.getAllAddons = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ADDON ORDER BY name');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get addon by ID
exports.getAddonById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ADDON WHERE addon_id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Addon not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new addon
exports.createAddon = async (req, res) => {
  try {
    const { name, price } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO ADDON (name, price) VALUES (?, ?)',
      [name, price]
    );
    
    res.status(201).json({ 
      addon_id: result.insertId,
      message: 'Addon created successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update addon
exports.updateAddon = async (req, res) => {
  try {
    const { name, price } = req.body;
    
    const [result] = await db.query(
      'UPDATE ADDON SET name = ?, price = ? WHERE addon_id = ?',
      [name, price, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Addon not found' });
    }
    
    res.json({ message: 'Addon updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete addon
exports.deleteAddon = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM ADDON WHERE addon_id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Addon not found' });
    }
    
    res.json({ message: 'Addon deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
