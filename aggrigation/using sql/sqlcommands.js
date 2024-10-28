
//task 1 
SELECT department,count(department) from employees group by department;



//task 2
SELECT department,avg(salary) from employees group by department;


//task 3
//SELECT * FROM employees WHERE TIMESTAMPDIFF(MONTH, joiningDate, now()) <= 6 ;


//task 4
SELECT * from employees order by salary desc limit 3;


//task 5
SELECT	performanceRating  ,avg(salary) from employees group by performanceRating order by Rating ;