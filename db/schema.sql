-- drop database if exist then create new database
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

\c employee_db;
-- Creating a table department
CREATE TABLE department(
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);
-- CREATING THE ROLE TABLE WITH THE DEPARTMENT ID AS A FOREIGN KEY
CREATE TABLE role(
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id)
  REFERENCES department(id)
  ON DELETE SET NULL 
);
-- CREATING EMPLOYEE TABLE WITH WITH ROLE ID AS A FOREIGN KEY
CREATE TABLE employee(
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id)
  REFERENCES role(id)
  ON DELETE SET NULL
);
