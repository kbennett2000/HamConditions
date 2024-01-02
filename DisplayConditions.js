// Import required packages
const express = require("express"); // Express.js framework for creating web applications
const mysql = require("mysql"); // MySQL package for connecting to MySQL database

// Create an Express application
const app = express();

// MySQL Database Configuration
const db = mysql.createConnection({
  host: "localhost", // MySQL database host
  user: "root", // MySQL database user
  password: "password1", // MySQL database password
  database: "HamConditionsDB", // MySQL database name
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Define an Express route to handle requests to the root URL
app.get("/", (req, res) => {
  const query = "SELECT * FROM ConditionReports"; // SQL query to select all columns from ConditionReports table

  // Fetch data from MySQL using the defined query
  db.query(query, (err, results) => {
    if (err) {
      console.error("MySQL query error:", err);
      res.status(500).send("Internal Server Error"); // Send a 500 Internal Server Error response if there's a MySQL query error
    } else {
      // Render data in a simple HTML table
      const tableRows = results.map((row) => {
        return `<tr>
                  <td>${row.date_time}</td>
                  <td>${row["80m_40m_Day"]}</td>
                  <td>${row["80m_40m_Night"]}</td>
                  <td>${row["30m_20m_Day"]}</td>
                  <td>${row["30m_20m_Night"]}</td>
                  <td>${row["17m_15m_Day"]}</td>
                  <td>${row["17m_15m_Night"]}</td>
                  <td>${row["12m_10m_Day"]}</td>
                  <td>${row["12m_10m_Night"]}</td>
                  <td>${row.sunspot_number}</td>
                  <td>${row.solar_flux}</td>
                  <td>${row.geomagnetic_storm}</td>
                  <td>${row.solar_wind}</td>
                  <td>${row.noise_floor}</td>
                </tr>`;
      });

      // Create an HTML string with a table containing the fetched data
      const html = `
        <html>
          <head>
            <title>Ham Conditions Data</title>
          </head>
          <body>
            <h1>Ham Conditions Data</h1>
            <table border="1">
              <tr>
                <th>Date Time</th>
                <th>80m - 40m Day</th>
                <th>80m - 40m Night</th>
                <th>30m - 20m Day</th>
                <th>30m - 20m Night</th>
                <th>17m - 15m Day</th>
                <th>17m - 15m Night</th>
                <th>12m - 10m Day</th>
                <th>12m - 10m Night</th>
                <th>Sunspot Number</th>
                <th>Solar Flux</th>
                <th>Geomagnetic Storm</th>
                <th>Solar Wind</th>
                <th>Noise Floor</th>
              </tr>
              ${tableRows.join("")}
            </table>
          </body>
        </html>
      `;

      // Send the HTML response to the client
      res.send(html);
    }
  });
});

// Start the Express server and listen on a specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
