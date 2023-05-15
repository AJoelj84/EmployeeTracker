INSERT INTO department(dept_name)
VALUES ("Management"),
       ("Tech Support"),
       ("Transportation"),
       ("Customer Service"),
       ("People Services");


INSERT INTO role(role_title, salary, dept_id)
VALUES ("General Manager", 80000, 1),
       ("Customer Service Specialist", 60000, 2),
       ("Transportation Dept", 55000, 4),
       ("Tech Support", 70000, 3),
       ("People Services Specialist", 70000, 5);
       

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("William", "Johnson", 1, 2),
       ("John", "Jameson", 2, 4),
       ("Jim", "Jacobs", 3, 1),
       ("Holly", "Fisher", 4, 5),
       ("George", "Novack", 5, 3); 

ALTER TABLE employee
ADD CONSTRAINT manager_id
FOREIGN KEY (manager_id)
REFERENCES employee(employee_id)
ON DELETE SET NULL;