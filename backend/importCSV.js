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
    
    // Now insert transactions
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      try {
        const values = parseCSVLine(lines[i]);
        
        // Parse the CSV columns based on actual structure:
        // 0: transaction_id, 1: customer_id, 2: staff_id, 3: date, 4: time_received, 
        // 5: price, 6: name, 7: service_type, 8: status, 9: addons, 10: quantity_addons
        const customerName = values[6];
        const customerId = customerMap.get(customerName);
        const date = parseDate(values[3]);
        const timeReceived = values[4];
        const price = parseFloat(values[5]) || 0;
        const serviceType = values[7];
        const status = values[8];
        const addons = values[9] || 'none';
        
        // Insert transaction with custom ID
        await db.query(
          `INSERT INTO TRANSACTION (transaction_id, customer_id, staff_id, date, time_received, price, name, service_type, addon, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [transactionCounter, customerId, 1, date, timeReceived, price, customerName, serviceType, addons, status]
        );
        
        console.log(`✅ TN${String(transactionCounter).padStart(4, '0')}: ${customerName} - ${serviceType} - ₱${price}`);
        imported++;
        transactionCounter++;
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          skipped++;
        } else {
          console.error(`❌ Error on line ${i}: ${error.message}`);
        }
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
  // Convert DD/MM/YYYY to YYYY-MM-DD
  if (!dateStr || !dateStr.trim()) {
    return new Date().toISOString().split('T')[0];
  }
  
  const parts = dateStr.trim().split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return dateStr;
}

importCSV();
