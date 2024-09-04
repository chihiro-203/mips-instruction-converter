require("dotenv").config();

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { registerBin, checkRegister, toBin, sepOffset } = require("./utilities");
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
const explainJSON = JSON.parse(
  fs.readFileSync("./resources/Explain.json", "utf-8")
);

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
  let explain = [];
  let result = "";

  if (mnemonic) {
    let format = mnemonic.format;
    definition = `
      <div style="text-align: left; margin-bottom: 0.5rem; font-size: 1vw;">
        <strong>${mnemonic.name} (${mnemonic.opcode})</strong> is a ${format}-type instruction: 
        ${mnemonic.action}
      </div>`;

    let f = "R";  // R format

    if (format === "R" || format === "NULL") {

      // break and syscall case
      if (mnemonic.mnemonic === "break" || mnemonic.mnemonic === "syscall") {
        f = "special" ;   // Special with code
      }

      // Kind: Arithmetic (R)
      // rd, rs, rt - R type
      // add, addu, and, nor, or, slt, sltu, sub, subu, xor
      else if (mnemonic.kind == "arithmetic" && mipsArray.length == 4) {}

      // Kind: Shifter (R)
      else if (mnemonic.kind == "shifter" && mipsArray.length == 4) {

        // rd, rt, sa - R type
        // sll, sra, srl - not used rs
        if (mnemonic.shamt == "sa") {}

        // rd, rt, rs - R type
        // sllv, srav, srlv
        else {}
      }

      // Kind: Multiply & Divide (R)
      else if (mnemonic.kind == "muldiv") {

        if (mipsArray.length == 2) {

          // rs - R type
          // mthi, mtlo - not used rt, rd, shamt
          if (mnemonic.rd == "00000") {}

          // rd - R type
          // mfhi, mflo - not used rs, rt, shamt
          else if (mnemonic.rd != "00000") {}
        }

        // rs, rt - R type
        // div, divu, mult, multu - not used rd, shamt
        else if (keywordArray.length == 3) {}
      }

      // Kind: Branch (R)
      else if (mnemonic.kind == "branch") {}
    }
    
    else if (format === "I") {

      // rt, rs, imm - I type
      // addi, addiu, andi, ori, slti, sltiu, xori
      if (mnemonic.kind == "arithmetic" && mipsArray.length == 4) {}

      else if (mnemonic.kind == "branch" && mipsArray.length >= 3) {        

        // rs, rt, offset - I type
        // beq, bne - not used rd
        if (mnemonic.rt == "rt") {}

        // rs, offset - I type
        // bgez, bgezal, bgtz, blez, bltz, bltzal - not used rd, shamt, funct
        else {}
      }

      else if (mnemonic.kind == "memory" && mipsArray.length == 3) {

        // rt,imm - I type
        // lui - not used rs, shamt, funct
        if (mnemonic.rd == "imm") {}

        // rt, offset(rs) - I type
        // lb, lbu, lh, lhu, lw, sb, sh, sw - not used shamt, funct
        else if (keywordArray[2].match(/^(\d+)\((\$\w+)\)$/)) {}
      }
    }
    
    else if (format === "J") {}
    
    explain = explainJSON.results.find((result) => result.format === f);
  }

  res.json({ definition, explain, result });
});

const port = process.env.PORT || 8000;

app.listen(port);
console.log(`Running on http://localhost:${port}`);

module.exports = app;
