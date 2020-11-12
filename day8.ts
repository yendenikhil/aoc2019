import {read, p} from './utils.ts'

const re = /(.{150})/g

const raw = await read(Deno.args[0])
const part1 = (input: string) => {
  let ans = 0
  let minZeroCount = 150
  const layers = [...raw.matchAll(re)]
  layers.forEach(layer => {
    const zeroCount = [...layer[0].matchAll(/0/g)].length 
    if (minZeroCount > zeroCount) {
      minZeroCount = zeroCount 
      ans = [...layer[0].matchAll(/1/g)].length  * [...layer[0].matchAll(/2/g)].length 
    }
  })
  p(ans)
}

const part2 = (input: string) => {
  const layers = [...raw.matchAll(re)]
  let output = layers[0][0].split('')
  layers.map(layer => layer[0]).forEach(layer => {
    layer.split('').forEach((v, i) => {
      if (output[i] == '2') {
        output[i] = v
      }
    })
  })
for (let i = 0; i < 6; i++) {
  const ans = output.slice(i*25, (i + 1) * 25).join('')
  p(ans.replaceAll('1', '#').replaceAll('0', '_'))
}
}

part1(raw)
part2(raw)
