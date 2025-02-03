import inquirer from 'inquirer';
import { pool, transaction } from '../utils/connection.js'

class DeleteSystem {
    // Function for deleting an employee
    async deleteEmployee(): Promise<void> {
        try {
            // Query to get all employees and the number of employees they manage
            const empList = await pool.query(`
                SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name,
                COUNT(m.id) as manages_count
                FROM employee e
                LEFT JOIN employee m ON e.id = m.manager_id
                GROUP BY e.id
                ORDER BY name`);

            // If no employees found, return message and exit
            if (empList.rows.length === 0) {
                console.log('No employees found in the database. Please add employees before deleting.');
                return;
            }

            // Prompt user to select an employee to delete
            const { employeeId } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: 'Select an employee to delete:',
                    choices: empList.rows.map(row => ({
                        name: `${row.name} - Manages ${row.manages_count} employees`,
                        value: row.id
                    }))
                }
            ]);

            // Find the selected employee in the list
            const selectedEmployee = empList.rows.find(row => row.id === employeeId);

            // If the selected employee manages other employees, prompt user to confirm deletion
            if (selectedEmployee?.manages_count > 0) {
                const { confirm } = await inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'confirm',
                        message: `This employee manages ${selectedEmployee.manages_count} employees. Are you sure you want to delete this employee?`,
                        default: false
                    }
                ]);

                // If user cancels deletion, log message and exit
                if (!confirm) {
                    console.log('Employee deletion cancelled');
                    return;
                }
            }

            // Transaction to update employees managed by the selected employee and delete the selected employee
            const result = await transaction([
                {
                    text: 'UPDATE employee SET manager_id = NULL WHERE manager_id = $1',
                    params: [employeeId]
                },
                {
                    text: 'DELETE FROM employee WHERE id = $1',
                    params: [employeeId]
                }
            ]);

            // Log success message if employee is deleted
            const deleteResult = result[1];
            if (deleteResult.rowCount === 1) {
                console.log(`Successfully deleted employee (ID: ${employeeId})`);
                if (selectedEmployee?.manages_count > 0) {
                    console.log(`Updated ${selectedEmployee.manages_count} employees to have no manager`);
                }
            }
        } catch (err) {
            console.error('Error deleting employee', err);
            throw err;
        }
    }

    // Function for deleting a role
    async deleteRole(): Promise<void> {
        try {
            // Query to get all roles and the number of employees assigned to each role
            const rolesList = await pool.query(`
                SELECT r.id, r.title,
                COUNT(e.id) AS employee_count
                FROM role r
                LEFT JOIN employee e ON r.id = e.role_id
                GROUP BY r.id
                ORDER BY r.title`);

            // If no roles found, return message and exit
            if (rolesList.rows.length === 0) {
                console.log('No roles found in the database. Please add roles before deleting.');
                return;
            }

            // Prompt user to select a role to delete
            const { roleId } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'Select a role to delete:',
                    choices: rolesList.rows.map(row => ({
                        name: `${row.title} - ${row.employee_count} employees`,
                        value: row.id
                    }))
                }
            ]);

            // Find the selected role in the list
            const selectedRole = rolesList.rows.find(row => row.id === roleId);

            // If the selected role is assigned to employees, prompt user to confirm deletion
            // First get alternative roles to re-assign employees to, if no alternative roles exist, log message and exit
            if (selectedRole?.employee_count > 0) {
                const alternativeRoles = await pool.query(`
                    SELECT id, title
                    FROM role
                    WHERE id != $1
                    ORDER BY title`, [roleId]);

                if (alternativeRoles.rows.length === 0) {
                    console.log('Cannot delete - no alternative roles exist');
                    return;
                }

                // Prompt user to choose an action: cancel deletion or re-assign employees to another role
                const { action } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'action',
                        message: `This role is assigned to ${selectedRole.employee_count} employees. Choose action:`,
                        choices: [
                            { name: 'Cancel deletion', value: 'cancel' },
                            { name: 'Re-assign to another role', value: 'reassign' }
                        ]
                    }
                ]);

                // If user cancels deletion, log message and exit
                if (action === 'cancel') {
                    console.log('Role deletion cancelled');
                    return;
                }

                // Prompt user to select a role to re-assign employees to
                const { newRoleId } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'newRoleId',
                        message: 'Select a role to re-assign employees to:',
                        choices: alternativeRoles.rows.map(row => ({
                            name: row.title,
                            value: row.id
                        }))
                    }
                ]);

                // Transaction to update employees assigned to the selected role and delete the selected role
                await transaction([
                    {
                        text: 'UPDATE employee SET role_id = $1 WHERE role_id = $2',
                        params: [newRoleId, roleId]
                    },
                    {
                        text: 'DELETE FROM role WHERE id = $1',
                        params: [roleId]
                    }
                ]);

                console.log(`Reassigned ${selectedRole.employee_count} employees and deleted role (ID: ${roleId})`);
            } else { // If the selected role is not assigned to any employees, delete the role
                await pool.query('DELETE FROM role WHERE id = $1', [roleId]);
                console.log(`Successfully deleted role (ID: ${roleId})`);
            }

        } catch (err) {
            console.error('Error deleting role', err);
            throw err;
        }
    }

    // Function for deleting a department
    async deleteDepartment(): Promise<void> {
        try {
            // Query to get all departments and the number of roles assigned to each department
            const deptList = await pool.query(`
                SELECT d.id, d.name,
                COUNT(r.id) AS role_count
                FROM department d
                LEFT JOIN role r ON d.id = r.department
                GROUP BY d.id
                ORDER BY d.name`);

            // If no departments found, return message and exit
            if (deptList.rows.length === 0) {
                console.log('No departments found in the database. Please add departments before deleting.');
                return;
            }

            // Prompt user to select a department to delete
            const { deptId } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'deptId',
                    message: 'Select a department to delete:',
                    choices: deptList.rows.map(row => ({
                        name: `${row.name} - ${row.role_count} roles`,
                        value: row.id
                    }))
                }
            ]);

            // Find the selected department in the list
            const selectedDept = deptList.rows.find(row => row.id === deptId);

            // If the selected department is assigned to roles, prompt user to confirm deletion
            if (selectedDept?.role_count > 0) {
                const alternativeDepts = await pool.query(`
                    SELECT id, name
                    FROM department
                    WHERE id != $1
                    ORDER BY name`, [deptId]);

                // If no alternative departments exist, log message and exit
                if (alternativeDepts.rows.length === 0) {
                    console.log('Cannot delete - no alternative departments exist');
                    return;
                }


                // Prompt user to choose an action: cancel deletion or re-assign roles to another department
                const { action } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'action',
                        message: `This department is assigned to ${selectedDept.role_count} roles. Choose action:`,
                        choices: [
                            { name: 'Cancel deletion', value: 'cancel' },
                            { name: 'Re-assign to another department', value: 'reassign' }
                        ]
                    }
                ]);

                // If user cancels deletion, log message and exit
                if (action === 'cancel') {
                    console.log('Department deletion cancelled');
                    return;
                }

                // Prompt user to select a department to re-assign roles to
                const { newDeptId } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'newDeptId',
                        message: 'Select a department to re-assign roles to:',
                        choices: alternativeDepts.rows.map(row => ({
                            name: row.name,
                            value: row.id
                        }))
                    }
                ]);

                // Transaction to update roles assigned to the selected department and delete the selected department
                await transaction([
                    {
                        text: 'UPDATE role SET department = $1 WHERE department = $2',
                        params: [newDeptId, deptId]
                    },
                    {
                        text: 'DELETE FROM department WHERE id = $1',
                        params: [deptId]
                    }
                ]);

                console.log(`Reassigned ${selectedDept.role_count} roles and deleted department (ID: ${deptId})`);
            } else { // If the selected department is not assigned to any roles, delete the department
                await pool.query('DELETE FROM department WHERE id = $1', [deptId]);
                console.log(`Successfully deleted department (ID: ${deptId})`);
            }

        } catch (err) {
            console.error('Error deleting department', err);
            throw err;
        }
    }
}

export default DeleteSystem;