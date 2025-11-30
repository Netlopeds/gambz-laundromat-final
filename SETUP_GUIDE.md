# Gambz Laundry Management System - Complete Setup Guide

This guide covers everything needed to set up the Gambz Laundry Management System on a new computer.

## Prerequisites

1. **Node.js and npm** (v14 or higher)
   - Download from: https://nodejs.org/

2. **MySQL Server** (v5.7 or higher)
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Remember your root password during installation

3. **Git** (optional, for cloning the repository)
   - Download from: https://git-scm.com/

## Part 1: Database Setup

### 1.1 Create the Database

1. Open MySQL Command Line Client or MySQL Workbench
2. Login with your root credentials
3. Run the SQL script:
   ```bash
   mysql -u root -p < backend/database.sql
   ```
   Or manually execute the contents of `backend/database.sql`

### 1.2 Import Initial Data (if you have CSV data)

1. **Prepare your CSV file:**
   - Rename your data file from `.txt` to `edited_database.csv`
   - Place it in `C:\Users\[YourUsername]\Downloads\`
   - **Important:** Update the file path in `backend/importCSV.js` line 5:
     ```javascript
     const csvFilePath = 'C:\\Users\\[YourUsername]\\Downloads\\edited_database.csv';
     ```

2. **CSV Format Expected:**
   ```
   transaction_id,customer_id,staff_id,date,time_received,price,name,service_type,addon,status
   1,1,1,17/11/2025,08:30,150,John Doe,Wash & Fold,Fabric Softener,paid
   ```
   - Date format: DD/MM/YYYY
   - Status: 'paid' or 'unpaid'

3. **Run the import script:**
   ```bash
   cd backend
   node importCSV.js
   ```

### 1.3 Create Admin User

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Run the user creation script:
   ```bash
   node addUser.js
   ```

3. When prompted, enter:
   - Name: `Admin` (or your preferred admin name)
   - Email: `admin@gambz.com` (or your preferred email)
   - Password: Your secure password
   - Role ID: `1` (for Admin) or `2` (for Staff)

## Part 2: Backend Setup

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

### 2.2 Configure Environment Variables

1. Open `backend/.env` file
2. Update with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=gambz_laundry
   PORT=3000
   ```

### 2.3 Start the Backend Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server should start at: `http://localhost:3000`

## Part 3: Frontend Setup

### 3.1 Install Dependencies

```bash
cd ..
npm install
```

### 3.2 Start the Frontend Development Server

```bash
npm run dev
```

Frontend should start at: `http://localhost:5173` (or another port if 5173 is busy)

### 3.3 Build for Production (optional)

```bash
npm run build
```

## Part 4: Verify Installation

### 4.1 Test Backend API

Open browser or Postman and test:
- `http://localhost:3000/api/staff` - Should return staff list
- `http://localhost:3000/api/transactions` - Should return transactions

### 4.2 Login to Application

1. Open `http://localhost:5173` in browser
2. Login with the admin credentials you created
3. You should see the Overview page

## Key Features Implemented

### 📊 Dashboard & Analytics
- **Overview Page**: 
  - Daily/Monthly/Yearly stats for admin
  - Daily stats only for staff
  - Total customers, transactions, and sales with ₱ peso sign
  
- **Reports Page**:
  - Admin: Daily/Monthly/Yearly filters for all KPIs and pie charts
  - Staff: Daily stats only
  - Payment status pie chart
  - Unpaid customers list
  - Popular services chart
  - CSV export functionality

### 📝 Transaction Management
- **Transaction Log**:
  - Paginated view (8 rows per page)
  - Sort by any column (across all pages)
  - Edit transactions with field-level change tracking
  - Delete transactions (admin only)
  - Transaction IDs displayed as TN0001, TN0002, etc.
  - Dates displayed as DD/MM/YYYY format
  - Responsive mobile/tablet views with card layout

### 📜 Edit Log (Admin Only)
- Tracks all changes: CREATE, UPDATE, DELETE
- Shows which staff member made changes
- Displays old value → new value for updates
- Clean, readable format (no JSON blobs)
- Responsive card layout for mobile

### 📤 Import/Export
- **CSV Import**: 
  - Import transactions from `edited_database.csv`
  - Handles DD/MM/YYYY date format
  - Auto-generates customer records
  - Preserves transaction IDs from CSV
  
