import { pool } from '../utils/connection.js'
import { table } from 'table';

// Interface for employee hierarchy
interface EmployeeHierarchy {
    employee_id: number;
    employee_name: string;
    title: string;
    salary: string;
    department: string;
}

class ViewSystem {
    // Method to view all employees
    async viewAllEmployees(): Promise<void> {
        try {
            // Query to get all employees and their details
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

            // If no employees found, return
            if (rows.length === 0) {
                console.log('No employees found in the database.');
                return;
            }

            // Create table headers and data
            const headers = ['ID', 'Name', 'Title', 'Salary', 'Department', 'Manager'];
            const data = [headers, ...rows.map(row => [row.id, row.name, row.title, row.salary, row.department, row.manager])];

            // Display table
            console.log('\n\nEmployee Summary:');
            console.log(table(data));
            console.log('\n\n');

        } catch (err) {
            console.error('Error getting employees', err);
            throw err;
        }
    }

    // Method to view employees by manager
    async viewEmployeesByMgr(): Promise<void> {
        try {
            // Query to get all employees and their details
            const { rows } = await pool.query(`
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

            // If no employees found, return
            if (rows.length === 0) {
                console.log('No employees found in the database.');
                return;
            }

            // Group employees by manager
            const managerGroups = rows.reduce((groups, row) => {
                const manager = row.manager_name;
                groups[manager] = groups[manager] || [];
                groups[manager].push([row.employee_id, row.employee_name, row.title, row.salary, row.department]);
                return groups;
            }, {} as Record<string, [EmployeeHierarchy][]>);

            // Display employees grouped by manager and display in table format
            for (const [manager, employees] of Object.entries(managerGroups)) {
                console.log(`\n\nManager: ${manager}`);
                const headers = ['ID', 'Name', 'Title', 'Salary', 'Department'];
                console.log(table([headers, ...employees as [EmployeeHierarchy][]]));
            }
            console.log('\n\n');

        } catch (err) {
            console.error('Error getting employees', err);
            throw err;
        }
    }

    // Method to view employees by department
    async viewEmployeesByDept(): Promise<void> {
        try {
            // Query to get all employees and their details
            const { rows } = await pool.query(`
                SELECT
                e.id AS employee_id,
                CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
                r.title,
                TO_CHAR(r.salary, 'L999G999G999D99') AS salary,
                d.name AS department,
                CONCAT(m.first_name, ' ', m.last_name) AS manager_name
                FROM employee e
                LEFT JOIN employee m ON e.manager_id = m.id
                JOIN role r ON e.role_id = r.id
                JOIN department d ON r.department = d.id
                ORDER BY d.name, e.last_name, e.first_name`);

            // If no employees found, return
            if (rows.length === 0) {
                console.log('No employees found in the database.');
                return;
            }

            // Group employees by department
            const deptGroups = rows.reduce((groups, row) => {
                const department = row.department;
                groups[department] = groups[department] || [];
                groups[department].push([row.employee_id, row.employee_name, row.title, row.salary, row.manager_name]);
                return groups;
            }, {} as Record<string, [EmployeeHierarchy][]>);

            // Display employees grouped by department and display in table format
            for (const [department, employees] of Object.entries(deptGroups)) {
                console.log(`\n\nDepartment: ${department}`);
                const headers = ['ID', 'Name', 'Title', 'Salary', 'Manager'];
                console.log(table([headers, ...employees as [EmployeeHierarchy][]]));
            }
            console.log('\n\n');

        } catch (err) {
            console.error('Error getting employees', err);
            throw err;
        }
    }

    // Method to view all departments
    async viewAllDepts(): Promise<void> {
        try {
            // Query to get all departments and count of employees in each department
            const { rows } = await pool.query(
                `SELECT d.id, d.name AS department,
                COUNT(e.id) AS employee_count
                FROM department d
                LEFT JOIN role r ON d.id = r.department
                LEFT JOIN employee e ON r.id = e.role_id
                GROUP BY d.id
                ORDER BY d.name`);

            // If no departments found, return
            if (rows.length === 0) {
                console.log('No departments found in the database.');
                return;
            }

            // Create table headers and data
            const headers = ['ID', 'Department', 'Employee Count'];
            const data = [headers, ...rows.map(row => [row.id, row.department, row.employee_count])];

            // Display table
            console.log(`\n\nDepartment Summary:`);
            console.log(table(data));
            console.log('\n\n');

        } catch (err) {
            console.error('Error getting departments', err);
            throw err;
        }
    }

    // Method to view all roles
    async viewAllRoles(): Promise<void> {
        try {
            // Query to get all roles and their details
            const { rows } = await pool.query(
                `SELECT r.id, r.title,
                TO_CHAR(r.salary, 'L999G999G999D99') AS salary,
                d.name AS department
                FROM role r
                JOIN department d ON r.department = d.id
                ORDER BY d.name, r.title`);
            
            // If no roles found, return
            if (rows.length === 0) {
                console.log('No roles found in the database.');
                return;
            }

            // Create table headers and data
            const headers = ['ID', 'Title', 'Salary', 'Department'];
            const data = [headers, ...rows.map(row => [row.id, row.title, row.salary, row.department])];

            // Display table
            console.log(`\n\nRole Summary:`);
            console.log(table(data));
            console.log('\n\n');

        } catch (err) {
            console.error('Error getting roles', err);
            throw err;
        }
    }

}

export default ViewSystem;