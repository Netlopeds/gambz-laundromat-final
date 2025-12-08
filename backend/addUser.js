const bcrypt = require('bcryptjs');
const db = require('./config/database');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function addUser() {
  try {
    console.log('\n=== Add New Staff User ===\n');
    
    const name = await question('Enter full name: ');
    const email = await question('Enter email: ');
    const password = await question('Enter password: ');
    
    console.log('\nSelect role:');
    console.log('1 - Admin');
    console.log('2 - Staff');
    const roleChoice = await question('Enter role number (1-2): ');
    
    const roleId = parseInt(roleChoice);
    if (roleId < 1 || roleId > 2) {
      console.log('❌ Invalid role selection');
      rl.close();
      process.exit(1);
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const [result] = await db.query(
      'INSERT INTO STAFF (role_id, name, email, password) VALUES (?, ?, ?, ?)',
      [roleId, name, email, hashedPassword]
    );
    
    console.log('\n✅ User created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👤 Staff ID: ${result.insertId}`);
    console.log(`👔 Role: ${roleId === 1 ? 'Admin' : 'Staff'}`);
    
    rl.close();
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('\n❌ Email already exists!');
    } else {
      console.error('\n❌ Error creating user:', error.message);
    }
    rl.close();
    process.exit(1);
  }
}

addUser();
