const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: 'root',
  
    // Be sure to update with your own MySQL password!
    password: '',
    database: 'employeeDB',
  });

// enter department
// id
// name

function createDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Department name?',
            name: 'department'
        },
        {
            name: 'number',
            message: 'Enter the id number of the department.',
            name: 'departmentId'
        }
    ])
}

// create role
// id
// title
// salary
// department
function createRole() {
    inquirer.prompt([
        {
            type: 'number',
            message: 'Enter the id number for this role.',
            name: 'roleId'
        },
        {
            type: 'input',
            message: 'Enter the title of the role.',
            name: 'role'
        },
        {
            type: 'number',
            message: 'Enter the salary associated with this role.',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'Select the department for this role.',
            choices: [department], //should be a list based on departments entered above
            name: 'roleDepartment'
        }
    ])
}

// create employee
// id
// first name
// last name
// role id (=6)
// manager id (refers to another employee)
function createEmployee() {
    inquirer.prompt([
        {
            type: 'number',
            message: 'Enter the id number for this employee.',
            name: 'employeeId'  
        },
        {
            type: 'input',
            message: 'Enter the first name of this employee',
            name: 'firstName'  
        },
        {
            type: 'input',
            message: 'Enter the last name of this employee',
            name: 'lastName'  
        },
        {
            type: 'list',
            message: 'What is the role of this employee?', // list based on role variable response
            choices: '[role]',
            name: 'employeeRole'  
        },
        {
            type: 'input',
            message: 'Who is the manager?',
            name: 'employeeManager'  
        },
    ])
}