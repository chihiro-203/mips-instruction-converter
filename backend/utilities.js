// Turn number to binary
function toBinary(number) {
  return (number >>> 0).toString(2);
}

function isHex(value) {
  return /^0x[0-9A-Fa-f]+$/.test(value) || /^[0-9A-Fa-f]+$/.test(value);
}

function isDec(value) {
  // A simple regex to check if the value is a valid decimal number
  return /^[0-9]+$/.test(value);
}

function toBin(input) {
  if (isHex(input)) {
      let dec = parseInt(input, 16);
      return dec.toString(2);
  } else if (isDec(input)) {
      let dec = parseInt(input);
      return dec.toString(2);
  }
}

function registerBin(name, registers) {
  for (const item of registers) {
    if (
      item.name1.includes(name.toLowerCase()) ||
      item.name1.includes(name.toLowerCase())
    ) {
      return String(toBinary(item.value)).padStart(5, "0");
    }
  }
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

module.exports = {
  toBin,
  registerBin,
  findRegister,
  drawTable,
};
