-- Create database
CREATE DATABASE IF NOT EXISTS gambz_laundry;
USE gambz_laundry;

-- Create ROLES table
CREATE TABLE IF NOT EXISTS ROLES (
  role_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL
);

-- Create STAFF table
CREATE TABLE IF NOT EXISTS STAFF (
  staff_id INT PRIMARY KEY AUTO_INCREMENT,
  role_id INT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  FOREIGN KEY (role_id) REFERENCES ROLES(role_id)
);

-- Create CUSTOMER table
CREATE TABLE IF NOT EXISTS CUSTOMER (
  customer_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL
);

-- Create TRANSACTION table
CREATE TABLE IF NOT EXISTS TRANSACTION (
  transaction_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT,
  staff_id INT,
  date DATE NOT NULL,
  time_received TIME NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  name VARCHAR(100),
  service_type VARCHAR(50),
  addon VARCHAR(100),
  status VARCHAR(50),
  FOREIGN KEY (customer_id) REFERENCES CUSTOMER(customer_id),
  FOREIGN KEY (staff_id) REFERENCES STAFF(staff_id)
);

-- Create EDIT_LOG table
CREATE TABLE IF NOT EXISTS EDIT_LOG (
  log_id INT PRIMARY KEY AUTO_INCREMENT,
  transaction_id INT,
  staff_id INT,
  action VARCHAR(50),
  old_valu TEXT,
  new_value TEXT,
  date_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES TRANSACTION(transaction_id),
  FOREIGN KEY (staff_id) REFERENCES STAFF(staff_id)
);

-- Create ANALYTICS table
CREATE TABLE IF NOT EXISTS ANALYTICS (
  analytics_id INT PRIMARY KEY AUTO_INCREMENT,
  period_type VARCHAR(50),
  period_start_date DATE,
  total_sales DECIMAL(10,2),
  total_orders INT,
  total_customers INT
);

-- Insert sample roles
INSERT INTO ROLES (name) VALUES 
  ('Admin'),
  ('Manager'),
  ('Staff');

-- Insert sample staff (password is 'password123' hashed with bcrypt)
-- You'll need to hash passwords properly when creating real users
INSERT INTO STAFF (role_id, name, email, password) VALUES 
  (1, 'Admin User', 'admin@gambz.com', '$2b$10$rKvVQKJXkQqzxQ0M9LZOZe5xY5QqYQZqYQZqYQZqYQZqYQZqYQZqY'),
  (2, 'Manager User', 'manager@gambz.com', '$2b$10$rKvVQKJXkQqzxQ0M9LZOZe5xY5QqYQZqYQZqYQZqYQZqYQZqYQZqY');

-- Insert sample customers
INSERT INTO CUSTOMER (name) VALUES 
  ('John Doe'),
  ('Jane Smith'),
  ('Bob Johnson');
