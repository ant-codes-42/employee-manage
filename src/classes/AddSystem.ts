import inquirer from 'inquirer';
import { pool } from '../utils/connection.js'
import { validateDBString } from '../utils/validator.js';

class AddSystem {

    async addEmployee(): Promise<void> {
        const mgrsList = await this.getMgrsList();
        const answers = await inquirer.prompt([
            { name: 'firstName', message: 'First Name:', type: 'input', validate: validateDBString },
            { name: 'lastName', message: 'Last Name:', type: 'input', validate: validateDBString },
            { name: 'roleTitle', message: 'Role Title:', type: 'input', validate: validateDBString },
            { name: 'departmentName', message: 'Department Name:', type: 'input', validate: validateDBString },
            { name: 'salary', message: 'Salary:', type: 'number' },
            { name: 'managerId', message: 'Manager (optional):', type: 'list', choices: [...mgrsList, 'None'] },
        ]);

        let departmentId;
        let roleId;

        // Check if department exists
        const deptRes = await pool.query('SELECT id FROM department WHERE name = $1', [answers.departmentName]);
        if (deptRes.rows.length > 0) {
            departmentId = deptRes.rows[0].id;
        } else {
            // Insert new department
            const newDeptRes = await pool.query('INSERT INTO department (name) VALUES ($1) RETURNING id', [answers.departmentName]);
            departmentId = newDeptRes.rows[0].id;
        }

        // Check if role exists
        const roleRes = await pool.query('SELECT id FROM role WHERE title = $1 AND department = $2', [answers.roleTitle, departmentId]);
        if (roleRes.rows.length > 0) {
            roleId = roleRes.rows[0].id;
        } else {
            // Insert new role
            const newRoleRes = await pool.query('INSERT INTO role (title, salary, department) VALUES ($1, $2, $3) RETURNING id', [answers.roleTitle, answers.salary, departmentId]);
            roleId = newRoleRes.rows[0].id;
        }

        if (answers.managerId === 'None') {
            answers.managerId = null;
        } else {
            const managerId = await pool.query('SELECT id FROM employee WHERE first_name = $1 AND last_name = $2', [answers.managerId.split(' ')[0], answers.managerId.split(' ')[1]]);
            answers.managerId = managerId.rows[0].id;
        }
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

        let departmentId;

        // Check if department exists
        const deptRes = await pool.query('SELECT id FROM department WHERE name = $1', [answers.departmentName]);
        if (deptRes.rows.length > 0) {
            departmentId = deptRes.rows[0].id;
        } else {
            // Insert new department
            const newDeptRes = await pool.query('INSERT INTO department (name) VALUES ($1) RETURNING id', [answers.departmentName]);
            departmentId = newDeptRes.rows[0].id;
        }

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

    async getMgrsList(): Promise<string[]> {
        try {
            const query = await pool.query('SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL');
            return query.rows.map(row => `${row.first_name} ${row.last_name}`);
        } catch (err) {
            console.error('Error getting managers:', err);
            throw err;
        }
    }
}

export default AddSystem;