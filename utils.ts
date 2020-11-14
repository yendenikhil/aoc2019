const decoder = new TextDecoder("utf-8");
import * as log from "https://deno.land/std@0.76.0/log/mod.ts";
import { format } from "https://deno.land/std@0.76.0/datetime/mod.ts";

export async function read(file: string) {
  const raw = await Deno.readFile(file);
  return decoder.decode(raw);
}
export function lb(msg: bigint) {
  log.info(msg.toString());
}

export function l(msg: any) {
  log.info(msg);
}

export const p = l;

export const permute = (arr: number[]) => {
  const swap = (arrToSwap: number[], i1: number, i2: number) => {
    const temp = arrToSwap[i1];
    arrToSwap[i1] = arrToSwap[i2];
    arrToSwap[i2] = temp;
  };

  const output: number[][] = [];
  const generate = (n: number, genArr: number[]) => {
    if (n === 1) {
      output.push(genArr.slice());
    } else {
      generate(n - 1, genArr);
      for (let i = 0; i < n - 1; i++) {
        if (n % 2 == 0) {
          swap(genArr, i, n - 1);
        } else {
          swap(genArr, 0, n - 1);
        }
        generate(n - 1, genArr);
      }
    }
  };

  generate(arr.length, arr);
  return output;
};
