const db = require('../config/database');

// Get all analytics
exports.getAllAnalytics = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ANALYTICS ORDER BY period_start_date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate analytics for a period
exports.generateAnalytics = async (req, res) => {
  try {
    const { period_type, period_start_date, period_end_date } = req.body;
    
    // Calculate totals from transactions
    const [totals] = await db.query(`
      SELECT 
        SUM(price) as total_sales,
        COUNT(*) as total_orders,
        COUNT(DISTINCT customer_id) as total_customers
      FROM TRANSACTION
      WHERE date BETWEEN ? AND ?
    `, [period_start_date, period_end_date]);
    
    const { total_sales, total_orders, total_customers } = totals[0];
    
    // Insert analytics record
    const [result] = await db.query(
      `INSERT INTO ANALYTICS (period_type, period_start_date, total_sales, total_orders, total_customers)
       VALUES (?, ?, ?, ?, ?)`,
      [period_type, period_start_date, total_sales || 0, total_orders || 0, total_customers || 0]
    );
    
    res.status(201).json({
      analytics_id: result.insertId,
      period_type,
      period_start_date,
      total_sales: total_sales || 0,
      total_orders: total_orders || 0,
      total_customers: total_customers || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get analytics summary
exports.getAnalyticsSummary = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    const [summary] = await db.query(`
      SELECT 
        SUM(price) as total_sales,
        COUNT(*) as total_orders,
        COUNT(DISTINCT customer_id) as total_customers,
        AVG(price) as average_order_value
      FROM TRANSACTION
      WHERE date BETWEEN ? AND ?
    `, [start_date, end_date]);
    
    res.json(summary[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
