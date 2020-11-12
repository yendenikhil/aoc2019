import { delay } from "https://deno.land/std/async/mod.ts"
import {p, read, permute} from './utils.ts'

const dp = delay(3000)
const re = /.*(.)(.)(.)(..)/

function opdecode(arr: number[], input: number) {
  const raw = '0000' + String(arr[input])
  const out = re.exec(raw)
  if (!out) return [0]
    const [op, ...pos]= out.slice(1).map(e => Number(e)).reverse()
  const ans = []
  ans.push(op)
  if (op !== 99) {
    ans.push(pos[0] === 1 ? input + 1 : arr[input + 1])
  }
  if (op === 5 || op === 6) {
    ans.push(pos[1] === 1 ? input + 2 : arr[input + 2])
  }
  if (op === 1 || op === 2 || op === 7 || op === 8 ){
    ans.push(pos[1] === 1 ? input + 2 : arr[input + 2])
    ans.push(pos[2] === 1 ? input + 3 : arr[input + 3])

  }
  return ans
}

function intcode(arr: number[], phase: number) {
  // p('>>>>' + input)
  let i = 0
  let output = 0
  let halted = false
  let isPhase = true
  return (input: number):[number, boolean] => {
  let flag = false
    while(!halted) {
      const vec = opdecode(arr, i)
      switch(vec[0]) {
        case 1:
          arr[vec[3]] = arr[vec[1]] + arr[vec[2]]
        i += 4
        break
        case 2:
          arr[vec[3]] = arr[vec[1]] * arr[vec[2]]
        i += 4
        break
        case 3:
          if (isPhase) {
          arr[vec[1]] = phase
          isPhase = false
        } else {
          arr[vec[1]] = input
        }
        //      p(arr[vec[1]])
        i += 2
        break
        case 4:
          output = arr[vec[1]]
        //     p(`output: ${output}`)
        i += 2
        flag = true
        break
        case 5:
          if(arr[vec[1]] !== 0) {
          i = arr[vec[2]]
        } else {
          i += 3
        }
        break
        case 6:
          if(arr[vec[1]] === 0) {
          i = arr[vec[2]]
        } else {
          i += 3
        }
        break
        case 7:
          if (arr[vec[1]] < arr[vec[2]]) {
          arr[vec[3]] = 1
        } else {
          arr[vec[3]] = 0
        }
        i += 4
        break
        case 8:
          if (arr[vec[1]] === arr[vec[2]]) {
          arr[vec[3]] = 1
        } else {
          arr[vec[3]] = 0
        }
        i += 4
        break
        case 99:
        //  p('halted')
        halted = true
        flag = true
        break
        default:
          p('error error: ' + i + ': ' + vec[0])
        flag = true
      }
      if (flag) break
    }
  // p(`done: ${String(output)}`)
  return [output, halted]
  }
}

const raw = await read(Deno.args[0])
const arr = raw.split(',').map(Number)
const part1 = (arr: number[]) => {
  const phases = [0, 1, 2, 3, 4]
  const phasesPerm = permute(phases)

  let maxOut = 0
  phasesPerm.slice().forEach(e => {
    let input = 0
    e.forEach(ph => {
      // p(`ph: ${ph} and input: ${input}`)
      input = intcode(arr.slice(), ph)(input)[0]
    })
    if (maxOut < input) maxOut = input
  })
p(String(maxOut))
}

const part2 = (arr: number[]) => {
  const phases = [5, 6, 7, 8, 9]
  const phasesPerm = permute(phases)

  let maxOut = 0
  phasesPerm.slice().forEach(e => {
    let input = 0
    let halted = false
    const comps: {(a: number):[number, boolean]}[] = []
    e.forEach(ph => {
      // p(`ph: ${ph} and input: ${input}`)
      comps.push(intcode(arr.slice(), ph))
    })
    while(!halted) {
      for (let i = 0; i < comps.length; i++) {
        [input, halted] = comps[i](input)
//        p(String(input))
      }
    }
    if (maxOut < input) maxOut = input
  })
p(String(maxOut))
}
part1(arr.slice())
part2(arr.slice())
