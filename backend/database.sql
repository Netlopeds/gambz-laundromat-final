CREATE DATABASE IF NOT EXISTS gambz_laundry;
USE gambz_laundry;

CREATE TABLE IF NOT EXISTS ROLES (
  role_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS STAFF (
  staff_id INT PRIMARY KEY AUTO_INCREMENT,
  role_id INT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  FOREIGN KEY (role_id) REFERENCES ROLES(role_id)
);

CREATE TABLE IF NOT EXISTS CUSTOMER (
  customer_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS ADDON (
  addon_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS SERVICES (
  service_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  base_price DECIMAL(10,2) NOT NULL
);

-- Create TRANSACTION table after referenced tables exist
CREATE TABLE IF NOT EXISTS TRANSACTION (
  transaction_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT,
  staff_id INT,
  service_id INT,
  addon_id INT,
  date DATE NOT NULL,
  time_received TIME NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  name VARCHAR(100),
  status VARCHAR(50),
  FOREIGN KEY (customer_id) REFERENCES CUSTOMER(customer_id),
  FOREIGN KEY (staff_id) REFERENCES STAFF(staff_id),
  FOREIGN KEY (service_id) REFERENCES SERVICES(service_id),
  FOREIGN KEY (addon_id) REFERENCES ADDON(addon_id)
);

-- Create EDIT_LOG table after TRANSACTION exists
CREATE TABLE IF NOT EXISTS EDIT_LOG (
  log_id INT PRIMARY KEY AUTO_INCREMENT,
  transaction_id INT,
  staff_id INT,
  action VARCHAR(50),
  old_value TEXT,
  new_value TEXT,
  date_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES TRANSACTION(transaction_id),
  FOREIGN KEY (staff_id) REFERENCES STAFF(staff_id)
);

-- Insert sample roles
INSERT INTO ROLES (name) VALUES 
  ('Admin'),
  ('Manager'),
  ('Staff');

INSERT INTO CUSTOMER (name) VALUES 
  ('John Doe'),
  ('Jane Smith'),
  ('Bob Johnson');

INSERT INTO ADDON (name, price) VALUES 
  ('Ariel', 18.00),
  ('Breeze', 18.00),
  ('Tide', 18.00),
  ('Surf', 12.00),
  ('Downy', 12.00),
  ('Del', 8.00),
  ('Zonrox', 7.00);

INSERT INTO SERVICES (name, base_price) VALUES 
  ('Wash', 60.00),
  ('Dry', 60.00),
  ('Fold', 30.00),
  ('Full Service', 150.00),
  ('Spin', 15.00),
  ('Extra Dry', 15.00);