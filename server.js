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
    console.log('\n');
    initializeApplication();
    console.log('\n');
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
    console.log('\n');
    initializeApplication();
    console.log('\n');
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
    JOIN employee manager 
    ON employee.manager_id = manager.id

    `;
  pool.query(sql, function(error,{rows}){
    console.table(rows);
    console.log('\n');
    initializeApplication();
    console.log('\n');
  })

 }
// function to add a department
function addDepartment(){
  inquirer.prompt({
      type: 'input',
      message: 'Which department would you like to add?',
      name: 'department'
    }).then((answer)=>{
      const sql =`INSERT INTO department (name) VALUES($1)`
      pool.query(sql,[answer.department], function(error,{rows}){
        console.log('New department has been added');
        console.log('\n');
        initializeApplication();
        console.log('\n');
      })

    })
}
//function to add new employess
function addEmployee(){
  //geting the role titles
  pool.query(`SELECT DISTINCT title, id FROM role`,(error, role_result)=>{
    if(error) throw error;
  // getting the managers last and first names
  pool.query(`SELECT DISTINCT CONCAT(manager.first_name, '', manager.last_name) AS manager_name, manager.id
    FROM employee
    JOIN employee manager 
    ON employee.manager_id = manager.id`, (error, manager_result)=>{
      //if there is a error throw error
      if(error) throw error;
      //else ask user for inputs for adding the new employee
      inquirer.prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is the employee's first name?",
        },
        {
          name: "last_name",
          type: "input",
          message: "What is the employee's last name?",
        },
        {
          name: "role",
          type: "list",
          message: "What is the employee's role?",
          choices: () =>
          role_result.rows.map((role_result) => role_result.title),
        },
        {
          name: 'manager',
          type: 'list',
          message: "Who is the employee's manager?",
          choices: () =>
          manager_result.rows.map((manager_result) => manager_result.manager_name),
      }])
      .then((answer)=>{
        const managerId = manager_result.rows.filter((manager_result)=>manager_result.manager_name === answer.manager)[0].id;
        const roleId = role_result.rows.filter((role_result)=> role_result.title === answer.role)[0].id;

        let employee = {
            mangeer_id: managerId,
            role_id: roleId,
            first_name: answer.first_name,
            last_name: answer.last_name
              }
//the sql query to insert the data
        let sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id)
              VALUES ($1, $2, $3, $4)`;
        pool.query(sql,
          [
            employee.first_name,
            employee.last_name,
            employee.role_id,
            employee.mangeer_id
          ],
          (error)=>{
          if(error) throw error;
          console.log(answer.first_name + ' ' + answer.last_name + " is successfully added!");
          initializeApplication();
        })
      })
    })
  })
}
//function to add new role to the database
function addRole(){
  pool.query(`SELECT DISTINCT * FROM department`,(error,department_result)=>{
    if(error) throw error;
    inquirer.prompt([
      {
        name:'role',
        type:'input',
        message: 'What is the title of the role you like to add?',
      },
      {
        name:'salary',
        type:'input',
        message: 'What is the salary of the role? (Must be a number without separating commas)',
        validate: input =>{
          if(isNaN(input)){
            console.log('please enter a number')
            return false;
          }else{
            return true;
          }
        }
      },
      {
        name:'department',
        type:'list',
        message:'What department does the role belong to:',
        choices: ()=>department_result.rows.map((department_result)=>department_result.name)
      }
    ]).then((answer)=>{
      const departmentId = department_result.rows.filter((department_result)=> department_result.name === answer.department)[0].id;

      let role ={
        title:answer.role,
        salary:answer.salary,
        department_id:departmentId
      }
      const sql= `INSERT INTO role(title, salary, department_id)
                  VALUES ($1, $2, $3)`;
      pool.query(sql,
        [
          role.title,
          role.salary,
          role.department_id

        ],
          function (error){
            if(error) throw error;
            console.log(answer.role + ' Successfully add to role under ' + answer.department);
          initializeApplication();
        })
    })
  })
}



//  let employee = {
//             mangeer_id: answer.managerId,
//             role_id: answer.roleId,
//             first_name: answer.first_name,
//             last_name: answer.last_name
//               }
// //the sql query to insert the data
//         let sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id)
//               VALUES ($1, $2, $3, $4)`;
//         pool.query(sql,
//           [
//             employee.first_name,
//             employee.last_name,
//             employee.role_id,
//             employee.mangeer_id
//           ],