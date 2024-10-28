//Task1 - Find the total no of employees in each department

const { MongoClient } = require('mongodb');

//mongodb url
const uri = "mongodb+srv://user:Abhishek@cluster9.ggkmy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster9"; // Replace with your actual connection string
const client = new MongoClient(uri);

//exception handling using try catch
async function run() {
    try {
 
        //database connection 
        await client.connect();

        // Access the database and collection
        const database = client.db('companyDB');
        const employees = database.collection('employees');

        //we are grouping the ids of each employee in the department to find 
        //the total nod of employees in the department
        const result = await employees.aggregate([
            {
                $group: {
                    _id: "$department",
                    totalEmployees: { $sum: 1 }
                }
            }
        ]).toArray(); //converting the result in array

        console.log("Total Employees by Department:", result);

    } catch (error) {
        console.error(error);
    }
}

run().catch(console.error);
