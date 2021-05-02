const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
    host: '127.0.0.1',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Be sure to update with your own MySQL password!
    password: 'BigPeach',
    database: 'employeeDB',
})
connection.connect(function (err) {
    if (err) throw err;
    console.log("Database connected")
    start()
});

// enter department
// id
// name

async function start() {
    // const response = await inquirer.prompt([
    //     {
    //         type: 'input',
    //         message: 'Company name?',
    //         name: 'team',
    //     }])
    // teamName = response.team;
    await startMenu()
}

async function startMenu() {
    const response = await inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                { value: 'newdepartment', name: 'Create a department' },
                { value: 'newrole', name: 'Create a role' },
                { value: 'newemployee', name: 'Create an employee' },
                { value: 'viewdepartment', name: 'View current departments' },
                { value: 'viewrole', name: 'View current roles' },
                { value: 'viewemployee', name: 'View all employees' },
                { value: 'updateEmployee', name: 'Update an employee' },
                { value: 'exit', name: 'Exit' },
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
        case 'newdepartment':
            await createDepartment();
            break;
        case 'newrole':
            await createRole();
            break;
        case 'newemployee':
            await createEmployee();
            break;
        case 'viewdepartment':
            await viewDepartment();
            break;
        case 'viewrole':
            await viewRole();
            break;
        case 'viewemployee':
            await viewEmployee();
            break;
        case 'updateEmployee':
            await pickEmployee();
            break;
        default:
            process.exit(0);
    }
};

function createDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter department name.',
            name: 'departmentName'
        }
    ])
        .then((response) => {
            connection.query('INSERT INTO department (name) VALUES (?)', response.departmentName, (error, res) => {
                if (error) throw error
                console.log('Department added.');
                startMenu();
            })
        })
}

// const queryPromised = util.promisify(connection.query)

// create role
// id
// title
// salary
// department ID
async function createRole() {
    const query = 'SELECT id,name FROM department';


    const res = await new Promise((resolve, reject) => {
        connection.query(query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                let dept =[]
                for(let i=0; i<res.length; i++){
                    dept.push({
                        name: res[i].name,
                        value:res[i].id
                    })
                }
                resolve(dept);
            }
            // do stuff after query
        });
    });
    // do stuff after query

    if (!res.length) {
        console.log('Sorry! No departments found!')
        startMenu();
        return;
    }

    const response = await inquirer.prompt([
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
    connection.query('INSERT INTO role (title, salary, departmentid) VALUES (? , ? , ?)', [response.role, response.salary, response.roleDepartment],
    (error, res) => {
        if (error) throw error
        console.log('Role added.');
        startMenu();
    })
}

async function listRoles(){
    const query = 'SELECT id, title FROM role';

    const res = await asyncQuery(query);
    let roles = []
    for(let i=0; i<res.length; i++){
        roles.push({
            name: res[i].title,
            value: res[i].id
        })
    } 
    return roles;
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
            message: 'What is the role of this employee?',
            choices: await listRoles(), 
            name: 'employeeRole'
        }
    ])
    console.log(response);
    connection.query('INSERT INTO employee (firstname, lastname, roleid) VALUES (? , ? , ?)', [response.firstName, response.lastName, response.employeeRole],
    (error, res) => {
        if (error) throw error
        console.log('Employee added.');
        startMenu();
    })
}

function viewDepartment() {
    connection.query('SELECT * FROM department' , (error, res) => {
        if (error) throw error
        console.log('Department');
        console.table(res)
        startMenu();
    })
}

function viewRole() {
    connection.query('SELECT role.id, title, salary, name AS department FROM role LEFT JOIN department ON department.id = role.departmentId;' , (error, res) => {
        if (error) throw error
        console.log('Role');
        console.table(res)
        startMenu();
    })
}

function viewEmployee() {
    connection.query('SELECT employee.id, employee.firstName, employee.lastName, CONCAT(manager.firstName, " ", manager.lastName) AS manager, role.title, role.salary, department.name AS department FROM employee LEFT JOIN role ON employee.roleId = role.id LEFT JOIN department ON department.id = role.departmentId LEFT JOIN employee AS manager ON employee.managerId = manager.id;' , (error, res) => {
        if (error) throw error
        console.log('Employee');
        console.table(res)
        startMenu();
    })
}

async function listEmployees(){
    const currentEmployees = 'SELECT id, firstName, lastName FROM employee';

    const res = await asyncQuery(currentEmployees);
    let employees = []
    for(let i=0; i<res.length; i++){
        employees.push({
            name: res[i].firstName + ' ' + res[i].lastName,
            value: res[i].id
        })
    }
    return employees;
}

async function pickEmployee() {
    const response = await inquirer.prompt([
        {
            type: 'list',
            message: 'Update which employee?',
            choices: await listEmployees(),
            name: 'update'
        },
    ]);
    await updateEmployee(response.update);
};   

async function asyncQuery(query, replacements) {
    return await new Promise((resolve, reject) => {
        connection.query(query, replacements, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

async function updateEmployee(employeeId) {
    const jobs = await listRoles();
    if (!jobs.length) {
        console.log('Sorry! No jobs defined!')
        startMenu();
        return;
    }

    const response = await inquirer.prompt([
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
            message: 'New role for this employee?',
            choices: jobs,
            name: 'updateRole'
        },
        {
            type: 'list',
            message: 'Manager for this employee?',
            choices: await listEmployees(),
            name: 'updateManager'
        },
    ])
    await asyncQuery('UPDATE employee SET firstName = ?, lastName = ?, roleId = ?, managerId = ? WHERE id = ?', [response.firstName, response.lastName, response.updateRole, response.updateManager, employeeId])
    await startMenu();
};