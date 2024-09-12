require("dotenv").config();

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { toBin, sepOffset, checkValue, convertValue } = require("./utilities");
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
    let format = mnemonic.format;
    definition = `
      <div style="text-align: left; margin-bottom: 0.5rem; font-size: 1vw;">
        <strong>${mnemonic.name} (${mnemonic.opcode})</strong> is a ${format}-type instruction: 
        ${mnemonic.action}
      </div>`;

    let convert = [];

    let f = "R";  // R format
    let op, rs, rt, rd, shamt, funct, imm = "";
    let rs_, rt_, rd_, shamt_, imm_ = "";

    [op] = convertValue(mnemonic, ["op"]);
    instruction = op;

    convert.push(`op,${op},${op}`);

    if (format === "R" || format === "NULL" && mArr.length === 1) {
      let code = "XXXXXXXXXXXXXXXXXXXX";

      // break and syscall case
      if (mnemonic.mnemonic === "break" || mnemonic.mnemonic === "syscall") {
        f = "special" ;   // Special with code
        [funct] = convertValue(mnemonic, ["funct"]);
        instruction += " " + code + " " + funct;

        convert.push(`code,${code},${code}`);
        convert.push(`funct,${mnemonic.funct},${funct}`);
        console.log(convert);
      }
      
      else {
        // Kind: Arithmetic (R)
        // rd, rs, rt - R type
        // add, addu, and, nor, or, slt, sltu, sub, subu, xor
        if (mnemonic.kind == "arithmetic" && mArr.length == 4) {
          [rd, rs, rt] = checkValue(registers, mArr);
          [shamt, funct] = convertValue(mnemonic, ["shamt", "funct"]);
          [, rd_, rs_, rt_] = mArr;
          [shamt_] = [mnemonic.shamt];
        }

        // Kind: Shifter (R)
        else if (mnemonic.kind == "shifter" && mArr.length == 4) {

          // rd, rt, sa - R type
          // sll, sra, srl - not used rs
          if (mnemonic.shamt == "sa") {
            [rd, rt] = checkValue(registers, mArr);
            [rs, funct] = convertValue(mnemonic, ["rs", "funct"]);
            [, rd_, rt_, shamt_] = mArr;
            [rs_] = [mnemonic.rs];
            shamt = toBin(shamt_, 5);
          }

          // rd, rt, rs - R type
          // sllv, srav, srlv - not used shamt
          else {
            [rd, rt, rs] = checkValue(registers, mArr);
            [shamt, funct] = convertValue(mnemonic, ["shamt", "funct"]);
            [, rd_, rs_, rt_] = mArr;
            [shamt_] = [mnemonic.shamt];
          }
        }

        // Kind: Multiply & Divide (R)
        else if (mnemonic.kind == "muldiv") {

          if (mArr.length == 2) {
            // rs - R type
            // mthi, mtlo - not used rt, rd, shamt
            if (mnemonic.rd == "not used") {              
              [rs] = checkValue(registers, mArr);
              [rt, rd, shamt, funct] = convertValue(mnemonic, ["rt", "rd", "shamt", "funct"]);
              [, rs_] = mArr;
              [rt_, rd_, shamt_] = [mnemonic.rt, mnemonic.rd, mnemonic.shamt];
            }

            // rd - R type
            // mfhi, mflo - not used rs, rt, shamt
            else if (mnemonic.rd != "00000") { 
              [rd] = checkValue(registers, mArr);
              [rs, rt, shamt, funct] = convertValue(mnemonic, ["rs", "rt", "shamt", "funct"]);
              [, rd_] = mArr;
              [rs_, rt_, shamt_] = [mnemonic.rs, mnemonic.rt, mnemonic.shamt];
            }
          }

          // rs, rt - R type
          // div, divu, mult, multu - not used rd, shamt
          else if (mArr.length == 3 && format != "NULL") {             
            [rs, rt] = checkValue(registers, mArr);
            [rd, shamt, funct] = convertValue(mnemonic, ["rd", "shamt", "funct"]);
            [, rs_, rt_] = mArr;
            [rd_, shamt_] = [mnemonic.rd, mnemonic.shamt];
          }

          // rt, rd - NULL type
          // mfc0, mtc0 - not used shamt, funct, and rs is fixed
          else if (mnemonic.mnemonic === "mfc0" || mnemonic.mnemonic === "mtc0") {
            console.log("Hello");
            [rt, rd] = checkValue(registers, mArr);
            [rs, shamt, funct] = convertValue(mnemonic, ["rs", "shamt", "funct"]);
            [, rt_, rd_] = mArr;
            [rs_, shamt_] = [mnemonic.rs, mnemonic.shamt];
          }
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
            [, rs_, rd_] = mArr;
          }
          // rd
          else {
            [rd, rs] = checkValue(registers, mArr);
            [, rd_, rs_] = mArr;
          }
          [rt, shamt, funct] = convertValue(mnemonic, ["rt", "shamt", "funct"]);
          [rt_, shamt_] = [mnemonic.rt, mnemonic.shamt];
        }
        
        // rs - R type
        // jr - not used rt rd, shamt
        else if (mnemonic.mnemonic === "jr") {        
          [rs] = checkValue(registers, mArr);
          [rt, rd, shamt, funct] = convertValue(mnemonic, ["rt", "rd", "shamt", "funct"]);
          [, rs_] = mArr;
          [rt_, rd_, shamt_] = [mnemonic.rt, mnemonic.rd, mnemonic.shamt];
        }

        instruction += " " + rs + " " + rt + " " + rd + " " + shamt + " " + funct;
  
        convert.push(`rs,${rs_},${rs}`);
        convert.push(`rt,${rt_},${rt}`);
        convert.push(`rd,${rd_},${rd}`);
        convert.push(`shamt,${shamt_},${shamt}`);
        convert.push(`funct,${mnemonic.funct},${funct}`);
        console.log(convert);
      }
      
    }
    
    else if (format === "I") {
      f = "I";

      if (mArr.length == 4 || mArr.length == 3 && mArr[2].match(/^(\d+)\((\$\w+)\)$/)) {
        
        // rt, rs, imm - I type
        // addi, addiu, andi, ori, slti, sltiu, xori
        if (mnemonic.kind == "arithmetic") {
          [rt, rs] = checkValue(registers, mArr); 
          [, rt_, rs_, imm_] = mArr;
        } 

        // rs, rt, offset - I type
        // beq, bne
        else if (mnemonic.kind == "branch") {
          [rs, rt] = checkValue(registers, mArr);
          [, rs_, rt_, imm_] = mArr;
        }

        // rt, offset(rs) - I type
        // lb, lbu, lh, lhu, lw, sb, sh, sw
        else if (mnemonic.kind == "memory") {
          [ imm, rs ] = sepOffset(mArr[2]);
          console.log(imm + " " + rs);
          mArr.splice(2, 1);
          mArr.push(rs, imm);
          [rt, rs] = checkValue(registers, mArr);
          [, rt_, rs_, imm_] = mArr;
        }
      }

      else if (mArr.length == 3) {
  
        // rs, offset - I type
        // bgez, bgezal, bgtz, blez, bltz, bltzal
        if (mnemonic.kind == "branch") {
          [rs] = checkValue(registers, mArr);
          [rt] = convertValue(mnemonic, ["rt"]);
          [, rs_, imm_] = mArr;
          rt_ = mnemonic.rt;
        }
  
        // rt, imm - I type
        // lui
        else if (mnemonic.mnemonic === "lui") {
          [rt] = checkValue(registers, mArr);
          [rs] = convertValue(mnemonic, ["rs"]);
          [, rt_, imm_] = mArr;
          rs_ = mnemonic.rs;
        }
      }
  
      imm = toBin(mArr[3], 16, mnemonic);
      instruction += " " + rs + " " + rt + " " + imm;
  
      convert.push(`rs,${rs_},${rs}`);
      convert.push(`rt,${rt_},${rt}`);
      convert.push(`imm/offset,${imm_},${imm}`);
      console.log(convert);
    } 
    
    // target - J type
    // j, jal
    else if (format === "J") {
      f = "J";
      imm = toBin(mArr[1], 26, mnemonic);
      console.log(imm);
      instruction += " " + imm;
    }
    
    explain = explainJSON.results.find((result) => result.format === f);

    if (imm.includes("The operand is out of range.")) {
      instruction = imm;
    }

    else if (instruction.includes("invalid")) {
      instruction = "Some registers/operand are not valid.";
      console.log("No");
    }
    
    else if (instruction.includes(undefined) || instruction.includes("wrong")) {
      instruction = "Wrong syntax. Correct syntax of " + mnemonic.name + " must be: " + mnemonic.opcode + ".";
    }
  }

  res.json({ definition, explain, instruction });
});

const port = process.env.PORT || 8000;

app.listen(port);
console.log(`Running on http://localhost:${port}`);

module.exports = app;
