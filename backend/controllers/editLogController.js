const db = require('../config/database');

// Get all edit logs
exports.getAllEditLogs = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, s.name as staff_name, t.name as transaction_name
      FROM EDIT_LOG e
      LEFT JOIN STAFF s ON e.staff_id = s.staff_id
      LEFT JOIN TRANSACTION t ON e.transaction_id = t.transaction_id
      ORDER BY e.date_modified DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get edit logs by transaction ID
exports.getEditLogsByTransaction = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, s.name as staff_name
      FROM EDIT_LOG e
      LEFT JOIN STAFF s ON e.staff_id = s.staff_id
      WHERE e.transaction_id = ?
      ORDER BY e.date_modified DESC
    `, [req.params.transactionId]);
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
