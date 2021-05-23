const raw =
  `109,424,203,1,21101,11,0,0,1105,1,282,21101,18,0,0,1105,1,259,2101,0,1,221,203,1,21101,31,0,0,1106,0,282,21102,1,38,0,1106,0,259,21002,23,1,2,22102,1,1,3,21101,0,1,1,21101,0,57,0,1105,1,303,1202,1,1,222,21002,221,1,3,20102,1,221,2,21102,259,1,1,21101,0,80,0,1105,1,225,21101,104,0,2,21101,0,91,0,1106,0,303,2101,0,1,223,20102,1,222,4,21101,0,259,3,21102,1,225,2,21102,1,225,1,21102,1,118,0,1106,0,225,20102,1,222,3,21101,67,0,2,21102,133,1,0,1105,1,303,21202,1,-1,1,22001,223,1,1,21102,148,1,0,1105,1,259,1202,1,1,223,20102,1,221,4,21001,222,0,3,21101,0,18,2,1001,132,-2,224,1002,224,2,224,1001,224,3,224,1002,132,-1,132,1,224,132,224,21001,224,1,1,21101,195,0,0,105,1,109,20207,1,223,2,21001,23,0,1,21101,-1,0,3,21102,214,1,0,1105,1,303,22101,1,1,1,204,1,99,0,0,0,0,109,5,1202,-4,1,249,22101,0,-3,1,22102,1,-2,2,21202,-1,1,3,21101,250,0,0,1106,0,225,21202,1,1,-4,109,-5,2106,0,0,109,3,22107,0,-2,-1,21202,-1,2,-1,21201,-1,-1,-1,22202,-1,-2,-2,109,-3,2106,0,0,109,3,21207,-2,0,-1,1206,-1,294,104,0,99,21201,-2,0,-2,109,-3,2106,0,0,109,5,22207,-3,-4,-1,1206,-1,346,22201,-4,-3,-4,21202,-3,-1,-1,22201,-4,-1,2,21202,2,-1,-1,22201,-4,-1,1,21202,-2,1,3,21102,343,1,0,1106,0,303,1105,1,415,22207,-2,-3,-1,1206,-1,387,22201,-3,-2,-3,21202,-2,-1,-1,22201,-3,-1,3,21202,3,-1,-1,22201,-3,-1,2,22101,0,-4,1,21101,384,0,0,1106,0,303,1106,0,415,21202,-4,-1,-4,22201,-4,-3,-4,22202,-3,-2,-2,22202,-2,-4,-4,22202,-3,-2,-3,21202,-4,-1,-2,22201,-3,-2,1,21201,1,0,-4,109,-5,2106,0,0`;
const p = console.log;
const indexForMode = (arr: string[], base: number) =>
  (mode: number) =>
    (index: number): number => {
      switch (mode) {
        case 0:
          return Number(arr[index]) ?? 0;
        case 1:
          return index;
        case 2:
          return Number(arr[index] ?? 0) + base;
        default:
          p(`error in indexForMode mode: ${mode}, index: ${index}`);
          return -1;
      }
    };
const opSplitter = (input: string): number[] => {
  const raw = "0000" + input;
  const re = /.*(.)(.)(.)(..)/;
  const out = raw.match(re);
  if (out) {
    return out.slice(1).map((e) => Number(e)).reverse();
  } else {
    return [99];
  }
};

const decodeIndex = (arr: string[]) =>
  async (index: number, base: number): Promise<[number, number[]]> => {
    const [op, ...pos] = opSplitter(arr[index]);
    const posFunc = indexForMode(arr, base);
    const indices = pos.map((v, i) => posFunc(v)(index + i + 1));
    // p(`i: ${index} b: ${base} with arr val: ${arr[index]} pos: ${indices}`);
    //    await delay(10);
    return [op, indices];
  };

const getVal = (arr: string[]) =>
  (index: number) => {
    const str = arr[index] ?? "0";
    return BigInt(str);
  };

const setVal = (arr: string[]) =>
  (index: number) =>
    (val: bigint | undefined) => {
      const ans = arr.slice();
      if (val !== undefined) {
        if (index >= ans.length) {
          for (let i = ans.length; i < index; i++) {
            ans[i] = "0";
          }
        }
        // p(`setting ${val.toString()} on index: ${index}`);
        ans[index] = val.toString();
      }
      return ans;
    };

const operate3 = (func: { (a: bigint, b: bigint): bigint }) =>
  (arr: string[]) =>
    (i1: number, i2: number, i3: number) => {
      const s = setVal(arr);
      const g = getVal(arr);
      return s(i3)(func(g(i1), g(i2)));
    };
