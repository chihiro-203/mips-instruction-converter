require("dotenv").config();

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const {
  registerBin,
  checkRegister,  
  toBin,
  sepOffset,
} = require("./utilities");
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
const explainJSON = JSON.parse(fs.readFileSync("./resources/Explain.json", "utf-8"));

app.get("/", async (req, res) => {
  res.json({ data: "hello" });
});

// API to search data by mips keyword
app.get("/search-mips", async (req, res) => {
  // Retrieve and decode the keyword
  const mips = req.query.mips;
  console.log(mips);

  // Split the keyword into an array based on spaces
  const mipsArray = mips.split(/\s+/);
  console.log("MIPS Array:", mipsArray);

  let name = mipsArray[0];
  var mnemonic = opcodes.find(function (item) {
    return item.mnemonic.includes(name.toLowerCase());
  });

  let definition;
  let explain;
  let result = "";
  
  if (mnemonic) {
    let format = mnemonic.format;
    definition = `
      <div style="text-align: left; margin-bottom: 0.5rem; font-size: 1vw;">
        <strong>${mnemonic.name} (${mnemonic.opcode})</strong> is a ${format}-type instruction: 
        ${mnemonic.action}
      </div>`;
    explain = explainJSON.results.find(result => result.format === format);
  }

  res.json({ definition, explain, result });
});

const port = process.env.PORT || 8000;

app.listen(port);
console.log(`Running on http://localhost:${port}`);

module.exports = app;
