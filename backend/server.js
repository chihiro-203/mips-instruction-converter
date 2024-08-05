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
const registers = JSON.parse(
  fs.readFileSync("./resources/Register.json", "utf-8")
);
const opcodes = JSON.parse(fs.readFileSync("./resources/Opcode.json", "utf-8"));

app.get("/", async (req, res) => {
  res.json({ data: "hello" });
});

// API to get data by keyword
app.get("/search-mips", async (req, res) => {
  // Retrieve and decode the keyword
  const mips = req.query.mips;

  console.log(mips);

  // Split the keyword into an array based on spaces
  const mipsArray = mips.split(/\s+/);

  // Log the array to verify
  console.log("Keyword Array:", mipsArray);

  // Perform filtering based on the split array
  const filteredMIPS = registers.filter((item) => {
    return mipsArray.some(
      (word) =>
        item.name1.includes(word.toLowerCase()) ||
        item.name2.includes(word.toLowerCase())
    );
  });

  res.json(filteredMIPS);
});

// API to get data by keyword
app.get("/get-data/:keyword", async (req, res) => {
  const keyword = req.params.keyword.toLowerCase();

  const keywordArray = keyword.split(/\s+/);

  // Log the array to verify
  console.log("Keyword Array:", keywordArray);

  let name = keywordArray[0];
  var mnemonic = opcodes.find(function (item) {
    return item.mnemonic.includes(name.toLowerCase());
  });

  if (mnemonic) {}

  // Perform filtering based on the split array
  const filteredData = registers.filter((item) => {
    return keywordArray.some(
      (word) =>
        item.name1.includes(word.toLowerCase()) ||
        item.name2.includes(word.toLowerCase())
    );
  });

  res.json(filteredData);
});

const port = process.env.PORT || 8000;

app.listen(port);
console.log(`Running on http://localhost:${port}`);

module.exports = app;
