import { delay } from "https://deno.land/std/async/mod.ts";
const input =
  `3,1033,1008,1033,1,1032,1005,1032,31,1008,1033,2,1032,1005,1032,58,1008,1033,3,1032,1005,1032,81,1008,1033,4,1032,1005,1032,104,99,101,0,1034,1039,1002,1036,1,1041,1001,1035,-1,1040,1008,1038,0,1043,102,-1,1043,1032,1,1037,1032,1042,1105,1,124,1001,1034,0,1039,1001,1036,0,1041,1001,1035,1,1040,1008,1038,0,1043,1,1037,1038,1042,1105,1,124,1001,1034,-1,1039,1008,1036,0,1041,1001,1035,0,1040,101,0,1038,1043,102,1,1037,1042,1106,0,124,1001,1034,1,1039,1008,1036,0,1041,1001,1035,0,1040,101,0,1038,1043,1001,1037,0,1042,1006,1039,217,1006,1040,217,1008,1039,40,1032,1005,1032,217,1008,1040,40,1032,1005,1032,217,1008,1039,9,1032,1006,1032,165,1008,1040,9,1032,1006,1032,165,1101,2,0,1044,1106,0,224,2,1041,1043,1032,1006,1032,179,1102,1,1,1044,1105,1,224,1,1041,1043,1032,1006,1032,217,1,1042,1043,1032,1001,1032,-1,1032,1002,1032,39,1032,1,1032,1039,1032,101,-1,1032,1032,101,252,1032,211,1007,0,73,1044,1105,1,224,1101,0,0,1044,1106,0,224,1006,1044,247,101,0,1039,1034,102,1,1040,1035,102,1,1041,1036,1002,1043,1,1038,1001,1042,0,1037,4,1044,1106,0,0,57,60,59,78,42,22,33,69,5,77,92,10,55,22,99,62,27,32,75,13,82,48,40,83,95,38,62,65,70,77,79,61,2,47,27,84,46,48,16,15,87,87,23,95,97,16,93,79,27,7,98,97,76,44,6,75,85,51,8,91,94,99,35,28,84,67,83,82,1,80,40,99,81,92,41,97,87,28,81,52,93,37,27,85,76,4,18,80,96,61,83,16,90,86,77,8,76,55,51,61,72,90,90,5,96,75,13,56,40,82,11,97,21,55,95,17,93,97,16,91,30,77,28,32,77,96,49,13,97,30,14,26,93,61,18,32,85,95,81,65,98,49,65,84,46,19,81,45,76,22,88,79,63,84,60,24,37,4,34,80,98,61,95,46,88,99,76,3,92,75,12,95,9,98,94,57,41,77,52,17,80,83,17,83,59,87,85,2,95,88,41,32,98,72,95,23,91,83,65,82,47,90,17,81,67,81,6,90,61,44,85,40,85,19,82,26,86,1,74,62,6,75,98,93,12,84,11,38,57,88,91,76,66,43,46,84,38,48,99,57,20,97,34,72,75,47,94,33,83,82,55,76,34,90,9,74,34,87,18,84,57,38,76,3,31,87,77,2,86,15,23,92,37,20,75,94,27,88,90,87,28,84,31,92,15,75,14,10,82,48,99,49,79,4,96,91,30,16,78,7,75,67,98,1,75,49,70,87,95,89,30,54,31,92,71,57,39,79,19,55,85,25,92,4,23,77,74,77,89,40,39,77,87,39,44,81,98,80,94,29,40,88,69,74,92,54,2,1,83,30,87,85,15,80,97,94,15,93,89,71,69,86,81,75,56,92,58,95,51,93,29,82,79,24,82,9,46,5,88,53,75,90,31,6,91,69,88,8,10,23,67,5,85,78,71,36,98,19,98,53,66,43,17,91,62,28,86,44,79,33,91,79,66,71,86,98,86,60,83,44,94,96,29,85,89,50,85,98,14,8,43,5,75,62,89,90,33,30,86,48,75,99,88,82,45,99,38,60,76,69,45,89,27,93,71,84,96,15,52,85,58,97,99,20,5,79,75,33,80,84,63,87,1,77,31,44,49,99,79,3,83,16,91,42,7,99,66,82,93,76,31,55,77,30,45,88,3,81,53,30,95,24,90,96,26,33,93,32,40,25,76,21,75,17,89,31,81,18,29,97,72,60,90,14,99,93,9,55,92,26,86,28,99,93,1,98,86,60,26,68,95,7,17,86,94,48,68,95,94,88,86,67,82,77,55,76,68,79,76,65,76,21,23,78,28,82,75,23,84,74,67,69,83,70,93,38,75,81,61,87,23,86,92,43,13,23,81,65,65,76,41,34,95,64,89,90,72,79,16,47,84,47,28,83,74,1,41,59,87,84,34,32,94,4,78,37,17,99,86,91,58,97,69,26,93,41,81,36,78,80,18,79,96,51,37,74,45,94,54,98,90,74,27,8,89,79,81,71,60,88,40,86,33,95,98,21,13,9,20,94,48,82,42,69,15,84,45,89,42,98,99,72,72,84,86,54,80,74,68,74,5,85,80,75,34,29,98,16,85,16,86,13,25,74,95,51,86,90,28,81,90,20,70,7,89,37,74,28,86,29,81,95,66,1,64,83,85,27,74,4,69,54,79,66,50,96,43,94,95,45,52,83,17,37,88,85,55,35,66,78,66,86,4,92,2,99,35,89,13,76,71,81,92,96,18,85,68,95,61,97,76,82,66,85,99,82,6,93,31,81,76,80,27,95,38,94,85,98,41,91,0,0,21,21,1,10,1,0,0,0,0,0,0`;
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
      p(`halt called`);
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

