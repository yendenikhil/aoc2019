import { read } from "./utils.ts";
import { delay } from "https://deno.land/std/async/mod.ts";
const p = console.log;
const pipe = (...fn: any[]) => (x: any) => fn.reduce((y, f) => f(y), x);

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

const part = async (arr: string[], input: number) => {
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
const raw = await read(Deno.args[0]);
await part(
  raw.split(","),
  1,
);

await part(
  raw.split(","),
  2,
);
