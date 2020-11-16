const p = console.log
const input = `..#..###....#####....###........#
.##.##...#.#.......#......##....#
#..#..##.#..###...##....#......##
..####...#..##...####.#.......#.#
...#.#.....##...#.####.#.###.#..#
#..#..##.#.#.####.#.###.#.##.....
#.##...##.....##.#......#.....##.
.#..##.##.#..#....#...#...#...##.
.#..#.....###.#..##.###.##.......
.##...#..#####.#.#......####.....
..##.#.#.#.###..#...#.#..##.#....
.....#....#....##.####....#......
.#..##.#.........#..#......###..#
#.##....#.#..#.#....#.###...#....
.##...##..#.#.#...###..#.#.#..###
.#..##..##...##...#.#.#...#..#.#.
.#..#..##.##...###.##.#......#...
...#.....###.....#....#..#....#..
.#...###..#......#.##.#...#.####.
....#.##...##.#...#........#.#...
..#.##....#..#.......##.##.....#.
.#.#....###.#.#.#.#.#............
#....####.##....#..###.##.#.#..#.
......##....#.#.#...#...#..#.....
...#.#..####.##.#.........###..##
.......#....#.##.......#.#.###...
...#..#.#.........#...###......#.
.#.##.#.#.#.#........#.#.##..#...
.......#.##.#...........#..#.#...
.####....##..#..##.#.##.##..##...
.#.#..###.#..#...#....#.###.#..#.
............#...#...#.......#.#..
.........###.#.....#..##..#.##...`

const input1 = `.#..#
.....
#####
....#
...##`
interface Astroid {
    x: number
    y: number
}

const buildMap = (input: string) => {
    const astroids: Astroid[] = []
    input.split('\n').forEach((row, y) => {
        row.split('').map((pt, x) => {
            if (pt === '#') {
                astroids.push({ x, y })
            }
        })
    })
    return astroids
}

const countAngles = (arr: Astroid[]) => (input: Astroid) => {
    const angles = new Set()
    arr.filter(a => a !== input).forEach(a => {
        angles.add(Math.atan2(a.y - input.y, a.x - input.x))
    })
    // p(angles)
    return angles.size
}

const buildAngles = (arr: Astroid[], center: Astroid) => {
    return arr.filter(a => a !== center).map(a => {
        const point = {
            pt: a,
            angle: Math.atan2(-1 * (a.x - center.x), (a.y - center.y) * -1),
            mag: Math.pow(a.y - center.y, 2) + Math.pow(a.x - center.x, 2)
        }
        return point
    })
}

const arr = buildMap(input)
const f = countAngles(arr)
const part1 = arr.map(a => {
    const p1 = {
        loc: a,
        count: f(a)
    }
    return p1
}).reduce((acc, v) => acc.count < v.count ? v : acc)
p(part1)

const part2 = buildAngles(arr, part1.loc).sort((a, b) => {
    if (a.angle < b.angle) {
        return -1
    } else if (a.angle > b.angle) {
        return 1
    } else {
        if (a.mag < b.mag) {
            return -1
        } else if (a.mag > b.mag) {
            return 1
        }
    }
    return 0
})
p(part2[199])