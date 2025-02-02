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
        let deptId;
        if (deptRes.rows.length > 0) {
            deptId = deptRes.rows[0].id;
            return deptId;
        } else {
            // Insert new department
            const newDeptRes = await pool.query('INSERT INTO department (name) VALUES ($1) RETURNING id', [departmentName]);
            deptId = newDeptRes.rows[0].id;
            return deptId;
        }
    }

    async employeeRoleInsert(roleTitle: string, salary: number, departmentId: number): Promise<number> {
        const roleRes = await pool.query('SELECT id FROM role WHERE title = $1 AND salary = $2 AND department = $3', [roleTitle, salary, departmentId]);
        let roleId;
        if (roleRes.rows.length > 0) {
            roleId = roleRes.rows[0].id;
            return roleId;
        } else {
            // Insert new role
            const newRoleRes = await pool.query('INSERT INTO role (title, salary, department) VALUES ($1, $2, $3) RETURNING id', [roleTitle, salary, departmentId]);
            roleId = newRoleRes.rows[0].id;
            return roleId;
        }
    }

    async employeeMgrInsert(managerId: string): Promise<(number | null)> {
        let mgrId;
        if (managerId === 'None') {
            mgrId = null;
            return mgrId;
        } else {
            const returnId = await pool.query('SELECT id FROM employee WHERE first_name = $1 AND last_name = $2', [managerId.split(' ')[0], managerId.split(' ')[1]]);
            mgrId = returnId.rows[0].id;
            return mgrId;
        }
    }
}

export default BaseSystem;