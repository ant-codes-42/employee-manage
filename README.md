# Employee Manage

## Description

Employee Manage is a command-line application built to provide a simple interface for managing and tracking employees in a database. It utilizes TypeScript, Node.js, Inquirer, and PostgreSQL to enable this functionality.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Questions](#questions)
- [License](#license)

## Installation

NOTE: You will need to have installed Node.js as a dependency. Please navigate to the [Node.js website](https://nodejs.org) to find installation instructions for your operating system. You will also need to download and install [PostgreSQL](https://www.postgresql.org).

1. Navigate to the [GitHub repository for this project](https://github.com/ant-codes-42/employee-manage).

2. Click on the green '<> Code' button and use the HTTPS/SSH string to clone the repo. Alternatively, click on 'Download ZIP' to download a zip file of the repository (and then unzip that into a folder).

3. Navigate to the root folder containing the contents of the repo in a terminal window.

4. Run 'npm i' to install all required npm package dependencies.

5. Navigate to the /db folder in the root folder of the application.

6. Initialize your Postgres shell. By default this is most commonly 'psql -U postgres' followed by your postgres password.

7. From the Postgres shell run '\i schema.sql' to initialize the database. Once complete, run '\q' to exit the Postgres shell.

8. In your terminal navigate back to the root folder of the application and run 'npm run build'.

9. Once complete, run 'npm run start' to initialize the application.

## Usage

The initial options will present you with View, Add, Update, and Delete.

To add information to the database select the Add option.
NOTE: The recommended order for adding information into the database is as follows:
Departments >>> Roles >>> Employees
This is recommended as roles are dependent on departments and employees are dependent on roles.
- Option to add a department
    - Department Name
- Option to add a role
    - Role Title
    - Salary
    - Select a department (from existing)
- Option to add an employee
    - Employee First Name
    - Employee Last Name
    - Select a role (from existing)
    - Select a manager (optional, from existing)

To update information already existing in the database select the Update option.
- Option to update an employee record to an already existing role
- Option to update an employee record to an already existing manager.

To delete information in the database select the Delete option.
- Delete an employee
    - If the employee is a manager, either cancel or re-assign managerial responsibilities to another employee
- Delete a role
    - If employees are assigned to the role, either cancel or re-assign all employees to another existing role in the database
- Delete a department
    - If roles are assigned to the department, either cancel or re-assign all roles to another existing department in the database.

To view information in the database select the View option.
- View all employee records
- View all employees grouped by manager
- View all employees grouped by department
- View all departments
- View all roles

## Questions

The author maintains a [GitHub account here](https://github.com/ant-codes-42).

## License

This work is licensed under the MIT License.

Copyright 2025 Anthony Schwab

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
OR OTHER DEALINGS IN THE SOFTWARE.

