const { l, p, readinput } = require("./utils.js");

function intcode(opcode) {
  switch (opcode) {
    case 1:
      return (a, b) => a + b;
    case 2:
      return (a, b) => a * b;
  }
  return;
}

function calc(arr, noun, verb) {
  arr[1] = noun;
  arr[2] = verb;
  for (let i = 0; i < arr.length; i += 4) {
    const func = intcode(arr[i]);
    if (func) {
      const x1 = arr[i + 1];
      const x2 = arr[i + 2];
      const x3 = arr[i + 3];
      const res = func(arr[x1], arr[x2]);
      arr[x3] = res;
    } else {
      break;
    }
  }
  return arr[0];
}

readinput(process.argv[2])
  .then((input) => input.split(","))
  .then((input) => input.map((i) => Number(i)))
  .then((arr) => {
    // part 1
    p(calc([...arr], 12, 2));
    // part 2
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        if (calc([...arr], i, j) === 19690720) {
          p(`${100 * i + j}`);
          break;
        }
      }
    }
  })
  .catch((e) => p(e));
