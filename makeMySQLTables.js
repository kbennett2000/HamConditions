// MySQL Create Table
var mysql = require("mysql");

// Establish a connection to the MySQL database
var con = mysql.createConnection({
  host: "localhost",        // Replace with the MySQL server host
  user: "root",             // Replace with the MySQL user
  password: "password1",    // Replace with the MySQL password
  database: "HamConditionsDB",  // Replace with the desired database name
});

// Connect to the MySQL database
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  // Define the SQL query to create a table named ConditionReports
  var sql =
    "CREATE TABLE ConditionReports (date_time VARCHAR(1024), 80m_40m_Day VARCHAR(255),80m_40m_Night VARCHAR(255), 30m_20m_Day VARCHAR(255), 30m_20m_Night VARCHAR(255), 17m_15m_Day VARCHAR(255), 17m_15m_Night VARCHAR(255), 12m_10m_Day VARCHAR(255), 12m_10m_Night VARCHAR(255), sunspot_number VARCHAR(255), solar_flux VARCHAR(255), geomagnetic_storm VARCHAR(255), solar_wind VARCHAR(255), noise_floor VARCHAR(255))";

  // Execute the SQL query to create the table
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});
