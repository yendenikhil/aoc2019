const raw = (await Deno.readTextFile("18.in")).replaceAll(/[^\x01-\x7f]/g, "")
  .replaceAll("\r\n", "\n");
const p = console.log;

interface Point {
  loc: number[];
  visited: number[][];
  keys: string[];
}
const matchCoords = (a: number[], b: number[]) =>
  a[0] === b[0] && a[1] === b[1];

const part1 = async (raw: string) => {
  const lines = raw.split("\n");
  const graph: string[][] = [];
  for (const line of lines) {
    graph.push(line.split(""));
  }
  // find start
  const start = [];
  for (let r = 0; r < graph.length; r++) {
    const idx = graph[r].findIndex((x) => x === "@");
    if (idx > -1) {
      start.push(r);
      start.push(idx);
      break;
    }
  }
  // find possible movements
  const poss = (pt: Point) => {
    const { loc } = pt;
    return [
      [loc[0], loc[1] + 1],
      [loc[0], loc[1] - 1],
      [loc[0] + 1, loc[1]],
      [loc[0] - 1, loc[1]],
    ];
  };
  const filterBoundries = (p: number[]) => graph[p[0]][p[1]] !== "#";
  const filterVisited = (visited: number[][]) =>
    (p: number[]) => !visited.some((v) => matchCoords(v, p));
  const filterMissingKey = (keys: string[]) =>
    (p: number[]) => {
      const pt = graph[p[0]][p[1]];
      if (pt.search(/[A-Z]/) > -1) {
        return keys.some((k) => k.toUpperCase() === pt);
      }
      return true;
    };

  // BFS
  const queue: Point[] = [{
    loc: start.slice(),
    visited: [],
    keys: [],
  }];

  while (queue.length > 0) {
    const curr = queue.shift();
    if (curr === undefined) break;
    if (curr.keys.length === 26) {
      return curr.visited.length;
    }
    const visited = curr.visited.slice();
    const keys = curr.keys.slice();
    visited.push(curr.loc);
    const str = graph[curr.loc[0]][curr.loc[1]];
    if (str.search(/[a-z]/) > -1) {
      keys.push(str);
    //   p({ str, curr });
      p({ str, l: curr.visited.length});
    }
    const fv = filterVisited(curr.visited);
    const fk = filterMissingKey(curr.keys);
    const next: Point[] = poss(curr)
      .filter(filterBoundries)
      .filter(fv)
      .filter(
        fk,
      ).map((p) => {
        return {
          visited,
          keys,
          loc: p,
        };
      });
    queue.push(...next);
  }
  return -1;
};

p(await part1(raw));
