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
                { value: 'newdepartment', name: 'Create a department' },
                { value: 'newrole', name: 'Create a role' },
                { value: 'newemployee', name: 'Create an employee' },
                { value: 'viewdepartment', name: 'View a department' },
                { value: 'viewrole', name: 'View a role' },
                { value: 'viewemployee', name: 'View an employee' },
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

function viewDepartment() {
    connection.query('SELECT * FROM department;' , (error, res) => {
        if (error) throw error
        console.log('Department');
        console.log(res)
        startMenu();
    })
}

// start().then(() => {
//     console.log('All done!');
// }).catch((error) => {
//     console.error('Whoops!', error);
// })