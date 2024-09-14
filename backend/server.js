require("dotenv").config();

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const {
  toBin,
  sepOffset,
  checkValue,
  convertValue,
  checkUndefined,
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

  let name = mArr[0];
  var mnemonic = opcodes.find(function (item) {
    return item.mnemonic.toLowerCase() === name.toLowerCase();
  });

  let definition;
  let explain = [];
  let instruction;
  let binary, hexadecimal, decimal;

  let table = [];

  if (mnemonic) {
    let format = mnemonic.format;
    definition = `
      <div style="text-align: left; margin-bottom: 0.5rem; font-size: 1vw;">
        <strong>${mnemonic.name} (${mnemonic.opcode})</strong> is a ${format}-type instruction.
      </div>`;

    let f = "R"; // R format
    let op,
      rs,
      rt,
      rd,
      shamt,
      funct,
      imm = "";
    let rs_,
      rt_,
      rd_,
      shamt_,
      imm_ = "";

    [op] = convertValue(mnemonic, ["op"]);
    binary = op;

    table.push(`op,${mnemonic.mnemonic},${op},1`);

    // R and NULL format
    if (format === "R" || format === "NULL") {
      let code = "XXXXXXXXXXXXXXXXXXXX";

      // break and syscall case
      if (["break", "syscall"].includes(mnemonic.mnemonic)) {
        f = "special"; // Special with code
        [funct] = convertValue(mnemonic, ["funct"]);
        binary += code + funct;

        table.push(`code,${code},${code},4`);
        table.push(`funct,${mnemonic.funct},${funct},1`);

        if (mArr[1] !== undefined) {
          binary = "wrong";
        }
      }

      //
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
            shamt = toBin(shamt_, 5, mnemonic, registers);
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
            if (["mthi", "mtlo"].includes(mnemonic.mnemonic)) {
              [rs] = checkValue(registers, mArr);
              [rt, rd, shamt, funct] = convertValue(mnemonic, [
                "rt",
                "rd",
                "shamt",
                "funct",
              ]);
              [, rs_] = mArr;
              [rt_, rd_, shamt_] = [mnemonic.rt, mnemonic.rd, mnemonic.shamt];
            }

            // rd - R type
            // mfhi, mflo - not used rs, rt, shamt
            else if (["mfhi", "mflo"].includes(mnemonic.mnemonic)) {
              [rd] = checkValue(registers, mArr);
              [rs, rt, shamt, funct] = convertValue(mnemonic, [
                "rs",
                "rt",
                "shamt",
                "funct",
              ]);
              [, rd_] = mArr;
              [rs_, rt_, shamt_] = [mnemonic.rs, mnemonic.rt, mnemonic.shamt];
            }
          }

          // rs, rt - R type
          // div, divu, mult, multu - not used rd, shamt
          else if (
            ["div", "divu", "mult", "multu"].includes(mnemonic.mnemonic)
          ) {
            [rs, rt] = checkValue(registers, mArr);
            [rd, shamt, funct] = convertValue(mnemonic, [
              "rd",
              "shamt",
              "funct",
            ]);
            [, rs_, rt_] = mArr;
            [rd_, shamt_] = [mnemonic.rd, mnemonic.shamt];
          }
        }

        // Kind: Branch (R, NULL)
        else if (mnemonic.kind == "branch" && mArr.length <= 3) {
          // rt, rd - NULL type
          // mfc0, mtc0 - not used shamt, funct, and rs is fixed
          if (["mfc0", "mtc0"].includes(mnemonic.mnemonic)) {
            [rt, rd] = checkValue(registers, mArr);
            [rs, shamt, funct] = convertValue(mnemonic, [
              "rs",
              "shamt",
              "funct",
            ]);
            [, rt_, rd_] = mArr;
            [rs_, shamt_] = [mnemonic.rs, mnemonic.shamt];
          }

          // rs - R type
          // jalr - not used rt, shamt
          else if (mnemonic.mnemonic === "jalr" && mArr.length <= 3) {
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
            [rt, shamt, funct] = convertValue(mnemonic, [
              "rt",
              "shamt",
              "funct",
            ]);
            [rt_, shamt_] = [mnemonic.rt, mnemonic.shamt];
          }

          // rs - R type
          // jr - not used rt rd, shamt
          else if (mnemonic.mnemonic === "jr" && mArr.length <= 2) {
            [rs] = checkValue(registers, mArr);
            [rt, rd, shamt, funct] = convertValue(mnemonic, [
              "rt",
              "rd",
              "shamt",
              "funct",
            ]);
            [, rs_] = mArr;
            [rt_, rd_, shamt_] = [mnemonic.rt, mnemonic.rd, mnemonic.shamt];
          }
        }

        binary += rs + rt + rd + shamt + funct;

        table.push(`rs,${rs_},${rs},1`);
        table.push(`rt,${rt_},${rt},1`);
        table.push(`rd,${rd_},${rd},1`);
        table.push(`shamt,${shamt_},${shamt},1`);
        table.push(`funct,${mnemonic.funct},${funct},1`);
        console.log(table);
      }
    }

    // I format
    else if (format === "I") {
      f = "I";

      // len = 4
      if (
        mArr.length == 4 ||
        (mArr.length == 3 &&
          mArr[2].match(/^(0x[0-9A-Fa-f]+|0b[01]+|\d+)\((\$?\w+)\)$/))
      ) {
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
          [imm, rs] = sepOffset(mArr[2]);
          mArr.splice(2, 1);
          mArr.push(rs, imm);
          [rt, rs] = checkValue(registers, mArr);
          [, rt_, rs_, imm_] = mArr;
        }
      }

      // len = 3
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

      imm = toBin(imm_, 16, mnemonic, registers);
      binary += rs + rt + imm;

      table.push(`rs,${rs_},${rs},1`);
      table.push(`rt,${rt_},${rt},1`);
      table.push(`imm/offset,${imm_},${imm},3`);
    }

    // target - J type
    // j, jal
    else if (format === "J") {
      f = "J";
      imm = toBin(mArr[1], 26, mnemonic, registers);
      let [, target_] = mArr;
      binary += imm;
      table.push(`target,${target_},${imm},3`);

      if (mArr[2] !== undefined) {
        binary = "wrong";
      }
    }

    explain = explainJSON.results.find((result) => result.format === f);

    if (imm.includes("The operand is out of range.")) {
      binary = imm;
    } else if (binary.includes("invalid")) {
      binary =
        "Some registers/operand are not valid. Registers/Operand must follow the syntax: " +
        mnemonic.opcode +
        ".";
    } else if (
      binary.includes(undefined) ||
      binary.includes("wrong") ||
      binary.includes(NaN)
    ) {
      binary =
        "Wrong syntax. Correct syntax of " +
        mnemonic.name +
        " must be: " +
        mnemonic.opcode +
        ".";
    }

    if (/^[0-9]+$/.test(binary)) {
      decimal = parseInt(binary, 2);
      hexadecimal = "0x" + decimal.toString(16).toUpperCase();
      binary = "0b" + binary;
    }
    // syscall, break
    else if (/^[0-9X]+$/.test(binary)) {
      let bin = binary.slice(-4);
      decimal = parseInt(bin, 2);
      hexadecimal = "0x" + "0XXXXXX" + decimal.toString(16).toUpperCase();
      console.log(decimal + " " + hexadecimal);
      console.log("ok");
    }

    instruction = {
      mips: mips,
      bin: binary,
      table: table,
      hex: hexadecimal,
      dec: decimal,
      ope: mnemonic.operation,
      action: mnemonic.action,
    };
  } else {
    // List all instructions that start with or contain the entered name
    let suggestions = opcodes.filter(function (item) {
      return (
        item.mnemonic.toLowerCase().startsWith(name.toLowerCase()) ||
        item.mnemonic.toLowerCase().includes(name.toLowerCase())
      );
    });

    definition = "";
    instruction = "";

    if (suggestions.length > 0) {
      definition = "Did you mean one of these mnemonic? ";
      suggestions.forEach(function (suggestion) {
        definition += suggestion.mnemonic + " ";
      });
    } else {
      definition = "No mnemonic found that match or contain: " + name;
    }
  }

  res.json({ definition, explain, instruction });
});

const port = process.env.PORT || 8000;

app.listen(port);
console.log(`Running on http://localhost:${port}`);

module.exports = app;
