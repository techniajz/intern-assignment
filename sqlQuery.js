// For setup database 

// create database companyDB;
// use companyDB;




// For table

// create table employees (
//     name varchar(200),
//     department varchar(200),
//     salary int,
//     joiningDate date,
//     performanceRating int
// );




// For inserting data

// insert into employees (name,department,salary,joiningDate,performanceRating) values ("name","department",00000,"2024-3-7",5);





// For Task 1

// select department,count(department) from employees group by department;




// For Task 2

// select department,avg(salary) from employees group by department;



// For Task 3

// SELECT name, joiningDate FROM employees WHERE joiningDate >= DATE_SUB(NOW(), INTERVAL 6 MONTH);




// For Task 4

// select name,salary from employees order by salary desc limit 3




// For Task 5 

// select performanceRating,avg(salary)  from employees group by performanceRating order by performanceRating desc
