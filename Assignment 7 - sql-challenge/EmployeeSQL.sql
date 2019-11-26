SELECT *
FROM information_schema.columns;

SET search_path TO 'SQL-HW';

-- Import Data From CSV and check competence 
SELECT * FROM departments;
SELECT * FROM dept_emp;
SELECT * FROM dept_manager;
SELECT * FROM employees;
SELECT * FROM salaries;
SELECT * FROM titles;


-- 1. List the following details of each employee: employee number, last name, first name, gender, and salary.
SELECT e.emp_no, e.last_name, e.first_name, e.gender, s.salary
FROM employees e
INNER JOIN salaries s ON e.emp_no = s.emp_no;

-- 2. List employees who were hired in 1986.
SELECT emp_no, first_name, last_name, hire_date
FROM employees
WHERE hire_date between '1986-01-01' and '1986-12-31';

-- 3. List the manager of each department with the following information: 
-- department number, department name, the manager's employee number, last name, first name, and start and end employment dates.

SELECT d.dept_no, d.dept_name, dm.emp_no, e.first_name, e.last_name, dm.from_date, dm.to_date
FROM departments d, dept_manager dm, employees e
WHERE d.dept_no = dm.dept_no AND dm.emp_no = e.emp_no;

-- 4. List the department of each employee with the following information: 
-- employee number, last name, first name, and department name.

SELECT e.emp_no, e.first_name, e.last_name, d.dept_name
FROM departments d, dept_emp de, employees e
WHERE d.dept_no = de.dept_no AND de.emp_no = e.emp_no;

-- 5. List all employees whose first name is "Hercules" and last names begin with "B."

SELECT e.first_name, e.last_name
FROM employees e
WHERE e.first_name = 'Hercules' AND SUBSTRING(e.last_name,1,1) = 'B';

-- 6. List all employees in the Sales department, 
-- including their employee number, last name, first name, and department name.

SELECT e.emp_no, e.first_name, e.last_name, d.dept_name
FROM departments d, dept_emp de, employees e
WHERE d.dept_no = de.dept_no AND de.emp_no = e.emp_no AND d.dept_name = 'Sales';

-- 7. List all employees in the Sales and Development departments, including their employee number, last name, first name, and department name.

SELECT e.emp_no, e.first_name, e.last_name, d.dept_name
FROM departments d, dept_emp de, employees e
WHERE d.dept_no = de.dept_no AND de.emp_no = e.emp_no 
AND d.dept_name = ANY (
	SELECT d.dept_name FROM departments WHERE d.dept_name = 'Sales' OR d.dept_name = 'Development'
);

-- 8. In descending order, list the frequency count of employee last names, i.e., how many employees share each last name.
SELECT e.last_name, count(*)
FROM employees e
GROUP BY e.last_name
ORDER BY e.count DESC;



