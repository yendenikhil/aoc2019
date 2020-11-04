const {l, p, readinput} = require('./utils.js')


function gen(start, input) {
  const arr = []
  const dir = input.slice(0, 1)
  const size = Number(input.slice(1))
  let dx = 0
  let dy = 0
  switch(dir) {
    case 'R':
      dx = 1
      break;
    case 'L':
      dx = -1
      break;
    case 'U':
      dy = 1
      break;
    case 'D':
      dy = -1
      break;
  }
  for (let i = 0; i < size; i++) {
    arr.push([start[0] + dx * (i + 1), start[1] + dy * (i + 1), start[2] + (i + 1)])
  }
  return arr
}

function coords(arr) {
  let start = [0, 0, 0]
  return arr.map(e => {
    const res = gen(start, e)   
    start = res.slice(-1)[0]
    return res
  }).flat()
}


readinput(process.argv[2])
  .then(input => {
    console.time("exec")
    const arr1 = input.split('\n')[0].split(',')
    const arr2 = input.split('\n')[1].split(',')
    const wire1 = coords(arr1)
    const wire2 = coords(arr2)
    p('comparing')
    let min = Infinity
    let minDist = Infinity
    wire1.forEach(one => {
      wire2.forEach(two => {
        if (one[0] === two[0] && one[1] === two[1]) {
          let dist = Math.abs(one[0]) + Math.abs(one[1])
          p(`${one}: ${dist}`)
          if (min > dist) min = dist
          if(minDist > one[2] + two[2]) minDist = one[2] + two[2]
        }
      })
    })
    p('done')
    // part 1
    p(min)
    // part 2
    p(minDist)
    console.timeEnd("exec")
  }).catch(e => p(e))


