-- Update employee department for an existing employee
UPDATE employee
SET role_id = (
    SELECT id FROM role
    WHERE title = 'new_role_title' AND department = (
        SELECT id FROM department WHERE name = 'new_department_name'
    )
)
WHERE id = employee_id;

-- Select department based on employee id
SELECT department.name
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department = department.id
WHERE employee.id = $1;

-- Update the role for an employee based on employee id
UPDATE employee
SET role_id = (
    SELECT id FROM role
    WHERE title = 'new_role_title' AND department = (
        SELECT id FROM department WHERE name = 'new_department_name'
    )
)
WHERE id = employee_id;

UPDATE role
SET title = $1, salary = $2, department = $3
WHERE role.id = 

-- Insert a new department
INSERT INTO department (name)
WHERE department.name = $1;

-- Insert a new role
INSERT INTO role (title, salary, department)
WHERE role.title = $1 AND role.salary = $2 AND role.department = $3;

-- SELECT EMPLOYEE LIST
SELECT id, CONCAT(first_name, ' ', last_name) AS name 
FROM employee
ORDER BY last_name, first_name

-- SELECT ROLE LIST (DEPARTMENT NAME INCLUDED)
SELECT r.id, r.title, r.salary, d.name AS department
FROM role r
INNER JOIN department d ON r.department = d.id
ORDER BY d.name, r.title