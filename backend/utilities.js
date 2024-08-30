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

function explanation(mnemonic) {
  let format = mnemonic.format;
  let explain = `
      <div style="text-align: left; margin-bottom: 0.5rem; font-size: 1vw;">
        <strong>${mnemonic.name} (${mnemonic.opcode})</strong> is a ${format}-type instruction: 
        ${mnemonic.action}
      </div>`;
  if (format == "R") {
    explain += `
      <table style="width: 100%; border: 2px solid #5f3c9180; border-collapse: collapse; font-size: 1.2vw";>
        <tr><th>op</th><th>rs</th><th>rt</th><th>rd</th><th>shamt</th><th>funct</th></tr>
        <tr><td>6-bit</td><td>5-bit</td><td>5-bit</td><td>5-bit</td><td>5-bit</td><td>6-bit</td></tr>
      </table>
      <div style="text-align: left; font-size: 0.95vw; margin-top: 0.75rem;">
        <li><strong>op:</strong> Opcode = 0 (common to all R-format instructions) (6 bits)</li>
        <li><strong>rs:</strong> 1st register operand (5 bits)</li>
        <li><strong>rt:</strong> 2nd register operand (5 bits)</li>
        <li><strong>rd:</strong> Register destination (5 bits)</li>
        <li><strong>shamt:</strong> Shift amount (0 when not applicable) (5 bits)</li>
        <li><strong>funct:</strong> Function code (identifies the specific R-format instruction) (6 bits)</li>
      </div>`;
  } else if (format == "I") {
    explain += `
      <table style="width: 100%; border: 2px solid #5f3c9180; border-collapse: collapse; font-size: 1.2vw">
        <tr><th>op</th><th>rs</th><th>rt</th><th colspan="3">imm/offset</th></tr>
        <tr><td>6-bit</td><td>5-bit</td><td>5-bit</td><td colspan="3">16-bit</td></tr>
      </table>
      <div style="text-align: left; font-size: 1vw; margin-top: 0.75rem;">
        <li><strong>op:</strong> Opcode (specifies the operation type) (6 bits)</li>
        <li><strong>rs:</strong> Source register (5 bits)</li>
        <li><strong>rt:</strong> Destination register (5 bits)</li>
        <li><strong>imm/offset:</strong> Immediate value or offset (16 bits)</li>
      </div>`;
  } else if (format == "J") {
    explain += `
      <table style="width: 100%; border: 2px solid #5f3c9180; font-size: 1.2vw">
        <tr><th>op</th><th colspan="5">target</th></tr>
        <tr><td>6-bit</td><td colspan="5">16-bit</td></tr>
      </table>
      <div style="text-align: left; font-size: 1vw; margin-top: 0.75rem;">
        <li><strong>op:</strong> Opcode (specifies the operation type) (6 bits)</li>
        <li><strong>target/offset:</strong> Target Address (26 bits)</li>
      </div>`;
  }
  return explain;
}

module.exports = {
  toBin,
  sepOffset,
  registerBin,
  checkRegister,
  explanation,
};
