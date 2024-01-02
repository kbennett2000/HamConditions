// Import the required libraries
const axios = require("axios"); // Library for making HTTP requests
const cheerio = require("cheerio"); // Library for parsing HTML
const mysql = require("mysql2/promise"); // MySQL library for asynchronous operations

// Function to fetch the web page and extract relevant data
async function getWebPage() {
  try {
    // Make a GET request to the web page
    const response = await axios.get("https://solar.w5mmw.net/");

    // Load the HTML content into Cheerio
    const $ = cheerio.load(response.data);

    // Initialize band conditions
    const bandConditions = {
      "80m-40m Day": "",
      "80m-40m Night": "",
      "30m-20m Day": "",
      "30m-20m Night": "",
      "17m-15m Day": "",
      "17m-15m Night": "",
      "12m-10m Day": "",
      "12m-10m Night": "",
    };

    // Initialize attribute conditions
    const attributeConditions = {
      "Sunspot Number": "",
      "Solar Flux": "",
      "Geomagnetic Storm": "",
      "Solar Wind": "",
      "Noise Floor": "",
    };

    // Select and retrieve items in the bandstable table where startFrequency is not ''
    $("table#bandstable tr").each((index, element) => {
      const columns = $(element).find("td");
      const startFrequency = $(columns[1]).text().trim();
      const bandLabel = $(columns[0]).text().trim();
      const dayConditions = $(columns[1]).text().trim();
      const nightConditions = $(columns[2]).text().trim();

      if (startFrequency !== "") {
        // Store the condition for the corresponding band
        bandConditions[bandLabel + " Day"] = dayConditions;
        bandConditions[bandLabel + " Night"] = nightConditions;
      }
    });

    // Select and retrieve items in the cond_row and cond_value classes from the primaryconds div
    const conditions = [];
    $("div#primaryconds .cond_row").each((index, element) => {
      const conditionRow = $(element);
      const conditionValue = conditionRow.find(".cond_value").text().trim();
      const conditionRowText = conditionRow
        .clone()
        .children(".cond_value")
        .remove()
        .end()
        .text()
        .trim();

      if (conditionValue !== "") {
        const condition = {
          ConditionRow: conditionRowText,
          ConditionValue: conditionValue,
        };
        conditions.push(condition);
      }
    });

    // Select and retrieve items in the cond_row and cond_value classes from the primaryconds div
    $("div#primaryconds .cond_row").each((index, element) => {
      const conditionRow = $(element);
      const conditionValue = conditionRow.find(".cond_value").text().trim();
      const conditionRowText = conditionRow
        .clone()
        .children(".cond_value")
        .remove()
        .end()
        .text()
        .trim();

      // Check if the attribute exists in attributeConditions
      if (attributeConditions.hasOwnProperty(conditionRowText)) {
        // Store the condition value for the corresponding attribute
        attributeConditions[conditionRowText] = conditionValue;
      }
    });

    // Return the filtered band conditions and general conditions
    return { bandConditions, attributeConditions };
  } catch (error) {
    // Log and throw an error if there is an issue fetching the web page
    console.error("Error fetching web page:", error.message);
    throw error;
  }
}

// Function to write the extracted data to the MySQL database
async function writeToDatabase(result) {
  try {
    // Create a MySQL connection
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password1",
      database: "HamConditionsDB",
    });

    // Get today's date and time
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 19).replace("T", " ");

    // Insert data into the ConditionReports table
    const [rows, fields] = await connection.execute(
      `
      INSERT INTO ConditionReports (date_time, 80m_40m_Day, 80m_40m_Night, 30m_20m_Day, 30m_20m_Night, 17m_15m_Day, 17m_15m_Night, 12m_10m_Day, 12m_10m_Night, sunspot_number, solar_flux, geomagnetic_storm, solar_wind, noise_floor)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        formattedDate,
        result.bandConditions["80m-40m Day"],
        result.bandConditions["80m-40m Night"],
        result.bandConditions["30m-20m Day"],
        result.bandConditions["30m-20m Night"],
        result.bandConditions["17m-15m Day"],
        result.bandConditions["17m-15m Night"],
        result.bandConditions["12m-10m Day"],
        result.bandConditions["12m-10m Night"],
        result.attributeConditions["Sunspot Number"],
        result.attributeConditions["Solar Flux"],
        result.attributeConditions["Geomagnetic Storm"],
        result.attributeConditions["Solar Wind"],
        result.attributeConditions["Noise Floor"],
      ]
    );

    console.log("Data successfully written to the database.");

    // Close the MySQL connection
    await connection.end();
  } catch (error) {
    // Log and throw an error if there is an issue writing to the database
    console.error("Error writing to the database:", error.message);
    throw error;
  }
}

// Main function to execute the web scraping and database writing logic
async function main() {
  try {
    // Execute the web scraping function to get the data
    const result = await getWebPage();
    // Write the extracted data to the MySQL database
    await writeToDatabase(result);
  } catch (error) {
    // Log and throw an error if there is an issue in the main logic
    console.error("Main error:", error.message);
  }
}

// Call the main function to start the program
main();