const indexChanger = (func: { (a: bigint): boolean }) =>
  (i1: number, i2: number) =>
    (arr: string[]) =>
      (index: number) => {
        const av = getVal(arr)(i1);
        const ans = func(av);
        // p(`av: ${av} and ans: ${ans}`);
        if (ans) {
          return Number(getVal(arr)(i2));
        } else {
          return index + 3;
        }
      };

interface Step {
  arr: string[];
  input?: number;
  output?: string;
  index: number;
  base: number;
  halt: boolean;
}

const step = async (step: Step) => {
  // p(`arr slice ${step.arr.slice(step.index, step.index + 4)}`);
  const [op, indices] = await decodeIndex(step.arr)(step.index, step.base);
  let arrFunc;
  let indexFun;
  let output = undefined;
  let newBase = step.base;
  let halt = false;
  let isInputUsed = false;
  // deal with arr operations
  switch (op) {
    case 1:
      arrFunc = operate3((a, b) => a + b);
      indexFun = (index: number) => index + 4;
      break;
    case 2:
      arrFunc = operate3((a, b) => a * b);
      indexFun = (index: number) => index + 4;
      break;
    case 3:
      isInputUsed = true;
      arrFunc = (arr: string[]) =>
        (index: number) => setVal(arr)(index)(BigInt(step.input));
      indexFun = (index: number) => index + 2;
      break;
    case 7:
      arrFunc = operate3((a, b) => a < b ? 1n : 0n);
      indexFun = (index: number) => index + 4;
      break;
    case 8:
      arrFunc = operate3((a, b) => a === b ? 1n : 0n);
      indexFun = (index: number) => index + 4;
      break;
    default:
      arrFunc = (arr: string[]) => (index: number) => arr.slice();
  }
  // deal with non array changes like  index change and output and base changes
  switch (op) {
    case 4:
      //p(`arr slice ${step.arr.slice(step.index, step.index + 4)}`);
      output = getVal(step.arr)(indices[0]).toString();
      // p(`output: ${output}`);
      indexFun = (index: number) => index + 2;
      break;
    case 5:
      indexFun = indexChanger((a) => a !== 0n)(indices[0], indices[1])(
        step.arr,
      );
      break;
    case 6:
      indexFun = indexChanger((a) => a === 0n)(indices[0], indices[1])(
        step.arr,
      );
      break;
    case 9:
      newBase = newBase + Number(getVal(step.arr)(indices[0]));
      indexFun = (index: number) => index + 2;
      break;
    case 99:
      // p(`halt called`);
      halt = true;
      indexFun = (index: number) => index;
      break;
    default:
      if (!indexFun) {
        indexFun = (index: number) => index + 1;
      }
  }
  return {
    arr: arrFunc(step.arr)(indices[0], indices[1], indices[2]),
    index: indexFun(step.index),
    output: output,
    base: newBase,
    input: isInputUsed ? undefined : step.input,
    halt: halt,
  };
};

const part = async (arr: string[], inputs: number[]) => {
  let stepper: Step = {
    arr: arr.slice(),
    base: 0,
    halt: false,
    index: 0,
    input: undefined,
  };
  const output = [];

  while (!stepper.halt) {
    if (stepper.input === undefined) {
      stepper.input = inputs.shift();
      // p(`input: ${stepper.input}`)
    }
    stepper = await step(stepper);
    if (stepper.output !== undefined) {
      // p(`output: ${stepper.output}`)
      return stepper.output;
    }
  }
  return "-1";
};

const part1 = async (raw: string) => {
  let outputs = 0;
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      const inputs = [i, j];
      const output = await part(await raw.split(","), inputs.slice());
      // p({inputs, output})
      if (parseInt(output) === 1) outputs++;
    }
  }
  p(`answer: ${outputs}`);
};

const part2 = async (raw: string) => {
  // find i, j such that i,j and i, j+99 both have #
  // then check i+99,j and i+99,j+99 are both #
  // if not found then keep inc j if we get i,j*+99 has #, if not then inc i and start from start
  let i = 500;
  let j = 500;
  while (true) {
    // if (i % 200 === 0 || j % 200 === 0) p({ i, j });
    const leftdown = await part(await raw.split(","), [i, j]);
    if (parseInt(leftdown) !== 1) {
      j++;
      continue;
    }
    const leftup = await part(await raw.split(","), [i - 99, j]);
    if (parseInt(leftup) !== 1) {
      i++;
      continue;
    }
    const rightup = await part(await raw.split(","), [i - 99, j + 99]);
    if (parseInt(rightup) !== 1) {
      i++;
      continue;
    }
    const rightdown = await part(await raw.split(","), [i, j + 99]);
    if (parseInt(rightdown) !== 1) {
      i++;
      continue;
    }
    p(`answer: ${i - 99}, ${j} = ${(i - 99) * 10000 + j}`);
    break;
  }
};

console.time("p");
await part1(raw);
console.timeLog("p");
await part2(raw);
console.timeEnd("p");
