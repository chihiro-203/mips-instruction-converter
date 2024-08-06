// Turn number to binary
function toBinary(number) {
  return (number >>> 0).toString(2);
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
  registerBin,
  findRegister,
  drawTable,
};
