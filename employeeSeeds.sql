DROP DATABASE IF EXISTS employeeDB;

CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  departmentId INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (departmentId) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  firstName VARCHAR(30) NOT NULL,
  lastName VARCHAR(30) NOT NULL,
  roleId INT NOT NULL,
  managerId INT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (roleId) REFERENCES role(id) ON DELETE CASCADE,
  FOREIGN KEY (managerId) REFERENCES employee(id) ON DELETE SET NULL
);

INSERT INTO department (id, name) 
VALUES 
  (1, 'sales'),
  (2, 'marketing'),
  (3, 'IT');

INSERT INTO role (id, title, salary, departmentId)
VALUES
  (1, 'sales manager', 500, 1),
  (2, 'sales rep', 450, 1),
  (3, 'cashier', 6, 2),
  (4, 'marketing manager', 45, 2),
  (5, 'on/off coordinator', 400000, 3),
  (6, 'dancing clown', 3000000, 3);

INSERT INTO employee (id, firstName, lastName, roleId, managerId)
VALUES
  (1, 'Joe', 'Guy', 1, null),
  (2, 'Guy', 'Joe', 2, 1),
  (3, 'Joe', 'Joe', 2, 1),
  (4, 'Fred', 'Woman', 4, null),
  (5, 'Alfred', 'Crow', 3, 4),
  (6, 'Not', 'Joe', 3, 4),
  (7, 'Onion', 'Joe', 5, null),
  (8, 'Pie', 'Smith Jones Cartwright', 6, 7),
  (9, 'Joe', 'Switch', 6, 7);