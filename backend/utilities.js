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
    }
    else if (overflow == "dec") {
      return "The operand is out of range. Range (Decimal): " + mnemonic.dec + ".";
    }
    else if (overflow == "hex") {
      return "The operand is out of range. Range (Hexadecimal): " + mnemonic.hex + ".";
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
        return String((item.value).toString(2)).padStart(5, "0");
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
    console.log(`Accessing ${val} from mnemonic`);
    
    // Check if the value exists and it's not "not used"
    if (mnemonic[val] === "not used" || mnemonic[val] === undefined) {
      if (val === "funct") 
        v.push("000000"); 
      else v.push("00000"); 
    } else {
      v.push(mnemonic[val]); 
    }
  }
  return v;
}

// This is for case "Memory Access"
function sepOffset(str) {
  const match = str.match(/^(\d+)\((\$\w+)\)$/);
  if (match) {
    const [, offset, rs] = match;
    return [ offset, rs ];
  } else {
    throw new Error("Format is incorrect");
  }
}

module.exports = {
  toBin,
  sepOffset,
  checkValue,
  convertValue,
  checkUndefined
};
