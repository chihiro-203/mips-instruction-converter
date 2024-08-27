// Turn number to binary
function toBinary(number) {
  return (number >>> 0).toString(2);
}

function isHex(value) {
  // return /^0x[0-9A-Fa-f]+$/.test(value) || /^[0-9A-Fa-f]+$/.test(value);
  return /^0x[0-9A-Fa-f]+$/.test(value);
}
function isDec(value) {
  // A simple regex to check if the value is a valid decimal number
  return /^[0-9]+$/.test(value);
}
function toBin(input) {
  if (isHex(input)) {
    let dec = parseInt(input, 16);
    return dec.toString(2).padStart(5, "0");
  } else if (isDec(input)) {
    let dec = parseInt(input);
    return dec.toString(2).padStart(5, "0");
  }
}

// Fix this
function registerBin(name, registers) {
  for (const item of registers) {
    if (
      item.name1.toLowerCase() === name.toLowerCase() ||
      item.name2.toLowerCase() === name.toLowerCase()
    ) {
      return String(toBinary(item.value)).padStart(5, "0");
    }
  }
  return null;
}

function findRegister(mips, registers, result) {
  let i = 1;
  while (i < mips.length) {
    num = mips[i];
    var name1 = registers.find(function (item) {
      return item.name1.toLowerCase().includes(num.toLowerCase());
    });
    if (name1) {
      result += String(toBinary(name1.number)).padStart(5, "0");
    } else {
      var name2 = registers.find(function (item) {
        return item.name2.toLowerCase().includes(num.toLowerCase());
      });
      if (name2) {
        result += String(toBinary(name2.number)).padStart(5, "0");
      } else {
        result = "No data";
        break;
      }
    }
    i++;
  }
  return result;
}

function drawTable() {}

function explanation(mnemonic) {
  let format = mnemonic.format;
  let explain = `
      <div style="text-align: left; margin-bottom: 0.5rem; font-size: 1vw;">
        <strong>${mnemonic.name} (${mnemonic.mnemonic})</strong> is a ${format}-type instruction: 
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

function sepOffset(str) {
  const match = str.match(/^(\d+)\((\$\w+)\)$/);
  if (match) {
    const [ , offset, rs] = match;
    return { offset, rs };
  } else {
    throw new Error("Format is incorrect");
  }
}

module.exports = {
  toBin,
  sepOffset,
  registerBin,
  findRegister,
  drawTable,
  explanation,
};
