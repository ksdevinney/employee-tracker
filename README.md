# Employee Tracker

## Description
![demo gif](/assets/employee-tracker.gif)

This is a command line application tht allows the user to track departments, roles, and employees of a company. Departments, roles, and employees can be added, along with a bit of information for each. For example, roles can be associated with a salary and a manager. Roles include basic information about the employee (first and last name), then they can also be associated with a manager. All classes can be viewed as a table in the terminal. Employee information can be updated.

## Development

This application was developed using JavaScript as the main programming language. The application interacts with a database using MySQL and Express. 

## How to use

Because this is a command-line application, it must be downloaded in order to run. The user can clone this repository by navigating to the desired folder in the terminal, then using the command

`git clone https://github.com/ksdevinney/employee-tracker.git`

Because there are NPM dependencies, the user will then need to enter

`npm i`

In the terminal to install the required packages. Finally, the app can be started with the command

`npm start`

From there, the user will navigate through the options. Each selection, when completed, will lead the user back to the start menu.

It is important to note that the SQL file contains seed data. If the application is used without the seeds, information will need to be added in order: departments, roles, employees. Otherwise, an error will throw.

A video demonstrating the functionality of the app can be viewed [here](https://youtu.be/bJHR1gGOUX4).
