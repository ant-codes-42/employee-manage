-- Update employee department for an existing employee
UPDATE employee
SET role_id = (
    SELECT id FROM role
    WHERE title = 'new_role_title' AND department = (
        SELECT id FROM department WHERE name = 'new_department_name'
    )
)
WHERE id = employee_id;