// ======================================================
/*
Let's do it with BFS algorithm, it will be longer this way but we are 
sure that we will get the shortest path. 
The challenge here is that the intcode computer maintains the state, hence, 
before we try things we need to come back (reverse steps).

Also, do we need to maintain the coordinates? 
I think not, we can just maintain the series of inputs we should be able 
to find the oxygen tank.

How
so at position zero we have prev steps empty []
we get all possible steps [1], [2], [3], [4]

the lets take first input [1] 
output === 0 then it hit the wall and we can discard this input. 

the lets take second input [2] 
output === 1 then it stepped ahead we need to get all possible steps [2,1][2,2][2,3][2,4]
now push these at the end of the queue to be tested. 

and then as we took step forward we need to step back all the way to begining so
get the reverse path
output === 2 then stop and print the step length

do we care about visited? I don't think so. 


THe program is running too long. I am going to make visited paths and filter them out. 

 */

const visited: number[][] = [];

const notInVisited = (path: number[]) => {
  const s = path.join("");
  return !visited.map((e) => e.join("")).find((e) => e === s);
};

const allDir = (input: number[]) => {
  return [
    [...input, 1],
    [...input, 4],
    [...input, 2],
    [...input, 3],
  ];
};

const reverse = (input: number[]) => {
  const rev = [0, 2, 1, 4, 3];
  return input.map((e) => rev[e]);
};

const part1 = async (arr: string[]) => {
  let stepper: Step = {
    arr: arr.slice(),
    base: 0,
    halt: false,
    index: 0,
    input: undefined,
  };

  const queue: number[][] = [...allDir([])];
  let path = queue.shift();
  let orig = path?.slice();
  stepper.input = path?.shift();

  while (!stepper.halt) {
    stepper = await step(stepper);
    if (stepper.output !== undefined) {
      const output = Number(stepper.output);
      // we need ignore the output till we reach to the last point
      if (path?.length === 0 && orig) {
      p({output, l: orig.length})
        // if (queue.length % 1000 === 0) p({q: queue.length, s: orig.length})
        //await delay(1000)
        if (output === 0) {
          // means the robot has not moved, so reverse should be all steps sans last step
          path = reverse(orig.slice(0, -1));
        }
        if (output === 1) {
          // get new all dir
          queue.push(...allDir(orig).filter(notInVisited));
          // reverse back to origin

          path = reverse(orig);
        } else if (output === 2) {
          p(`####################`);
          p({ orig });
          p(orig?.length);
          break;
        }
        // pop new path
        // we can make one long list with reverse + new path
        orig = queue.shift();
        if (orig) visited.push(orig.slice());
        // p({path, orig})
        if (orig) path.push(...orig);
      }
      stepper.input = path?.shift();
    }
  }
};

await part1(input.split(","));
