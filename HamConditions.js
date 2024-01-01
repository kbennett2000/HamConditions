// Import the required libraries
const axios = require("axios"); // For making HTTP requests
const cheerio = require("cheerio"); // For parsing HTML

// Function to fetch the web page and extract relevant data
async function getWebPage() {
  try {
    // Make a GET request to the web page
    const response = await axios.get("https://solar.w5mmw.net/");

    // Load the HTML content into Cheerio
    const $ = cheerio.load(response.data);

    // Select and retrieve items in the bandstable table where startFrequency is not ''
    const bands = [];
    $("table#bandstable tr").each((index, element) => {
      // Find all <td> elements within the current table row
      const columns = $(element).find("td");

      // Extract the startFrequency value from the second column
      const startFrequency = $(columns[1]).text().trim();

      // Check if startFrequency is not an empty string
      if (startFrequency !== "") {
        // Create a band object with custom labels
        const band = {
          Band: $(columns[0]).text().trim(),
          Daytime: startFrequency,
          Nighttime: $(columns[2]).text().trim(),
        };
        // Push the band object to the bands array
        bands.push(band);
      }
    });

    // Select and retrieve items in the cond_row and cond_value classes from the primaryconds div
    const conditions = [];
    $("div#primaryconds .cond_row").each((index, element) => {
      // Find the corresponding .cond_value within the current cond_row
      const conditionRow = $(element);
      const conditionValue = conditionRow.find(".cond_value").text().trim();

      // Extract the text content excluding the .cond_value element
      const conditionRowText = conditionRow
        .clone()
        .children(".cond_value")
        .remove()
        .end()
        .text()
        .trim();

      // Check if conditionValue is not an empty string
      if (conditionValue !== "") {
        // Create a condition object with custom labels
        const condition = {
          ConditionRow: conditionRowText, // Use the modified text content without .cond_value
          ConditionValue: conditionValue,
        };
        // Push the condition object to the conditions array
        conditions.push(condition);
      }
    });

    // Return the filtered bands and conditions
    return { bands, conditions };
  } catch (error) {
    // Log and throw an error if there is an issue fetching the web page
    console.error("Error fetching web page:", error.message);
    throw error;
  }
}

// Call the function and log the result
getWebPage()
  .then(({ bands, conditions }) => {
    // Log the filtered bands and conditions to the console
    //console.log("Filtered Bands:", bands);
    // Parse apart the return array
    for (let i = 0; i < bands.length; i++) {
      console.log(
        bands[i].Band +
          " - Day: " +
          bands[i].Daytime +
          " - Night: " +
          bands[i].Nighttime
      );
    }

    console.log("Conditions:", conditions);
  })
  .catch((error) => {
    // Log an error message if there is an issue
    console.error("Error:", error.message);
  });
