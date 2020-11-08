import {p, read} from './utils.ts'

const raw = await read(Deno.args[0])
const data = raw.split('\n').map(line => line.split(')'))

const route = ['COM']
const weight = new Map()
weight.set('COM', 0)

while(route.length > 0) {
  const pt = route.pop()
  data.filter(e => e[0] === pt).forEach(e => {
    const w =  weight.get(e[0])
    weight.set(e[1], w + 1)
    weight[e[1]] = w + 1
    route.push(e[1])
  })
}

const ans = Array.from(weight.values()).reduce((a, b) => a + b)
p(ans)

// part 2
// get the path from COM to SAN in array
// get the path from COM to YOU in array
// remove common elements
function findPath(arr) {
  let pt = arr.pop()
  while(pt !== 'COM') {
    arr.push(pt)
    data.filter(e => e[1] === pt).forEach(e => {
      pt = e[0]
    })
  }
    return arr
}
const route1 = findPath(['YOU'])
const route2 = findPath(['SAN'])
let sum = -2
for (let i = 0; i < route1.length; i++) {
  if (route2.includes(route1[i])){
    sum += i
    break;
  }

}

for (let i = 0; i < route2.length; i++) {
  if (route1.includes(route2[i])){
    sum += i
    break;
  }
}

p(sum)
