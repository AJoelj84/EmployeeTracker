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
console.log(`Connected to the Employee database.`)
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
   
        }})
};
//Switches between functions depending on Chosen response
const employeeView = async (response) => {
    switch(response.action) {
        case "View All Employees":
            return viewEmployees()
        case "Add Employee":
            return addEmployee()
        case "Update Employee Role":
            console.log("New Employee Role Chosen");
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
            console.log("Exiting Application");
            return;
    }
};
// Function to make database selections from the mysql files
const viewDepartments = function(){
    db.query('SELECT * FROM department', function (err, results) {
        console.table("Departments", results)
        chooseAction()
    })}

const viewEmployees = function(){
    db.query('SELECT * FROM employee', function (err, results) {
        console.table("Employees", results)
        chooseAction()
    })
}

const viewRoles = function(){
    db.query("SELECT * FROM role", function (err, results) {
        console.table("Roles", results)
        chooseAction();
    })}

const addEmployee = async function(){
    await promptName();
}

const promptName = function(){
    var firstName;
    var lastName;
    var chosenRole;
    var managerId;
    var roles;
    db.query(`SELECT * FROM role`, (err, res) => {
        if (err) {
            console.log(err)
            return
            }
        const roles = res.map((role) => ({
            name: `${role.role_title}`,
            value: role,
        }))

    db.query('SELECT * FROM employee', (err, res) => {
        if (err) {
            console.log(err)
            return
        }
        const managers = res.map((employee) => ({
            name: `${employee.manager_id}`,
            value: employee,     
        }))

        inquirer.prompt([{
            type: 'input',
            name:'firstname',
            message: 'First Name of New Employee?'},
        {
            type: 'input',
            name: 'lastname',
            message: 'Last Name of New Employee?'
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is the Role of New Employee?',
            choices: roles
        },
        {
            type: 'list',
            name: 'manager',
            message: "Who Manages this Employee?",
            choices: managers
        }
        ]).then(
        (resp) => {
            firstName = resp.firstname;
            console.log("First name is " + firstName)
            lastName = resp.lastname;
            console.log("Last name is " + lastName)
            chosenRole = resp.role
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES("${firstName}", "${lastName}", ${chosenRole.role_id}, ${resp.manager.manager_id})`, function (err, results) {
                if (err){
                    console.log("Error inserting data into table: " + err)
                } else {
                console.log(`${firstName} ${lastName} has been added to the database`)
                chooseAction()
                }
            })
        })})
    })};
//Inquirer Function to Update Employee Role
 const updateRole = function(){
    var roles ={};
    db.query(`SELECT * FROM role`, (err, res) => {
            if (err) {
                console.log(err)
                return
            }
            roles = res.map((role) => ({
                name: `${role.role_title}`,
                value: role,
            }))
        })
    db.query('SELECT * FROM employee', (err, results) => {

        if (err) {
          console.log(err);
          return;
        };
    
// Map the employee data to an array of choices for the prompt
const choices = results.map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee,
    }));
   
// Prompt the user to select an employee from the list
inquirer
    .prompt({
        type: 'list',
        name: 'employee',
        message: 'Select an Employee to Update:',
        choices,
        })
    .then((resp) => {
        const employee = resp.employee;
    
// Prompt the user to update the employee data
inquirer
    .prompt([
        {
        type: 'list',
        name: 'roleId',
        message: `What is the Role ID for the New Employee?`,
        choices: roles
        },
            ])
    .then((resp) => {
        const chosenRole = resp.roleId
                
// Update the employee data in the database
    db.query(
        `UPDATE employee SET role_id = ${chosenRole.role_id} WHERE employee_id = ${employee.employee_id}`,
            (err, results) => {
            if (err) {
            console.log('Error updating Employee in database:', err);
            return;
                    }
            console.log(`Role updated for ${employee.first_name} ${employee.last_name}`);
                chooseAction();
                  })
            })
          })
      })};
// Inquirer Prompt for adding a New Department
const addDepartment = function(){
    inquirer.prompt([{
        type: 'input',
        name:'deptName',
        message: 'What is the Name for the New Department?'}
    ]).then(
    (resp) => {
        db.query(`INSERT INTO department (dept_name) VALUES ("${resp.deptName}")`, (err, results) => {
            if (err){
            console.log(err)
            return
            }
            console.log(`${resp.deptName} added to database`)
        chooseAction();
        })
    })};

const addRole = function(){
    db.query('SELECT * FROM department', (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
// Map Department data to an array of choices for Prompt
        const departments = results.map((dept) => ({
          name: `${dept.dept_name}`,
          value: dept,
        }));

    inquirer.prompt([{
        type: 'input',
        name:'roleTitle',
        message: 'What is the Name of the New Role?'},
    {
        type: 'input',
        name: 'salary',
        message: 'What is the New Roles Salary?'
    },
    {
        type: 'list',
        name: 'departmentId',
        message: 'What Department does the New Role fall Under?',
        choices: departments
    }
    ]).then(
    (resp) => {
        db.query(`INSERT INTO role (role_title, salary, dept_id) VALUES("${resp.roleTitle}", ${resp.salary}, ${resp.departmentId.dept_id})`)
        console.log(`${resp.roleTitle} added to database`)
        chooseAction();

    })
})};


// Call to Initialize App
chooseAction();