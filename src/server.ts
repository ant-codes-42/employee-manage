import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';

await connectToDb();

inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'mainMenu',
            choices: [
                'View',
                'Add',
                'Update',
                'Delete',
                'Quit'
            ]
        }
    ])

inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'viewMenu',
            choices: [
                'View all employees',
                'View employees by manager',
                'View employees by department',
                'View all departments',
                'View all roles',
                'Back'
            ]
        }
    ])

inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'addMenu',
            choices: [
                'Add an employee',
                'Add role',
                'Add department',
                'Back'
            ]
        }
    ])

inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'updateMenu',
            choices: [
                'Update employee role',
                'Update employee manager',
                'Back'
            ]
        }
    ])

inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'deleteMenu',
            choices: [
                'Delete an employee',
                'Delete a role',
                'Delete a department',
                'Back'
            ]
        }
    ])