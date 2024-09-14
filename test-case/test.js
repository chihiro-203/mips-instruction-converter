const fs = require("fs");

// ------------------------------------------------------------

function checkUndefined(val, binary) {
  if (val !== undefined) {
    return "wrong";
  }
  return binary;
}

function isHex(value) {
  // Check if the value is a valid hexadecimal number (optional "0x" prefix)
  return /^0x[0-9A-Fa-f]+$/.test(value);
}

function isDec(value) {
  // Check if the value is a valid decimal number
  return /^[0-9]+$/.test(value);
}

function isBin(value) {
  // Check if the value is a valid binary number (optional "0b" prefix)
  return /^0b[01]+$/.test(value) || /^[01]+$/.test(value);
}

function toBin(input, zero, mnemonic, registers) {
  if (registerBin(input, registers) != "invalid") {
    return "invalid";
  }

  let dec, bin, overflow;

  // Hexadecimal to Binary - 0xFF
  if (isHex(input)) {
    dec = parseInt(input, 16); // Parse as hexadecimal
    bin = dec.toString(2);
    overflow = "hex";
  }

  // Decimal to Binary - 12
  else if (isDec(input)) {
    dec = parseInt(input, 10); // Parse as decimal
    bin = dec.toString(2);
    overflow = "dec";
  }

  // Binary - 0b1101
  else if (isBin(input)) {
    bin = input.replace(/^0b/, "");
    overflow = "bin";
  }

  // If not decimal, hexadecimal, or binary
  else {
    return "wrong";
  }

  // If one of decimal, hexadecimal, or binary
  if (bin.length > zero) {
    if (overflow == "bin") {
      return "The operand is out of range. Bit-width: " + mnemonic.bin + ".";
    } else if (overflow == "dec") {
      return (
        "The operand is out of range. Range (Decimal): " + mnemonic.dec + "."
      );
    } else if (overflow == "hex") {
      return (
        "The operand is out of range. Range (Hexadecimal): " +
        mnemonic.hex +
        "."
      );
    }
  }

  return bin.padStart(zero, "0");
}

// Find register in Register.json
function registerBin(name, registers) {
  if (name.match(/^\$\w+$/) || name.match(/^\w+$/)) {
    for (const item of registers) {
      if (
        item.name1.toLowerCase() === name.toLowerCase() ||
        item.name2.toLowerCase() === name.toLowerCase()
      ) {
        return String(item.value.toString(2)).padStart(5, "0");
      }
    }
  }
  return "invalid";
}

// Check if input values are registers or not, then return registers
// For R format
// [rs, rt, rd] = checkValue(registers, mArr)
// [rt, rs, rd] = checkValue(registers, mArr)
function checkValue(registers, mipsArray) {
  let v = [];
  for (let i = 1; i < mipsArray.length; i++) {
    v.push(registerBin(mipsArray[i], registers));
    if (v[i] == "invalid") {
      return "invalid";
    }
  }
  return v;
}

// Convert op, funct and not used values
// Convert imm, offset, target
function convertValue(mnemonic, values) {
  let v = [];
  for (let i = 0; i < values.length; i++) {
    let val = values[i];

    // Check if the value exists and it's not "not used"
    if (mnemonic[val] === "not used" || mnemonic[val] === undefined) {
      if (val === "funct") v.push("000000");
      else v.push("00000");
    } else {
      v.push(mnemonic[val]);
    }
  }
  return v;
}

// This is for case "Memory Access"
function sepOffset(str) {
  const match = str.match(/^(0x[0-9A-Fa-f]+|0b[01]+|\d+)\((\$?\w+)\)$/);
  if (match) {
    const [, offset, rs] = match;
    return [offset, rs];
  } else {
    return ["invalid", "invalid"];
  }
}

module.exports = {
  toBin,
  sepOffset,
  checkValue,
  convertValue,
  checkUndefined,
};

// ------------------------------------------------------------

