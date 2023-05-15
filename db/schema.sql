DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

DROP TABLE IF EXISTS department;
CREATE TABLE department (
  dept_id INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30),
  PRIMARY KEY (dept_id)
);

DROP TABLE IF EXISTS role;
CREATE TABLE role (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_title VARCHAR(30),
  salary DECIMAL,
  dept_id INT,
  FOREIGN KEY (dept_id)
  REFERENCES department(dept_id)
  ON DELETE SET NULL
);

DROP TABLE IF EXISTS employee;
CREATE TABLE employee (
  employee_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id)
  REFERENCES role(role_id)
  ON DELETE SET NULL
);