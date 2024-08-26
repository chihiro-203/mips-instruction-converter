require("dotenv").config();

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { registerBin, checkType, explanation } = require("./utilities");
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

  // This is to print the Explanation
  let explain = "";

  let name = mipsArray[0];
  var mnemonic = opcodes.find(function (item) {
    return item.mnemonic.includes(name.toLowerCase());
  });

  if (mnemonic) {
    explain = explanation(mnemonic);
  }

  res.json(explain);
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

  let result = "";

  if (mnemonic) {
    if (mnemonic.kind == "arithmetic") {
      if (mnemonic.rd == "imm") { // rt, rs, imm - I type
        let rt = keywordArray[1], rs = keywordArray[2];
        let imm = toBin(keywordArray[3]).padStart(16, "0");
      } else {  // rd, rs, rt
        let rd = keywordArray[1], rs = keywordArray[2], rt = keywordArray[3];
      }

    } else if (mnemonic.kind == "shifter") {  // rd, rt, sa
      if (mnemonic.shamt == "sa") {
        let rs = "00000", rd = keywordArray[1], rt = keywordArray[2];
        let shamt = toBin(sa);  // create one
      } else {  // rd, rt, rs
        let rd = keywordArray[1], rt = keywordArray[2], rs = keywordArray[3];
      }

    } else if (mnemonic.kind == "muldiv") {
      if (mnemonic.rt == mnemonic.rd && mnemonic.rd == mnemonic.shamt) {  // Move to
        let rs = keywordArray[1];
      } else if (mnemonic.rd != "00000") {  // Move to
        let rd = keywordArray[1];
      } else {
        let rs = keywordArray[1], rt = keywordArray[2];
      }
    } else if (mnemonic.kind == "memory") {
      if (mnemonic.rd == "imm") {
        //
      } else {  // rt, offset(rs)	
        let rt = keywordArray[1], offset = keywordArray[2], rs = keywordArray[3];
      }
    }
  } else {}

  // Perform filtering based on the split array
  // const filteredData = registers.filter(() => {
  //   return keywordArray.some(
  //     (word) => findRegister(word, registers)
  //   );
  // });

  res.json(mnemonic);
});

const port = process.env.PORT || 8000;

app.listen(port);
console.log(`Running on http://localhost:${port}`);

module.exports = app;
