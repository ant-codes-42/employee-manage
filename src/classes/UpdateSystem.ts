import inquirer from 'inquirer';
import { pool } from '../utils/connection.js'
import { validateDBString } from '../utils/validator.js';
import BaseSystem from './BaseSystem.js';

class UpdateSystem extends BaseSystem {
    async updateEmployeeRole(): Promise<void> {
        const mgrsList = await this.getMgrsList();
        const empList = await this.getCurrentEmployees();
        const answers = await inquirer.prompt([
            { name: 'fullName', message: 'Select employee:', type: 'list', choices: [...empList] },
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

        const empId = await pool.query('SELECT id FROM employee WHERE first_name = $1 AND last_name = $2', [answers.fullName.split(' ')[0], answers.fullName.split(' ')[1]]);
        
        // Update the employee
        await pool.query('UPDATE employee SET role_id = $1, manager_id = $2 WHERE employee.id = $3', [roleId, answers.managerId, empId]);
    }

    async updateEmployeeManager(): Promise<void> {
        const mgrsList = await this.getMgrsList();
        const empList = await this.getCurrentEmployees();
        const answers = await inquirer.prompt([
            { name: 'fullName', message: 'Select employee:', type: 'list', choices: [...empList] },
            { name: 'managerId', message: 'Manager (optional):', type: 'list', choices: [...mgrsList, 'None'] }
        ]);

        // Reset the value of managerId to the DB id of what was chosen in the prompt
        answers.managerId = this.employeeMgrInsert(answers.managerId);

        const empId = await pool.query('SELECT id FROM employee WHERE first_name = $1 AND last_name = $2', [answers.fullName.split(' ')[0], answers.fullName.split(' ')[1]]);

        // Update the employee
        await pool.query('UPDATE employee SET manager_id = $1 WHERE employee.id = $2', [answers.managerId, empId]);

    }
}

export default UpdateSystem;