require("dotenv").config();

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { registerBin, toBin, sepOffset, checkValue, convertValue } = require("./utilities");
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
  const mArr = mips.split(/\s+/);
  console.log("MIPS Array:", mArr);

  let name = mArr[0];
  var mnemonic = opcodes.find(function (item) {
    return item.mnemonic.includes(name.toLowerCase());
  });

  let definition;
  let explain = [];
  let instruction;

  if (mnemonic) {
    console.log(mnemonic.format);
    let format = mnemonic.format;
    definition = `
      <div style="text-align: left; margin-bottom: 0.5rem; font-size: 1vw;">
        <strong>${mnemonic.name} (${mnemonic.opcode})</strong> is a ${format}-type instruction: 
        ${mnemonic.action}
      </div>`;

    let f = "R";  // R format
    let op, rs, rt, imm, shamt, funct;

    if (format === "R" || format === "NULL" && mArr.length === 1) {
      // let op, rs, rt, rd, shamt, funct;
      let code = "XXXXXXXXXXXXXXXXXXXX";

      // break and syscall case
      if (mnemonic.mnemonic === "break" || mnemonic.mnemonic === "syscall") {
        f = "special" ;   // Special with code
        [op, funct] = convertValue(mnemonic, ["op", "funct"]);
        instruction = op + " " + code + " " + funct;
      }
      
      else {
        // Kind: Arithmetic (R)
        // rd, rs, rt - R type
        // add, addu, and, nor, or, slt, sltu, sub, subu, xor
        if (mnemonic.kind == "arithmetic" && mArr.length == 4) {
          [rd, rs, rt] = checkValue(registers, mArr);
          [op, shamt, funct] = convertValue(mnemonic, ["op", "shamt", "funct"]);
        }

        // Kind: Shifter (R)
        else if (mnemonic.kind == "shifter" && mArr.length == 4) {

          // rd, rt, sa - R type
          // sll, sra, srl - not used rs
          if (mnemonic.shamt == "sa") {
            [rd, rt, shamt] = checkValue(registers, mArr);
            [op, rs, funct] = convertValue(mnemonic, ["op", "rs", "funct"]);
          }

          // rd, rt, rs - R type
          // sllv, srav, srlv - not used shamt
          else {
            [rd, rt, rs] = checkValue(registers, mArr);
            [op, shamt, funct] = convertValue(mnemonic, ["op", "shamt", "funct"]);
          }
        }

        // Kind: Multiply & Divide (R)
        else if (mnemonic.kind == "muldiv") {

          if (mArr.length == 2) {
            // rs - R type
            // mthi, mtlo - not used rt, rd, shamt
            if (mnemonic.rd == "not used") {              
              [rs] = checkValue(registers, mArr);
              [op, rt, rd, shamt, funct] = convertValue(mnemonic, ["op", "rt", "rd", "shamt", "funct"]);
            }

            // rd - R type
            // mfhi, mflo - not used rs, rt, shamt
            else if (mnemonic.rd != "00000") { 
              [rd] = checkValue(registers, mArr);
              [op, rs, rt, shamt, funct] = convertValue(mnemonic, ["op", "rs", "rt", "shamt", "funct"]);
            }
          }

          // rs, rt - R type
          // div, divu, mult, multu - not used rd, shamt
          else if (mArr.length == 3) {             
            [rs, rt] = checkValue(registers, mArr);
            [op, rd, shamt, funct] = convertValue(mnemonic, ["op", "rd", "shamt", "funct"]);
          }
          // rt, rd
          // mfco, mtco - not used shamt, funct, and rs is fixed
          else if (mnemonic.mnemonic === "mfc0" || mnemonic.mnemonic === "mtc0") {
            [rt, rd] = checkValue(registers, mArr);
            [op, rs, shamt, funct] = convertValue(mnemonic, ["op", "rs", "shamt", "funct"])
          }
    
          // Kind: Branch (R)
          // rs - R type
          // jalr - not used rt, shamt
          else if (mnemonic.mnemonic === "jalr") {
            // no rd
            // set rd to $ra
            if (mArr[2] === undefined || mArr[2] === null) {
              mArr.push("$ra");
              [rs, rd] = checkValue(registers, mArr);
            }
            // rd
            else {
              [rd, rs] = checkValue(registers, mArr);
            }
            [op, rt, shamt, funct] = convertValue(mnemonic, ["op", "rt", "shamt", "funct"]);
          }
          // rs - R type
          // jr - not used rt rd, shamt
          else if (mnemonic.mnemonic === "jr") {        
            [rs] = checkValue(registers, mArr);
            [op, rt, rd, shamt, funct] = convertValue(mnemonic, ["op", "rt", "rd", "shamt", "funct"]);
          }
        }
        instruction = op + " " + rs + " " + rt + " " + rd + " " + shamt + " " + funct;
      }    
    
    }
    
    else if (format === "I") {
      f = "I";

      [op] = convertValue(mnemonic, ["op"]);
      instruction = op;

      if (mArr.length == 4 || mArr[2].match(/^(\d+)\((\$\w+)\)$/)) {
        
        // rt, rs, imm - I type
        // addi, addiu, andi, ori, slti, sltiu, xori
        if (mnemonic.kind == "arithmetic") {
          [rt, rs] = checkValue(registers, mArr); 
        } 

        // rs, rt, offset - I type
        // beq, bne
        else if (mnemonic.kind == "branch") {
          [rs, rt] = checkValue(registers, mArr);
        }

        // rt, offset(rs) - I type
        // lb, lbu, lh, lhu, lw, sb, sh, sw
        else if (mnemonic.kind == "memory") {
          [ imm, rs ] = sepOffset(mArr[2]);
          console.log(imm + " " + rs);
          mArr.splice(2, 1);
          mArr.push(rs, imm);
          [rt, rs] = checkValue(registers, mArr);
        }
      }
      
      else if (mArr.length == 3) {
  
        // rs, offset - I type
        // bgez, bgezal, bgtz, blez, bltz, bltzal
        if (mnemonic.kind == "branch") {
          [rs] = checkValue(registers, mArr);
          [rt] = convertValue(mnemonic, ["rt"]);
        }
  
        // rt, imm - I type
        // lui
        else if (mnemonic.mnemonic === "lui") {
          [rt] = checkValue(registers, mArr);
          [rs] = convertValue(mnemonic, ["rs"]);
        }
      }
  
      imm = toBin(mArr[3], 16, mnemonic);
      instruction += " " + rs + " " + rt + " " + imm;
    } 
    
    else if (format === "J") {}
    
    explain = explainJSON.results.find((result) => result.format === f);

    if (imm.includes("The operand is out of range.")) {
      instruction = imm;
    }
  }

  res.json({ definition, explain, instruction });
});

const port = process.env.PORT || 8000;

app.listen(port);
console.log(`Running on http://localhost:${port}`);

module.exports = app;
