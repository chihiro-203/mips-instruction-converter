// Turn number to binary
function toBinary(number) {
  return (number >>> 0).toString(2);
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

function toBin(input, zero) {
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
    return "null";
  }

  // If one of decimal, hexadecimal, or binary
  if (bin.length > zero) {
    return overflow;
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
        return String(toBinary(item.value)).padStart(5, "0");
      }
    }
  }
  return "null";
}

// Check if registers exist or not
function checkRegister(result, ...registers) {
  for (let i = 0; i < registers.length; i++) {
    if (
      registers[i] === null ||
      registers[i] === undefined ||
      registers[i] == "null"
    ) {
      return "invalid";
    } else if (registers[i] == "bin" || registers[i] == "dec" || registers[i] == "hex") {
      return registers[i];
    }
  }
  return result;
}

// Check if input values are registers or not, then return registers
// [rs, rt, rd] = checkValue(registers, mArr)
// [rt, rs, rd] = checkValue(registers, mArr)
function checkValue(registers, mipsArray) {
  let v = [];
  for (let i = 1; i < mipsArray.length; i++) {
    v.push(registerBin(mipsArray[i], registers));
    if (v[i] == "null") {
      return "invalid";
    }
  }
  return v;
}

// This is for case "Memory Access"
function sepOffset(str) {
  const match = str.match(/^(\d+)\((\$\w+)\)$/);
  if (match) {
    const [, offset, rs] = match;
    return { offset, rs };
  } else {
    throw new Error("Format is incorrect");
  }
}

module.exports = {
  toBin,
  sepOffset,
  registerBin,
  checkRegister,
  checkValue
};
