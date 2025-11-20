-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing data to start fresh with custom IDs (order matters!)
DELETE FROM EDIT_LOG;
DELETE FROM TRANSACTION;
DELETE FROM CUSTOMER;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Now modify tables to remove AUTO_INCREMENT (so we can use manual IDs)
ALTER TABLE CUSTOMER MODIFY customer_id INT NOT NULL;
ALTER TABLE TRANSACTION MODIFY transaction_id INT NOT NULL;
