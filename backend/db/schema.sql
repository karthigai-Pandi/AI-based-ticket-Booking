-- AI-Based Service Ticket Management System MySQL Schema

CREATE DATABASE IF NOT EXISTS ai_service_desk;
USE ai_service_desk;

-- Roles
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255),
  manager_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  department_id INT,
  phone VARCHAR(50),
  avatar_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

ALTER TABLE departments
  ADD CONSTRAINT fk_departments_manager
  FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL;

-- Assets
CREATE TABLE IF NOT EXISTS assets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  serial_number VARCHAR(150) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  status ENUM('Operational', 'Maintenance', 'Fault', 'Offline') DEFAULT 'Operational',
  location VARCHAR(255),
  installation_date DATE,
  last_maintenance_date DATE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- SLA Tracking
CREATE TABLE IF NOT EXISTS sla_policies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  response_time_hours INT NOT NULL,
  resolution_time_hours INT NOT NULL,
  escalation_threshold_hours INT NOT NULL,
  priority_level ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tickets
CREATE TABLE IF NOT EXISTS tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_key VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
  status ENUM('Open', 'Assigned', 'In Progress', 'Escalated', 'Resolved', 'Closed') DEFAULT 'Open',
  department_id INT,
  asset_id INT,
  created_by INT NOT NULL,
  assigned_to INT,
  sla_policy_id INT,
  response_deadline DATETIME,
  resolution_deadline DATETIME,
  escalation_count INT DEFAULT 0,
  is_overdue BOOLEAN DEFAULT FALSE,
  attachment_url VARCHAR(255),
  ai_recommendation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (sla_policy_id) REFERENCES sla_policies(id) ON DELETE SET NULL
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  author_id INT NOT NULL,
  message TEXT NOT NULL,
  attachment_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  ticket_id INT,
  type VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  ticket_id INT,
  action VARCHAR(150) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE SET NULL
);

-- Engineer Workload
CREATE TABLE IF NOT EXISTS engineer_workloads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  engineer_id INT NOT NULL,
  ticket_count INT DEFAULT 0,
  current_load DECIMAL(5,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (engineer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Ticket History
CREATE TABLE IF NOT EXISTS ticket_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  changed_by INT,
  status_from VARCHAR(100),
  status_to VARCHAR(100),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Seed Base Roles
INSERT IGNORE INTO roles (name, description) VALUES
('Admin', 'Full system access and configuration'),
('Manager', 'Ticket assignment and SLA oversight'),
('Engineer', 'Assigned ticket handling and resolution'),
('User', 'Create and view personal tickets');

-- Seed Departments
INSERT IGNORE INTO departments (name, description) VALUES
('Facilities', 'Facilities management and building systems'),
('IT Services', 'Information technology and support services'),
('Maintenance', 'Asset maintenance and inspections');

-- Seed SLA Policies
INSERT IGNORE INTO sla_policies (name, response_time_hours, resolution_time_hours, escalation_threshold_hours, priority_level) VALUES
('Standard Support', 4, 24, 12, 'Medium'),
('Critical Support', 1, 4, 2, 'Critical'),
('Routine Support', 8, 48, 24, 'Low');
