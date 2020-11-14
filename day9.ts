import { p, read } from "./utils.ts"
import { delay } from "https://deno.land/std/async/mod.ts"

const re = /.*(.)(.)(.)(..)/
let base = 0

function opdecode(arr: string[], input: number) {
  const raw = "0000" + arr[input]
  const out = re.exec(raw)
  if (!out) return [0]
  const [op, ...pos] = out.slice(1).map((e) => Number(e)).reverse()
  const ans: number[] = []
  ans.push(op)
  if (op !== 99) {
    switch (pos[0]) {
      case 0:
        ans.push(Number(arr[input + 1]))
        break
      case 1:
        ans.push(input + 1)
        break
      case 2:
        ans.push(base + Number(arr[input + 1]))
        break
    }
  }
  if (op === 5 || op === 6) {
    switch (pos[1]) {
      case 0:
        ans.push(Number(arr[input + 2]))
        break
      case 1:
        ans.push(input + 2)
        break
      case 2:
        ans.push(base + Number(arr[input + 2]))
        break
    }
  }
  if (op === 1 || op === 2 || op === 7 || op === 8) {
    switch (pos[1]) {
      case 0:
        ans.push(Number(arr[input + 2]))
        break
      case 1:
        ans.push(input + 2)
        break
      case 2:
        ans.push(base + Number(arr[input + 2]))
        break
    }
    switch (pos[2]) {
      case 0:
        ans.push(Number(arr[input + 3]))
        break
      case 1:
        ans.push(input + 3)
        break
      case 2:
        ans.push(base + Number(arr[input + 3]))
        break
    }
  }
  return ans
}
function zeroPad(arr: string[], len: number) {
  if (len >= arr.length) {
    for (let i = arr.length - 1; i <= len; i++) {
      arr[i] = "0"
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
  zeroPad(arr, Math.max(idx1, idx2, idx3))
  const ans = String(func(BigInt(arr[idx1]), BigInt(arr[idx2])))
  arr[idx3] = ans
}

function checkIf(
  arr: string[],
  func: { (a: string): boolean },
  idx1: number,
  idx2: number,
) {
  zeroPad(arr, Math.max(idx1, idx2))
  if (func(arr[idx1])) {
    return Number(arr[idx2])
  }
  return
}

async function intcode(arr: string[], input: number) {
  let i = 0
  let output = ""
  let halted = false
  let flag = false
  while (!halted) {
    // await delay(1000)
    const vec = opdecode(arr, i)
    //p(`>>>>> ${vec}`)
    switch (vec[0]) {
      case 1:
        {
          perform3(arr, (a, b) => a + b, vec[1], vec[2], vec[3])
          i += 4
        }
        break
      case 2:
        {
          perform3(arr, (a, b) => a * b, vec[1], vec[2], vec[3])
          i += 4
        }
        break
      case 3:
        {
          arr[vec[1]] = String(input)
          i += 2
        }
        break
      case 4:
        {
         // p(`vec: ${vec}`)
          output = arr[vec[1]]
           p(`output: ${output}`)
          i += 2
        }
        break
      case 5:
        {
          const res5 = checkIf(arr, (a) => a !== "0", vec[1], vec[2])
          if (res5) {
            i = res5
          } else {
            i += 3
          }
        }
        break
      case 6:
        {
          const res6 = checkIf(arr, (a) => a === "0", vec[1], vec[2])
          if (res6) {
            i = res6
          } else {
            i += 3
          }
        }
        break
      case 7:
        {
          perform3(arr, (a, b) => a < b ? 1n : 0n, vec[1], vec[2], vec[3])
          i += 4
        }
        break
      case 8:
        {
          perform3(arr, (a, b) => a === b ? 1n : 0n, vec[1], vec[2], vec[3])
          i += 4
        }
        break
      case 9:
        {
          base = base + Number(arr[vec[1]])
         // p(`base: ${base} after ${arr[vec[1]]}`)
          i += 2
        }
        break
      case 99:
        halted = true
        flag = true
        break
      default:
        p("error error: " + i + ": " + vec[0])
        flag = true
    }
    if (flag) break
  }
  return output
}

const raw = await read(Deno.args[0])
const arr = raw.split(",")

const part1 = async(arr: string[], input: number) => {
  const output = await intcode(arr.slice(), input)
  p(output)
}

 part1(arr.slice(), 1)
// await part1('109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99'.split(','), 2)
//await part1('1102,34915192,34915192,7,4,7,99,0'.split(','), 2)
