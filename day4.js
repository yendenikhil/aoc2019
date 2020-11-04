const {l, p, readinput} = require('./utils.js')

const min = 168630
const max = 718098
let match1 = 0
let match2 = 0
for (let i = min; i <= max; i++) {
  const arr = String(i).split('')
  let d = false
  let match = true
  for(let j = 0; j < arr.length - 1; j++) {
    if (arr[j] === arr[j+1]) {
      d = true
    }else if (arr[j] > arr[j+1]) {
      match = false
      break;
    }
  }
  if (d && match) match1++
}
p(match1)
// part 2
for (let i = min; i <= max; i++) {
  const arr = String(i).split('')
  let d = false
  let match = true
  for(let j = 0; j < arr.length - 1; j++) {
    if (arr[j] === arr[j+1]) {
      if ((j === arr.length - 2 || arr[j] !== arr[j+2]) && (j === 0 || arr[j - 1] !== arr[j]))
      d = true
    }else if (arr[j] > arr[j+1]) {
      match = false
      break;
    }
  }
  if (d && match) match2++
}
p(match2)
