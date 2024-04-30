//the packages needed for the application

const inquirer = require('inquirer');
const { default: Choices } = require('inquirer/lib/objects/choices');
require('dotenv').config();

// Import and require Pool (node-postgres)
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
//Connect to database
// console.log(process.env.DB_PASSWORD)

const pool = new Pool(
  {
    user: 'postgres',
    password: 'Valentino1234',
    host: 'localhost',
    database: 'employee_db',
    port: 5434
    
  },
  console.log(`Connected to the employee_db database.`)
)
pool.connect();

function initializeApplication(){
  inquirer.prompt({
      type: 'list',
      message: 'What would you like to do?',
      name: 'choice',
      choices:[
        "View all Departments",
        "View all Roles",
        "View all Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee Role",
        "Exit",
      ]
    

  }).then((answer)=>{
    if(answer.choice === "View all Departments"){
      viewAllDepartments();
    }
    else if(answer.choice === "View all Roles"){
      viewAllRoles();
    }
    else if(answer.choice === "View all Employees"){
      viewAllEmployee();
    }
    else if(answer.choice === "Add a Department"){
      addDepartment();
    }
    else if(answer.choice === "Add a Role"){
      addRole();
    }
    else if(answer.choice === "Add an Employee"){
      addEmployee();
    }
    else if(answer.choice === "Update an Employee Role"){
      updateEmployeeRole();
    }
    else{
      quit();
    }
  })
}



initializeApplication();

//function to exit the program
function quit(){
  console.log('Goodbye');
  process.exit()
}

//function to view all the departments
function viewAllDepartments(){
  const sql =`SELECT department.id, department.name FROM department`;
  pool.query(sql, function(error,{rows}){
    console.table(rows);
    initializeApplication(),'\n';
  })
}
//functiont to show all the roles in the table
function viewAllRoles(){
  const sql =`    
    SELECT role.id, role.title, department.name AS Department, role.salary
    FROM role
    INNER JOIN department 
    ON role.department_id = department.id ORDER BY role.id`;
  pool.query(sql, function(error,{rows}){
    console.table(rows);
    initializeApplication(),'\n';
  })

}

//function to view all employees
 function viewAllEmployee(){
    const sql =`    
   SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary AS salary,
    CONCAT(manager.first_name, '', manager.last_name) AS manager
    FROM employee
    JOIN role
    ON employee.role_id = role.id 
    JOIN department
    ON role.department_id = department.id
    JOIN employee manager ON employee.manager_id = manager.id

    `;
  pool.query(sql, function(error,{rows}){
    console.table(rows);
    initializeApplication(),'\n';
  })

 }



