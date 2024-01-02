// MySQL Create Database

// Import the MySQL module
var mysql = require('mysql');

// Create a connection object with the database connection details
var con = mysql.createConnection({
  host: "localhost",  // Database host
  user: "root",       // Database user
  password: "password1"  // Database user password
});

// Connect to the MySQL server
con.connect(function(err) {
  if (err) throw err;  // Throw an error if connection fails
  console.log("Connected!");  // Log a success message if connected

  // Execute a query to create a new database named HamConditionsDB
  con.query("CREATE DATABASE HamConditionsDB", function (err, result) {
    if (err) throw err;  // Throw an error if the query fails
    console.log("Database created");  // Log a success message if the database is created
  });
});
