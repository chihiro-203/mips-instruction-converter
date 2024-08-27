require("dotenv").config();

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { registerBin, checkType, explanation, toBin, sepOffset } = require("./utilities");
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

  let name = mipsArray[0];
  var mnemonic = opcodes.find(function (item) {
    return item.mnemonic.includes(name.toLowerCase());
  });

  // This is to print the Explanation
  let explain = "";
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

  let result = "hello";

  if (mnemonic) {
    if (mnemonic.kind == "arithmetic") {
      
      if (mnemonic.rd == "imm") { // rt, rs, imm - I type
        let rt = registerBin(keywordArray[1], registers);
        let rs = registerBin(keywordArray[2], registers);
        let imm = toBin(keywordArray[3]).padStart(16, "0");
        result = mnemonic.op + " " + rt + " " + rs + " " + imm;

      } else {  // rd, rs, rt
        let rd = registerBin(keywordArray[1], registers);
        let rs = registerBin(keywordArray[2], registers);
        let rt = registerBin(keywordArray[3], registers);
        result = mnemonic.op + " " + rs + " " + rt + " " + rd +  " " + mnemonic.shamt + " " + mnemonic.funct;
      }

    } else if (mnemonic.kind == "shifter") {  // rd, rt, sa
      if (mnemonic.shamt == "sa") {
        let rs = "00000"; // no source register
        let rd = registerBin(keywordArray[1], registers);
        let rt = registerBin(keywordArray[2], registers);
        let shamt = toBin(keywordArray[3]);  
        result = mnemonic.op + " " + rs + " " + rt + " " + rd +  " " + shamt + " " + mnemonic.funct;
      } else {  // rd, rt, rs
        let rd = registerBin(keywordArray[1], registers);
        let rt = registerBin(keywordArray[2], registers);
        let rs = registerBin(keywordArray[3], registers);
        result = mnemonic.op + " " + rs + " " + rt + " " + rd +  " " + mnemonic.shamt + " " + mnemonic.funct;
      }

    } else if (mnemonic.kind == "muldiv") {
      if (mnemonic.rt == mnemonic.rd && mnemonic.rd == mnemonic.shamt) {  // Move to
        let rs = registerBin(keywordArray[1], registers); // not used rt, rd, shamt
        result = mnemonic.op + " " + rs + " " + mnemonic.rt + " " + mnemonic.rd +  " " + mnemonic.shamt + " " + mnemonic.funct;

      } else if (mnemonic.rd != "00000") {  // Move to
        let rd = registerBin(keywordArray[1], registers); // not used rs, rt, shamt
        result = mnemonic.op + " " + mnemonic.rs + " " + mnemonic.rt + " " + rd +  " " + mnemonic.shamt + " " + mnemonic.funct;

      } else {
        let rs = registerBin(keywordArray[1], registers);
        let rt = registerBin(keywordArray[2], registers); // not used rd, shamt
        result = mnemonic.op + " " + rs + " " + rt + " " + mnemonic.rd +  " " + mnemonic.shamt + " " + mnemonic.funct;
      }
    } else if (mnemonic.kind == "memory") {
      if (mnemonic.rd == "imm") { // for 'lui'
        let rt = registerBin(keywordArray[1], registers);
        let imm =  toBin(keywordArray[2]);
        result = mnemonic.op + " " + mnemonic.rs + " " + rt + " " + imm;
        //
      } else {  // rt, offset(rs)	
        let rt = registerBin(keywordArray[1], registers);
        let {offset, rs} = sepOffset(keywordArray[2]);
        console.log(offset);
        offset = toBin(offset).padStart(16, "0");
        rs = registerBin(rs, registers);
        result = mnemonic.op + " " + rs + " " + rt + " " + offset;
      }
    }
  } else {}

  res.json(result);
});

const port = process.env.PORT || 8000;

app.listen(port);
console.log(`Running on http://localhost:${port}`);

module.exports = app;
