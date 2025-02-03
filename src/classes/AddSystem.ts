import inquirer from 'inquirer';
import { pool } from '../utils/connection.js'
import { validateDBString } from '../utils/validator.js';
import BaseSystem from './BaseSystem.js';

class AddSystem extends BaseSystem {

    async addEmployee(): Promise<void> {
        try {
            const rolesList = await pool.query(`SELECT r.id, r.title, r.salary, d.name AS department FROM role r
                INNER JOIN department d ON r.department = d.id ORDER BY d.name, r.title`);

            const mgrList = await pool.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee ORDER BY name`);
            mgrList.rows.push({ id: null, name: 'None' });

            if (rolesList.rows.length === 0) {
                console.log('No roles found in the database. Please add roles before adding employees.');
                return;
            }

            const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: "Enter employee's first name:",
                    validate: validateDBString,
                    filter: (input: string) => input.trim()
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: "Enter employee's last name:",
                    validate: validateDBString,
                    filter: (input: string) => input.trim()
                },
                {
                    type: 'list',
                    name: 'roleId',
                    message: "Select employee's role:",
                    choices: rolesList.rows.map(row => ({
                        name: `Title: ${row.title} - Salary: ${row.salary} - Department: ${row.department}`,
                        value: row.id
                    }))
                },
                {
                    type: 'list',
                    name: 'managerId',
                    message: "Select employee's manager (optional):",
                    choices: mgrList.rows.map(row => ({ name: row.name, value: row.id }))
                }
            ]);

            const result = await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING id', [firstName, lastName, roleId, managerId]);

            if (result.rows.length === 1) {
                console.log('Employee added successfully');
            }

        } catch (err) {
            console.error('Error adding employee', err);
            throw err;
        }
    }

    async addRole(): Promise<void> {
        try {
            const deptList = await pool.query('SELECT id, name FROM department ORDER BY name');

            if (deptList.rows.length === 0) {
                console.log('No departments found in the database. Please add departments before adding roles.');
                return;
            }

            const { roleTitle, salary, departmentId } = await inquirer.prompt([
                { name: 'roleTitle', message: 'Role title:', type: 'input', validate: validateDBString },
                { name: 'salary', message: 'Salary:', type: 'number', validate: value => (value !== undefined && value > 0) ? true : 'Salary must be a positive number' },
                { name: 'departmentId', message: 'Select department:', type: 'list', choices: deptList.rows.map(row => ({ name: row.name, value: row.id })) }
            ]);

            const result = await pool.query('INSERT INTO role (title, salary, department) VALUES ($1, $2, $3) RETURNING id', [roleTitle, salary, departmentId]);
            console.log('Role created successfully. Role ID:', result.rows[0].id);

        } catch (err) {
            if ((err as { code: string }).code === '23505') {
                console.log('Role already exists!');
                return;
            } else {
                console.error('Error adding role', err);
                throw err;
            }
        }
    }

    async addDept(): Promise<void> {
        try {
            const deptList = await pool.query('SELECT name FROM department');

            const { deptName } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'deptName',
                    message: 'Enter new department name:',
                    validate: (input: string) => {
                        const trimmed = input.trim();
                        if (!trimmed) return 'Department name cannot be empty';
                        if (deptList.rows.some(dept => dept.name === trimmed)) {
                            return `Department '${trimmed}' already exists`;
                        }
                        return true;
                    },
                    filter: (input: string) => input.trim()
                }
            ]);
            const result = await pool.query('INSERT INTO department (name) VALUES ($1) RETURNING id', [deptName]);

            console.log('Department added successfully. Department ID:', result.rows[0].id);
        } catch (err) {
            console.error('Error adding department', err);
        }
    }
}

export default AddSystem;