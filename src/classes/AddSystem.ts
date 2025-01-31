import inquirer from 'inquirer';
import { pool } from '../utils/connection.js'
import { validateDBString } from '../utils/validator.js';
import BaseSystem from './BaseSystem.js';

class AddSystem extends BaseSystem {

    async addEmployee(): Promise<void> {
        const mgrsList = await this.getMgrsList();
        const answers = await inquirer.prompt([
            { name: 'firstName', message: 'First Name:', type: 'input', validate: validateDBString },
            { name: 'lastName', message: 'Last Name:', type: 'input', validate: validateDBString },
            { name: 'roleTitle', message: 'Role Title:', type: 'input', validate: validateDBString },
            { name: 'departmentName', message: 'Department Name:', type: 'input', validate: validateDBString },
            { name: 'salary', message: 'Salary:', type: 'number' },
            { name: 'managerId', message: 'Manager (optional):', type: 'list', choices: [...mgrsList, 'None'] }
        ]);

        // Check if department exists, insert if needed
        const departmentId = await this.employeeDeptInsert(answers.departmentName);

        // Check if role exists, insert if needed
        const roleId = await this.employeeRoleInsert(answers.roleTitle, answers.salary, departmentId);

        // Reset the value of managerId to the DB id of what was chosen in the prompt
        answers.managerId = this.employeeMgrInsert(answers.managerId);

        // Insert new employee
        await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.firstName, answers.lastName, roleId, answers.managerId]);

        console.log('Employee added successfully');
    }

    async addRole(): Promise<void> {
        const answers = await inquirer.prompt([
            { name: 'title', message: 'Role Title:', type: 'input', validate: validateDBString },
            { name: 'salary', message: 'Salary:', type: 'number' },
            { name: 'departmentName', message: 'Department:', type: 'input', validate: validateDBString }
        ]);

        // Check if department exists
        const departmentId = await this.employeeDeptInsert(answers.departmentName);

        await pool.query('INSERT INTO role (title, salary, department) VALUES ($1, $2, $3)', [answers.title, answers.salary, departmentId]);
    }

    async addDept(): Promise<void> {
        const answers = await inquirer.prompt([{ name: 'departmentName', message: 'Department:', type: 'input', validate: validateDBString }]);

        // Check if department exists
        const deptRes = await pool.query('SELECT id FROM department WHERE name = $1', [answers.departmentName]);
        if (deptRes.rows.length > 0) {
            console.log('Department already exists!');
            return;
        } else {
            // Insert new department
            await pool.query('INSERT INTO department (name) VALUES ($1) RETURNING id', [answers.departmentName]);
        }
    }
}

export default AddSystem;