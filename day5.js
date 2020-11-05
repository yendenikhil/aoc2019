const {l, p, readinput} = require('./utils.js')

const re = /.*(.)(.)(.)(..)/

function opdecode(arr, input) {
  const raw = '0000' + String(arr[input])
  const [op, ...pos]= re.exec(raw).slice(1).map(e => Number(e)).reverse()
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

function intcode(arr, input) {
  let i = 0
  let output = 0
  let flag = false
  while(arr[i] !== 99) {
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
        arr[vec[1]] = input
        i += 2
        break
      case 4:
        output = arr[vec[1]]
        p(`output: ${output}`)
        i += 2
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
        p('halted')
        flag = true
        break
      default:
        p('error error: ' + i + ': ' + vec[0])
        flag = true
    }
    if (flag) break

  }
  p(`done: ${output}`)
}

readinput(process.argv[2])
  .then(input => input.split(',').map(Number))
  .then(arr => {
    // part 1
    intcode([...arr], 1)
    //part 2
    intcode([...arr], 5)
  })
  .catch(e => p(e))
