import { read } from "./utils.ts";
import { delay } from "https://deno.land/std/async/mod.ts";
const p = console.log;
const pipe = (...fn: any[]) => (x: any) => fn.reduce((y, f) => f(y), x);

/*
let base = 0;
const re = /.*(.)(.)(.)(..)/;
*/

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
    await delay(10);
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
  let output = step.output;
  let newBase = step.base;
  let isInputUsed = false;
  let halt = false;
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
      p(`output: ${output}`);
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

// =========================================
/*
function opdecode(arr: string[], input: number) {
  const raw = "0000" + arr[input];
  const out = re.exec(raw);
  if (!out) return [0];
  const [op, ...pos] = out.slice(1).map((e) => Number(e)).reverse();
  const ans: number[] = [];
  ans.push(op);
  if (op !== 99) {
    switch (pos[0]) {
      case 0:
        ans.push(Number(arr[input + 1]));
        break;
      case 1:
        ans.push(input + 1);
        break;
      case 2:
        ans.push(base + Number(arr[input + 1]));
        break;
    }
  }
  if (op === 5 || op === 6) {
    switch (pos[1]) {
      case 0:
        ans.push(Number(arr[input + 2]));
        break;
      case 1:
        ans.push(input + 2);
        break;
      case 2:
        ans.push(base + Number(arr[input + 2]));
        break;
    }
  }
  if (op === 1 || op === 2 || op === 7 || op === 8) {
    switch (pos[1]) {
      case 0:
        ans.push(Number(arr[input + 2]));
        break;
      case 1:
        ans.push(input + 2);
        break;
      case 2:
        ans.push(base + Number(arr[input + 2]));
        break;
    }
    switch (pos[2]) {
      case 0:
        ans.push(Number(arr[input + 3]));
        break;
      case 1:
        ans.push(input + 3);
        break;
      case 2:
        ans.push(base + Number(arr[input + 3]));
        break;
    }
  }
  return ans;
}
function zeroPad(arr: string[], len: number) {
  if (len >= arr.length) {
    for (let i = arr.length; i < len; i++) {
      arr[i] = "0";
    }
  }
}

function perform3(
  arr: string[],
  func: { (a: bigint, b: bigint): bigint },
  idx1: number,
  idx2: number,
  idx3: number,
) {
  zeroPad(arr, Math.max(idx1, idx2, idx3));
  const ans = String(func(BigInt(arr[idx1]), BigInt(arr[idx2])));
  arr[idx3] = ans;
}

function checkIf(
  arr: string[],
  func: { (a: string): boolean },
  idx1: number,
  idx2: number,
) {
  zeroPad(arr, Math.max(idx1, idx2));
  if (func(arr[idx1])) {
    return Number(arr[idx2]);
  }
  return;
}

async function intcode(arr: string[], input: number) {
  let i = 0;
  let output = "";
  let halted = false;
  let flag = false;
  while (!halted) {
    // await delay(1000)
    const vec = opdecode(arr, i);
    //p(`>>>>> ${vec}`)
    switch (vec[0]) {
      case 1:
        {
          perform3(arr, (a, b) => a + b, vec[1], vec[2], vec[3]);
          i += 4;
        }
        break;
      case 2:
        {
          perform3(arr, (a, b) => a * b, vec[1], vec[2], vec[3]);
          i += 4;
        }
        break;
      case 3:
        {
          arr[vec[1]] = String(input);
          i += 2;
        }
        break;
      case 4:
        {
          // p(`vec: ${vec}`)
          output = arr[vec[1]];
          p(`output: ${output}`);
          i += 2;
        }
        break;
      case 5:
        {
          const res5 = checkIf(arr, (a) => a !== "0", vec[1], vec[2]);
          if (res5) {
            i = res5;
          } else {
            i += 3;
          }
        }
        break;
      case 6:
        {
          const res6 = checkIf(arr, (a) => a === "0", vec[1], vec[2]);
          if (res6) {
            i = res6;
          } else {
            i += 3;
          }
        }
        break;
      case 7:
        {
          perform3(arr, (a, b) => a < b ? 1n : 0n, vec[1], vec[2], vec[3]);
          i += 4;
        }
        break;
      case 8:
        {
          perform3(arr, (a, b) => a === b ? 1n : 0n, vec[1], vec[2], vec[3]);
          i += 4;
        }
        break;
      case 9:
        {
          base = base + Number(arr[vec[1]]);
          // p(`base: ${base} after ${arr[vec[1]]}`)
          i += 2;
        }
        break;
      case 99:
        halted = true;
        flag = true;
        break;
      default:
        p("error error: " + i + ": " + vec[0]);
        flag = true;
    }
    if (flag) break;
  }
  return output;
}

const raw = await read(Deno.args[0]);
const arr = raw.split(",");

const part1 = async (arr: string[], input: number) => {
  const output = await intcode(arr.slice(), input);
  p(output);
};
*/
const part1v2 = async (arr: string[], input: number) => {
  let stepper: Step = {
    arr: arr,
    index: 0,
    input: input,
    base: 0,
    output: undefined,
    halt: false,
  };
  while (!stepper.halt) {
    stepper = await step(stepper);
  }
  p(`final: ${stepper.output}`);
};
await part1v2(
  (await read(Deno.args[0])).split(","),
  1,
);
