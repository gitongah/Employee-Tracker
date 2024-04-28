INSERT INTO department (name)
VALUES 
        ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Legal');

INSERT INTO role(title, salary, department_id)
VALUES
        ('Sales lead', 30000, 1 ),
        ('Sales Person', 40000, 2 ),
        ('Lead engineer', 50000, 3 ),
        ('Software engineer', 80000, 4 ),
        ('legal team lead', 30000, 3 ),
        ('lawyer', 30000, 2 ),
        ('Account', 30000, 1 ),
        ('Account manager', 50000, 2 );

INSERT INTO employee(first_name, last_name, role_id, manager_id)
	VALUES 
        ('John', 'Doe', 1, NULL),
        ('Mike', 'Chan', 2, 1),
        ('Ashley', 'Rodriguez', 3, NULL),
        ('Kevin', 'Tupik', 4, 3),
        ('Kunal', 'Singh', 5, NULL),
        ('Malia', 'Brown', 6, 5),
        ('Sarah', 'Lourd', 7, NULL),
        ('Tom', 'Allen', 8, 7);

