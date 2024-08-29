require("dotenv").config();

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const {
  registerBin,
  checkType,
  explanation,
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

  let notUsed = "00000";

  if (mnemonic) {
    // Kind: Arithmetic (I, R)
    if (mnemonic.kind == "arithmetic") {
      // rt, rs, imm - I type
      // addi, addiu, andi, ori, slti, sltiu, xori - not used shamt, funct
      if (mnemonic.rd == "imm") {
        let rt = registerBin(keywordArray[1], registers);
        let rs = registerBin(keywordArray[2], registers);
        let imm = toBin(keywordArray[3], 16);
        result = mnemonic.op + " " + rt + " " + rs + " " + imm;
      }

      // rd, rs, rt - R type
      // add, addu, and, nor, or, slt, sltu, sub, subu, xor
      else {
        let rd = registerBin(keywordArray[1], registers);
        let rs = registerBin(keywordArray[2], registers);
        let rt = registerBin(keywordArray[3], registers);
        result =
          mnemonic.op +
          " " +
          rs +
          " " +
          rt +
          " " +
          rd +
          " " +
          mnemonic.shamt +
          " " +
          mnemonic.funct;
      }
    }

    // Kind: Shifter (R)
    else if (mnemonic.kind == "shifter") {
      // rd, rt, sa - R type
      // sll, sra, srl - not used rs
      if (mnemonic.shamt == "sa") {
        // no source register
        let rd = registerBin(keywordArray[1], registers);
        let rt = registerBin(keywordArray[2], registers);
        let shamt = toBin(keywordArray[3], 5);
        result =
          mnemonic.op +
          " " +
          mnemonic.rs +
          " " +
          rt +
          " " +
          rd +
          " " +
          shamt +
          " " +
          mnemonic.funct;
      }

      // rd, rt, rs - R type
      // sllv, srav, srlv
      else {
        let rd = registerBin(keywordArray[1], registers);
        let rt = registerBin(keywordArray[2], registers);
        let rs = registerBin(keywordArray[3], registers);
        result =
          mnemonic.op +
          " " +
          rs +
          " " +
          rt +
          " " +
          rd +
          " " +
          mnemonic.shamt +
          " " +
          mnemonic.funct;
      }
    }

    // Kind: Multiply & Divide (R)
    else if (mnemonic.kind == "muldiv") {
      // rs - R type
      // mthi, mtlo - not used rt, rd, shamt
      if (mnemonic.rt == mnemonic.rd && mnemonic.rd == mnemonic.shamt) {
        let rs = registerBin(keywordArray[1], registers);
        result =
          mnemonic.op +
          " " +
          rs +
          " " +
          mnemonic.rt +
          " " +
          mnemonic.rd +
          " " +
          mnemonic.shamt +
          " " +
          mnemonic.funct;
      }

      // rd - R type
      // mfhi, mflo - not used rs, rt, shamt
      else if (mnemonic.rd != "00000") {
        let rd = registerBin(keywordArray[1], registers);
        result =
          mnemonic.op +
          " " +
          mnemonic.rs +
          " " +
          mnemonic.rt +
          " " +
          rd +
          " " +
          mnemonic.shamt +
          " " +
          mnemonic.funct;
      }

      // rs, rt - R type
      // div, divu, mult, multu - not used rd, shamt
      else {
        let rs = registerBin(keywordArray[1], registers);
        let rt = registerBin(keywordArray[2], registers);
        console.log(rt);
        result =
          mnemonic.op +
          " " +
          rs +
          " " +
          rt +
          " " +
          mnemonic.rd +
          " " +
          mnemonic.shamt +
          " " +
          mnemonic.funct;
      }
    }

    // Kind: Memory Access (I)
    else if (mnemonic.kind == "memory") {
      // rt,imm - I type
      // lui - not used rs, shamt, funct
      if (mnemonic.rd == "imm") {
        // for 'lui'
        let rt = registerBin(keywordArray[1], registers);
        let imm = toBin(keywordArray[2], 5);
        result = mnemonic.op + " " + mnemonic.rs + " " + rt + " " + imm;
      }

      // rt, offset(rs) - I type
      // lb, lbu, lh, lhu, lw, sb, sh, sw - not used shamt, funct
      else {
        let rt = registerBin(keywordArray[1], registers);
        let { offset, rs } = sepOffset(keywordArray[2]);
        console.log(offset);
        offset = toBin(offset, 16);
        rs = registerBin(rs, registers);
        result = mnemonic.op + " " + rs + " " + rt + " " + offset;
      }
    }

    // Kind: Branch (I, R, J)
    else if (mnemonic.kind == "branch") {
      // target - J type
      // j, jal - not used rt, rd, shamt, funct
      if (mnemonic.format == "J") {
        let target = toBin(keywordArray[1], 26);
        result = mnemonic.op + " " + target;
      }

      // I type
      else if (mnemonic.rd == "offset") {
        // rs, rt, offset - I type
        // beq, bne - not used shamt, funct
        if (mnemonic.rt == "rt") {
          // on equal and not on equal
          let rs = registerBin(keywordArray[1], registers);
          let rt = registerBin(keywordArray[2], registers);
          let offset = toBin(keywordArray[3], 16);
          result = mnemonic.op + " " + rs + " " + rt + " " + offset;
        }

        // rs, offset - I type
        // bgez, bgezal, bgtz, blez, bltz, bltzal - not used rd, shamt, funct
        else {
          let rs = registerBin(keywordArray[1], registers);
          let offset = toBin(keywordArray[2], 16);
          result = mnemonic.op + " " + rs + " " + mnemonic.rt + " " + offset;
        }
      }

      // NULL type
      else if (mnemonic.format == "NULL") {
        // _
        // sys - not used rs, rt, rd, shamt
        if (mnemonic.mnemonic == "syscall") {
          result =
            mnemonic.op +
            " " +
            mnemonic.rs +
            " " +
            mnemonic.rt +
            " " +
            mnemonic.rd +
            " " +
            mnemonic.shamt +
            " " +
            mnemonic.funct;
        }

        // rt, rd
        // mfco, mtco - not used shamt, funct, and rs is fixed
        else {
          let rt = registerBin(keywordArray[1], registers);
          let rd = registerBin(keywordArray[2], registers);
          result =
            mnemonic.op +
            " " +
            mnemonic.rs +
            " " +
            rt +
            " " +
            rd +
            " " +
            mnemonic.shamt +
            " " +
            mnemonic.funct;
        }
      }

      // code
      // break - not used rt, rd, shamt
      else if (mnemonic.mnemonic == "break") {
        let code;
        if (keywordArray[1] === undefined || keywordArray[1] === null) {
          code = toBin("0", 20);
        } else code = toBin(keywordArray[1], 20);
        result = mnemonic.op + " " + code + " " + mnemonic.funct;
      }

      // rs - R type
      // jalr - not used rt, shamt
      else if (mnemonic.mnemonic == "jalr") {
        let rs, rd;

        // no rd
        // set rd to $ra
        if (keywordArray[2] === undefined || keywordArray[2] === null) {
          rs = registerBin(keywordArray[1], registers);
          rd = registerBin("$ra", registers);
        }

        // have rd, rs 
        else {
          rd = registerBin(keywordArray[1], registers);
          rs = registerBin(keywordArray[2], registers);
        }
        result =
          mnemonic.op +
          " " +
          rs +
          " " +
          mnemonic.rt +
          " " +
          rd +
          " " +
          mnemonic.shamt +
          " " +
          mnemonic.funct;
      }

      // rs - R type
      // jr - not used rt rd, shamt
      else if (mnemonic.mnemonic == "jr") {
        let rs = registerBin(keywordArray[1], registers);
        result = mnemonic.op + " " + rs + " " + mnemonic.rt + " " + mnemonic.rd + " " + mnemonic.shamt + " " + mnemonic.funct;
      }
    }
  } else {
  }

  res.json(result);
});

const port = process.env.PORT || 8000;

app.listen(port);
console.log(`Running on http://localhost:${port}`);

module.exports = app;
