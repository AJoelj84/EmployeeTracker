const inquirer = require('inquirer')
const mysql = require('mysql2')
const consoleTable = require('console.table')

const db = mysql.createConnection(
    {
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'company_db'
    },
console.log(`Connected to the company_db database.`)
  );

//Prompt for Action to be taken
const questions =
    {
    type: 'list',
    message: 'What would you like to do?',
    name: 'action',
    choices: ['View All Employees', 
              'Add Employee', 
              'Update Employee Role', 
              'View All Roles',
              'Add Role',
              'View All Departments',
              'Add Department',
              'Quit']
    };

//Function to handle response
function chooseAction() {
    inquirer
    .prompt(questions)
    .then((response) => {
        if (response.action === "Quit"){
            return;
        } else {
        employeeView(response);
   
        }
    })
};
//Switches depending on Chosen response
const employeeView = async (response) => {
    switch(response.action) {
        case "View All Employees":
            return viewEmployees()
        case "Add Employee":
            return addEmployee()
        case "Update Employee Role":
            console.log("updated employee role chosen");
            return updateRole()
        case "View All Roles":
            return viewRoles();
        case "Add Role":
            return addRole();
        case "View All Departments":
            return viewDepartments();
        case "Add Department":
            return addDepartment();
        case "Quit":
            console.log("Quitting");
            return;
    }
};




