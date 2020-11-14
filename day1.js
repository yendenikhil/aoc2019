const { l, readinput } = require("./utils.js");
function fuel(mass) {
  const ans = Math.floor(mass / 3) - 2;
  return ans < 0 ? 0 : ans;
}

function calc(mass) {
  let ans = fuel(mass);
  let total = 0;
  while (ans > 0) {
    total += ans;
    ans = fuel(ans);
  }
  return total;
}

// part 1
readinput(process.argv[2])
  .then((input) => {
    const result = input.split("\n")
      .map((line) => fuel(line))
      .reduce((res, val) => res + val, 0);
    l(result);
  });

// part 2
readinput(process.argv[2])
  .then((input) => {
    const result = input.split("\n")
      .map((line) => calc(line))
      .reduce((res, val) => res + val, 0);
    l(result);
  });
