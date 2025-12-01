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
    const { name, price, is_active } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO ADDON (name, price, is_active) VALUES (?, ?, ?)',
      [name, price, is_active !== undefined ? is_active : true]
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
    const { name, price, is_active } = req.body;
    
    let query = 'UPDATE ADDON SET name = ?, price = ?';
    let params = [name, price];
    
    if (is_active !== undefined) {
      query += ', is_active = ?';
      params.push(is_active);
    }
    
    query += ' WHERE addon_id = ?';
    params.push(req.params.id);
    
    const [result] = await db.query(query, params);
    
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
