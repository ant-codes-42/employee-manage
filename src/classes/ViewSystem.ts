import { pool } from '../utils/connection.js'
import BaseSystem from './BaseSystem.js';

interface EmployeeHierarchy {
    employee_id: number;
    employee_name: string;
    title: string;
    salary: string;
    department: string;
    manager_name: string;
}

class ViewSystem extends BaseSystem {
    async viewAllEmployees(): Promise<void> {
        try {
            const { rows } = await pool.query(`
                SELECT
                e.id,
                CONCAT(e.first_name, ' ', e.last_name) AS name,
                r.title,
                TO_CHAR(r.salary, 'L999G999G999D99') AS salary,
                d.name AS department,
                CONCAT(m.first_name, ' ', m.last_name) AS manager
                FROM employee e
                JOIN role r ON e.role_id = r.id
                JOIN department d ON r.department = d.id
                LEFT JOIN employee m ON e.manager_id = m.id
                ORDER BY e.id`);

            if (rows.length === 0) {
                console.log('No employees found in the database.');
                return;
            }

            console.table(rows, ['id', 'name', 'title', 'salary', 'department', 'manager']);

        } catch (err) {
            console.error('Error getting employees', err);
            throw err;
        }
    }

    async viewEmployeesByMgr(): Promise<void> {
        try {
            const { rows } = await pool.query<EmployeeHierarchy>(`
                SELECT
                e.id AS employee_id,
                CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
                r.title,
                TO_CHAR(r.salary, 'L999G999G999D99') AS salary,
                d.name AS department,
                CASE
                    WHEN m.id IS NULL THEN 'No Manager'
                    ELSE CONCAT(m.first_name, ' ', m.last_name)
                END AS manager_name
                FROM employee e
                LEFT JOIN employee m ON e.manager_id = m.id
                JOIN role r ON e.role_id = r.id
                JOIN department d ON r.department = d.id
                ORDER BY manager_name, e.last_name, e.first_name`);

            if (rows.length === 0) {
                console.log('No employees found in the database.');
                return;
            }

            const managerMap = rows.reduce((acc, employee) => {
                const key = employee.manager_name;
                acc[key] = acc[key] || [];
                acc[key].push(employee);
                return acc;
            }, {} as Record<string, EmployeeHierarchy[]>);

            Object.entries(managerMap).forEach(([manager, employees]) => {
                console.log(`\nManager: ${manager}`);
                console.table(employees.map(emp => ({
                    ID: emp.employee_id,
                    Name: emp.employee_name,
                    Title: emp.title,
                    Salary: emp.salary,
                    Department: emp.department
                })));
            });

        } catch (err) {
            console.error('Error getting employees', err);
            throw err;
        }
    }

    async viewEmployeesByDept(): Promise<void> {
        try {

        } catch (err) {
            console.error('Error getting employees', err);
            throw err;
        }
    }

    async viewAllDepts(): Promise<void> {
        try {

        } catch (err) {
            console.error('Error getting departments', err);
            throw err;
        }
    }

    async viewAllRoles(): Promise<void> {
        try {

        } catch (err) {
            console.error('Error getting roles', err);
            throw err;
        }
    }

}

export default ViewSystem;