require("dotenv").config();

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(express.json());

// Enable CORS
if (process.env.ENABLE_CORS === "true") {
  app.use(cors({ origin: "*" }));
}

// Load JSON data from resources folder
const register = JSON.parse(
  fs.readFileSync("./resources/Register.json", "utf-8")
);
const opcode = JSON.parse(fs.readFileSync("./resources/Opcode.json", "utf-8"));

app.get("/", async (req, res) => {
  res.json({ data: "hello" });
});

// API to get data by keyword
app.get('/get-data', async (req, res) => {
  // Retrieve and decode the keyword
  const keyword = req.query.keyword;

  console.log(keyword);
  
  // Split the keyword into an array based on spaces
  const keywordArray = keyword.split(/\s+/);

  // Log the array to verify
  console.log('Keyword Array:', keywordArray);

  // Perform filtering based on the split array
  const filteredData = register.filter(item => {
      return keywordArray.some(word =>
          item.name1.toLowerCase().includes(word.toLowerCase()) ||
          item.name2.toLowerCase().includes(word.toLowerCase())
      );
  });

  res.json(filteredData);
});

const port = process.env.PORT || 8000;

app.listen(port);
console.log(`Running on http://localhost:${port}`);

module.exports = app;