- **CSV Export**: 
  - Export filtered data by period (daily/monthly/yearly)
  - Proper date formatting (DD/MM/YYYY)
  - Transaction IDs formatted as TN0001

### 🔐 User Roles
- **Admin**: Full access to all features
- **Staff**: Limited to daily views and basic transaction management

## Database Schema

### Tables Created:
- **ROLES** - User role definitions
- **STAFF** - Staff/admin users with authentication
- **CUSTOMER** - Customer records
- **TRANSACTION** - Transaction records with all details
- **EDIT_LOG** - Audit trail of all changes

### Important Notes:
- Transaction IDs auto-increment but can be set explicitly during import
- Date stored as DATE type (YYYY-MM-DD) in database
- Frontend displays dates as DD/MM/YYYY
- Status values: 'paid', 'unpaid', or 'pending'
- Foreign key constraints: EDIT_LOG → TRANSACTION

## Common Issues & Solutions

### Issue: "Cannot find module"
**Solution:** Run `npm install` in both root and backend directories

### Issue: "Error connecting to database"
**Solution:** 
- Check MySQL is running
- Verify credentials in `backend/.env`
- Ensure database exists: `CREATE DATABASE gambz_laundry;`

### Issue: "Port already in use"
**Solution:** 
- Backend: Change PORT in `.env`
- Frontend: Vite will auto-assign new port

### Issue: "Unpaid customers not showing"
**Solution:** Hard refresh browser (Ctrl+Shift+R) to clear cache

### Issue: CSV import fails
**Solution:** 
- Check file path in `importCSV.js`
- Ensure file is renamed to `.csv` extension
- Verify CSV format matches expected structure
- Check date format is DD/MM/YYYY

## File Structure Reference

```
3ISA_GAMBZLAUNDRY/
├── backend/
│   ├── config/
│   │   └── database.js          # MySQL connection config
│   ├── controllers/
│   │   ├── transactionController.js  # Transaction CRUD + edit logging
│   │   ├── customerController.js
│   │   ├── staffController.js
│   │   ├── analyticsController.js
│   │   └── editLogController.js
│   ├── routes/
│   │   └── index.js             # API route definitions
│   ├── .env                     # Environment variables
│   ├── database.sql             # Database schema
│   ├── importCSV.js             # CSV import script
│   ├── addUser.js               # User creation script
│   ├── clearOldEdits.js         # Cleanup script for old edit logs
│   ├── package.json
│   └── server.js                # Express server entry point
├── src/
│   ├── components/
│   │   └── Navbar.vue           # Sidebar navigation
│   ├── views/
│   │   ├── Overview.vue         # Dashboard with stats
│   │   ├── Reports.vue          # Analytics & charts
│   │   ├── TransactionLog.vue   # Transaction management
│   │   ├── EditLog.vue          # Change history (admin)
│   │   ├── NewTransaction.vue   # Create new transaction
│   │   └── Login.vue            # Authentication
│   ├── stores/
│   │   └── auth.js              # Pinia auth store
│   ├── router/
│   │   └── index.js             # Vue Router config
│   ├── services/
│   │   └── api.js               # API client
│   └── main.js                  # Vue app entry point
├── package.json
└── vite.config.js               # Vite configuration
```

## Next Steps After Setup

1. **Test all features:**
   - Login as admin and staff
   - Create/edit/delete transactions
   - Check edit logs
   - Export reports
   - Test on mobile devices

2. **Customize if needed:**
   - Update logo in `public/images/`
   - Modify colors in CSS files
   - Add more service types
   - Adjust pagination settings

3. **Backup regularly:**
   - Export database: `mysqldump -u root -p gambz_laundry > backup.sql`
   - Keep CSV exports of transaction data

## Support & Maintenance

### Clearing Old Edit Logs
If your edit log gets too large:
```bash
cd backend
node clearOldEdits.js
```

### Checking Database Status
```bash
cd backend
node checkStatus.js
```

### Updating Dependencies
```bash
npm update        # Frontend
cd backend
npm update        # Backend
```

---

**Version:** 1.0  
**Last Updated:** November 2025  
**Contact:** admin@gambz.com
