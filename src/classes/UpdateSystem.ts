import inquirer from 'inquirer';
import { pool } from '../utils/connection.js';

class UpdateSystem {
    // Method to update an employee's role
    async updateEmployeeRole(): Promise<void> {
        try {
            // Get list of employees and roles
            const empList = await pool.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee ORDER BY last_name, first_name`);
            const rolesList = await pool.query(`SELECT r.id, r.title, r.salary, d.name AS department FROM role r
            INNER JOIN department d ON r.department = d.id ORDER BY d.name, r.title`);

            // If no employees or roles found, return
            if (empList.rows.length === 0 || rolesList.rows.length === 0) {
                console.log('No employees and/or roles found in the database. Please add employees and roles before updating.');
                return;
            }

            // Prompt user to select an employee and a new role
            const { employeeId, roleId } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: 'Select an employee to update:',
                    choices: empList.rows.map(row => ({ name: row.name, value: row.id }))
                },
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'Select a new role:',
                    choices: rolesList.rows.map(row => ({
                        name: `Title: ${row.title} - Salary: ${row.salary} - Department: ${row.department}`,
                        value: row.id
                    }))
                }
            ]);

            // Update the employee's role
            const result = await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *', [roleId, employeeId]);

            if (result.rowCount === 1) {
                console.log(`Employee role updated successfully`);
            }
        } catch (err) {
            console.error('Error updating employee role', err);
            throw err;
        }
    }

    // Method to update an employee's manager
    async updateEmployeeManager(): Promise<void> {
        try {
            // Get list of employees
            const empList = await pool.query(`SELECT e.id,
                CONCAT(e.first_name, ' ', e.last_name) AS name,
                r.title
                FROM employee e
                JOIN role r ON e.role_id = r.id
                ORDER BY last_name, first_name`);

            // If no employees found, return
            if (empList.rows.length === 0) {
                console.log('No employees found in the database. Please add employees before updating.');
                return;
            }

            // Prompt user to select an employee
            const { employeeId } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: 'Select an employee to update:',
                    choices: empList.rows.map(row => ({ name: `Name: ${row.name} - Title: ${row.title}`, value: row.id }))
                }
            ]);
            
            // Prompt user to select a new manager
            const { managerId } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'managerId',
                    message: 'Select a new manager:',
                    choices: empList.rows
                        .filter(row => row.id !== employeeId)
                        .map(row => ({ name: `Name: ${row.name} - Title: ${row.title}`, value: row.id }))
                }
            ]);

            // Update the employee's manager
            const result = await pool.query('UPDATE employee SET manager_id = $1 WHERE id = $2 RETURNING *', [managerId, employeeId]);

            if (result.rowCount === 1) {
                console.log(`Employee manager updated successfully`);
            }
        } catch (err) {
            console.error('Error updating employee manager', err);
            throw err;
        }
    }

}

export default UpdateSystem;