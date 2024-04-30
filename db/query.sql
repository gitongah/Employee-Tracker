    SELECT role.id, role.title, role.salary 
    FROM role
    INNER JOIN department ON role.department_id = department.id;