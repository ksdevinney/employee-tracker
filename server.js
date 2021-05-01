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
    const response = await inquirer.prompt([
        {
            type: 'input',
            message: 'Company name?',
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
                { value: 'newdepartment', name: 'Create a department' },
                { value: 'newrole', name: 'Create a role' },
                { value: 'newemployee', name: 'Create an employee' },
                { value: 'viewdepartment', name: 'View a department' },
                { value: 'viewrole', name: 'View a role' },
                { value: 'viewemployee', name: 'View an employee' },
                // update an employee
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

async function asyncQuery(query, replacements) {
    return new Promise((resolve, reject) => {
        const callback = (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        };
        if (replacements != null) {
            connection.query(query, replacements, callback);
        } else {
            connection.query(query, callback);
        }
    });
}

// const queryPromised = util.promisify(connection.query)

// create role
// id
// title
// salary
// department ID
async function createRole() {
    const query = 'SELECT id,name FROM department';


    // const res = await new Promise((resolve, reject) => {
    //     connection.query(query, (err, res) => {
    //         if (err) {
    //             reject(err);
    //         } else {
    //             let dept =[]
    //             for(let i=0; i<res.length; i++){
    //                 dept.push({
    //                     name: res[i].name,
    //                     value:res[i].id
    //                 })
    //             }
    //             resolve(dept);
    //         }
    //         // do stuff after query
    //     });
    // });
    // do stuff after query
    const res = await asyncQuery(query);
    let dept =[]
    for(let i=0; i<res.length; i++){
        dept.push({
            name: res[i].name,
            value:res[i].id
        })
    }
    resolve(dept);


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

// create employee
// id
// first name
// last name
// role id (=6)
// manager id (refers to another employee)
async function createEmployee() {
    const query = 'SELECT * FROM role';

    const res = await new Promise((resolve, reject) => {
        connection.query(query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                let roles = []
                for(let i=0; i<res.length; i++){
                    roles.push({
                        name: res[i].name,
                        value: res[i].id
                    })
                }
                resolve(roles);
            }
            // do stuff after query
        });
    });
    // do stuff after query


    if (!res.length) {
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
            message: 'What is the role of this employee?',
            choices: res, 
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

// start().then(() => {
//     console.log('All done!');
// }).catch((error) => {
//     console.error('Whoops!', error);
// })