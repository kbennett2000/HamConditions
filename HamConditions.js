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

    // Return the filtered bands
    return bands;
  } catch (error) {
    // Log and throw an error if there is an issue fetching the web page
    console.error("Error fetching web page:", error.message);
    throw error;
  }
}

// Call the function and log the result
getWebPage()
  .then((bands) => {
    // Log the filtered bands to the console
    // Parse apart the return array
    for (let i = 0; i < bands.length; i++) {
      console.log(bands[i].Band + " - Day: " + bands[i].Daytime + " - Night: " + bands[i].Nighttime);
    }
  })
  .catch((error) => {
    // Log an error message if there is an issue
    console.error("Error:", error.message);
  });
