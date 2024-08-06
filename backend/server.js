require("dotenv").config();

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { registerBin } = require("./utilities");
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

  let result = "";

  if (mnemonic) {

    // R-format
    if (mnemonic.format == "R") {
      //Shifter
      if (mnemonic.kind == "shifter") {
        //check if shamt is necessary or not
        //Normal Shift
        if (mnemonic.shamt == "sa") {
          console.log(mnemonic.shamt);
          let swap = keywordArray[1];
          keywordArray[1] = keywordArray[2];
          keywordArray[2] = swap;
          result += mnemonic.rs;
          // result += mnemonic.rs;
          // let sa = mips.splice(3, 1)[0];
          // result = findRegister(mips, result);
          // result += String(toBinary(Number(sa))).padStart(5, "0");
          // binary +=
          //   eachRegister(mips[1]) +
          //   eachRegister(mips[2]) +
          //   String(toBinary(Number(sa))).padStart(5, "0");
          // mips.push(sa);
        }

        //Shift Variable
        else if (mnemonic.shamt != "sa") {
          // let swap = mips[1];
          // mips[1] = mips[3];
          // mips[3] = swap;
          // result = findRegister(mips, result);
          // if (result != "No data") {
          //   result += mnemonic.shamt;
          //   binary +=
          //     eachRegister(mips[1]) +
          //     eachRegister(mips[2]) +
          //     eachRegister(mips[3]) +
          //     mnemonic.shamt;
          // }
        }
      }

      //Arithmetic Logic Unit
      else if (mnemonic.kind == "arithmetic") {
        // let swap = mips[1];
        // mips[1] = mips[2];
        // mips[2] = mips[3];
        // mips[3] = swap;
        // result = findRegister(mips, result);
        // result += mnemonic.shamt;
        // binary +=
        //   eachRegister(mips[1]) +
        //   eachRegister(mips[2]) +
        //   eachRegister(mips[3]) +
        //   mnemonic.shamt;
      }

      //Multiply
      else if (mnemonic.kind == "multiply") {
        // if (mnemonic.rd == null) {
        //   result +=
        //     mnemonic.rs + mnemonic.rt + eachRegister(mips[1]) + mnemonic.shamt;
        //   binary +=
        //     mnemonic.rs + mnemonic.rt + eachRegister(mips[1]) + mnemonic.shamt;
        // } else if (mnemonic.rt == null) {
        //   result +=
        //     eachRegister(mips[1]) +
        //     eachRegister(mips[2]) +
        //     mnemonic.rd +
        //     mnemonic.shamt;
        //   binary +=
        //     eachRegister(mips[1]) +
        //     eachRegister(mips[2]) +
        //     mnemonic.rd +
        //     mnemonic.shamt;
        // } else {
        //   result +=
        //     eachRegister(mips[1]) + mnemonic.rt + mnemonic.rd + mnemonic.shamt;
        // }
      }
      //Break, jalr, jr
    }

    // I-format
    else if (mnemonic.format == "I") {}
    else if (mnemonic.format == "J") {}
  }

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
