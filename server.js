//the pacages needed for the application

const inquirer = require('inquirer');

const express = require('express');



const app = express();
//Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});