// Function to process instructions
function processInstructions() {
  // Read the content of case.txt
  fs.readFile("case.txt", "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading case.txt:", err);
      return;
    }

    // Load JSON data from resources folder
    const registers = JSON.parse(
      fs.readFileSync("../backend/resources/Register.json", "utf-8")
    );
    const opcodes = JSON.parse(
      fs.readFileSync("../backend/resources/Opcode.json", "utf-8")
    );

    let blocks = data.split(/\n\s*\n/);
    let output = "";

    for (let block of blocks) {
      let instructions = block
        .split(",")
        .map((instr) => instr.trim())
        .filter((instr) => instr.length > 0);

      for (let mips of instructions) {
        // Split the keyword into an array based on spaces
        const mArr = mips.split(/\s+/);
        let name = mArr[0];
        var mnemonic = opcodes.find(function (item) {
          return item.mnemonic.toLowerCase() === name.toLowerCase();
        });

        let binary;

        let table = [];
        if (mnemonic) {
          let format = mnemonic.format;
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
          table.push(`op,${mnemonic.mnemonic},${op},1`);

          binary = op;

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

            // Other cases
            else {
              // Kind: Arithmetic (R)
              // rd, rs, rt - R type
              // add, addu, and, nor, or, slt, sltu, sub, subu, xor
              if (mnemonic.kind === "arithmetic" && mArr.length === 4) {
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
                    [rt_, rd_, shamt_] = [
                      mnemonic.rt,
                      mnemonic.rd,
                      mnemonic.shamt,
                    ];
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
                    [rs_, rt_, shamt_] = [
                      mnemonic.rs,
                      mnemonic.rt,
                      mnemonic.shamt,
                    ];
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
                  [rt_, rd_, shamt_] = [
                    mnemonic.rt,
                    mnemonic.rd,
                    mnemonic.shamt,
                  ];
                }
              }

              binary += rs + rt + rd + shamt + funct;

              table.push(`rs,${rs_},${rs},1`);
              table.push(`rt,${rt_},${rt},1`);
              table.push(`rd,${rd_},${rd},1`);
              table.push(`shamt,${shamt_},${shamt},1`);
              table.push(`funct,${mnemonic.funct},${funct},1`);
            }
          }

          // I format
          else if (format === "I") {
            // len = 4
            if (
              mArr.length == 4 ||
              (mArr.length == 3 && mArr[2].match(/^(0x[0-9A-Fa-f]+|0b[01]+|\d+)\((\$?\w+)\)$/))
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
            imm = toBin(mArr[1], 26, mnemonic, registers);
            let [, target_] = mArr;
            binary += imm;
            table.push(`target,${target_},${imm},3`);

            if (mArr[2] !== undefined) {
              binary = "wrong";
            }
          }

          if (imm.includes("The operand is out of range.")) {
            binary = imm;
          } else if (binary.includes("invalid")) {
            binary = "Some registers/operand are not valid. Registers/Operand must follow the syntax: " + mnemonic.opcode + ".";
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
        } else {
          // List all instructions that start with or contain the entered name
          let suggestions = opcodes.filter(function (item) {
            return item.mnemonic.toLowerCase().startsWith(name.toLowerCase()) || 
                   item.mnemonic.toLowerCase().includes(name.toLowerCase());
          });

          binary = "";
        
          if (suggestions.length > 0) {
            binary = "Did you mean one of these instructions? ";
            suggestions.forEach(function (suggestion) {
              binary += suggestion.mnemonic + " ";
            });
          } else {
            binary = "No instructions found that match or contain: " + name;
          }
        }
        output += `Instruction: "${mips}"\n - Result: ${table}\n - Binary: ${binary}\n\n`;
      }
    }

    // Write the result to output.txt
    fs.writeFile("result.txt", output, (err) => {
      if (err) {
        console.error("Error writing to result.txt:", err);
      } else {
        console.log("Data successfully written to result.txt");
      }
    });
  });
}

// Run the function
processInstructions();
