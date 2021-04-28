const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
    host: 'localhost',
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: 'root',
  
    // Be sure to update with your own MySQL password!
    password: 'BigPeach',
    database: 'employeeDB',
  });

// enter department
// id
// name

async function start() {
    const response = await inquirer.prompt([
    {
        type: 'input',
        message: 'Team name?',
        name: 'team',
    }])
    teamName = response.team;
    await startMenu()
}

async function startMenu() {
    const response = await inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                { value: 'department', name: 'Create a department' },
                { value: 'role', name: 'Create a role' },
                { value: 'employee', name: 'Create a employee' },
                { value: 'exit', name: 'Begone' },
            ],
            name: 'startMenu'
        }
        // {
        //     name: 'number',
        //     message: 'Enter the id number of the department.',
        //     name: 'departmentId'
        // }
    ])
    // go to different function depending on response
    console.log(response);
    switch (response.startMenu) {
        case 'department':
            await createDepartment();
            break;
        case 'role':
            await createRole();
            break;
        case 'employee':
            await createEmployee();
            break;
        default:
            console.log('Unexpected value!', response)
    }
};

// const queryPromised = util.promisify(connection.query)

// create role
// id
// title
// salary
// department ID
async function createRole() {
    const query = 'SELECT * FROM department';
    // const replacements = [ answer.artist ];

    // connection.query(query, replacements, (err, res) => {
    //     // do stuff after query
    // });

    const res = await new Promise((resolve, reject) => {
        connection.query(query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
            // do stuff after query
        });
    });
    // do stuff after query

    // const res = queryPromised(query);
    // do stuff after query

    if(!res.length) {
        console.log('Sorry! No departments found!')
        await startMenu();
        return;
    } 

    const response = await inquirer.prompt([
        {   
            // not sure I need this?
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
            choices: res, //should be a list based on departments entered above
            name: 'roleDepartment'
        }
    ])

console.log(response);
}

// create employee
// id
// first name
// last name
// role id (=6)
// manager id (refers to another employee)
async function createEmployee() {
    const response = await inquirer.prompt([
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

start().then(() => {
    console.log('All done!');
}).catch((error) => {
    console.error('Whoops!', error);
})