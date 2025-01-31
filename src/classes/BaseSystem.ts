import { pool } from '../utils/connection.js';

abstract class BaseSystem {
    async getCurrentEmployees(): Promise<string[]> {
        try {
            const query = await pool.query('SELECT id, first_name, last_name FROM employee');
            return query.rows.map(row => `${row.first_name} ${row.last_name}`);
        } catch (err) {
            console.error('Error getting employees', err);
            throw err;
        }
    }

    async getMgrsList(): Promise<string[]> {
        try {
            const query = await pool.query('SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL');
            return query.rows.map(row => `${row.first_name} ${row.last_name}`);
        } catch (err) {
            console.error('Error getting managers', err);
            throw err;
        }
    }

    // Method to check if a department exists or not. Insert if needed, and return the department ID
    async employeeDeptInsert(departmentName: string): Promise<number> {
        const deptRes = await pool.query('SELECT id FROM department WHERE name = $1', [departmentName]);
        if (deptRes.rows.length > 0) {
            return deptRes.rows[0].id;
        } else {
            // Insert new department
            const newDeptRes = await pool.query('INSERT INTO department (name) VALUES ($1) RETURNING id', [departmentName]);
            return newDeptRes.rows[0].id;
        }
    }

    async employeeRoleInsert(roleTitle: string, salary: number, departmentId: number): Promise<number> {
        const roleRes = await pool.query('SELECT id FROM role WHERE title = $1 AND department = $2', [roleTitle, departmentId]);
        if (roleRes.rows.length > 0) {
            return roleRes.rows[0].id;
        } else {
            // Insert new role
            const newRoleRes = await pool.query('INSERT INTO role (title, salary, department) VALUES ($1, $2, $3) RETURNING id', [roleTitle, salary, departmentId]);
            return newRoleRes.rows[0].id;
        }
    }

    async employeeMgrInsert(managerId: string): Promise<(number | null)> {
        if (managerId === 'None') {
            return null;
        } else {
            const returnId = await pool.query('SELECT id FROM employee WHERE first_name = $1 AND last_name = $2', [managerId.split(' ')[0], managerId.split(' ')[1]]);
            return returnId.rows[0].id;
        }
    }
}

export default BaseSystem;