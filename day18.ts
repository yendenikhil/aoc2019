const raw = await Deno.readTextFile("18.in");
const p = console.log;

interface Point {
  loc: number[];
  visited: number[][];
  key: string;
  doors: string[];
}
const matchCoords = (a: number[], b: number[]) =>
  a[0] === b[0] && a[1] === b[1];
const getAtLoc = (graph: string[][]) =>
  (loc: number[]) => graph[loc[0]][loc[1]];

const part1 = async (raw: string) => {
  const lines = raw.split("\n");
  const graph: string[][] = [];
  for (const line of lines) {
    graph.push(line.split(""));
  }
  // find key locations @, a-z
  const findKeyLoc = (key: string): [string, number[]] => {
    const loc = [];
    for (let r = 0; r < graph.length; r++) {
      const idx = graph[r].findIndex((x) => x === key);
      if (idx > -1) {
        loc.push(r);
        loc.push(idx);
        break;
      }
    }
    return [key, loc];
  };
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
  // prepare queue with each key loaction
  const queue: Point[] = "@abcdefghijklmnopqurstuvwxyz".split("")
    .map((k) => findKeyLoc(k))
    .map((loc) => {
      return {
        loc: loc[1],
        visited: [],
        key: loc[0],
        doors: [],
      } as Point;
    });

  // now we want to build the graph of all key to key edges and the list of doors so we can yse
  // the door thingie later
  const edges: [string, string, number, string[]][] = [];
  const g = getAtLoc(graph);
  while (queue.length > 0) {
    const curr = queue.shift();
    // p({curr})
    if (!curr) break;
    // is curr a key, add on edge and terminate
    if (g(curr.loc).search(/[a-z@]/) > -1 && curr.key !== g(curr.loc)) {
      if (!edges.some((e) => e[0] === curr.key && e[1] === g(curr.loc))) {
        // the edge is not found for the key - key combination then only add it.
        // Due to nature of BFS we will always find the shortest path for edge first
        // hence no need to check whether the current edge is smaller or not.
        edges.push([curr.key, g(curr.loc), curr.visited.length, curr.doors]);
      }
      // we need not go further as key is found
      continue;
    }

    // is curr a door, add and proceed
    const doors = curr.doors.slice();
    if (g(curr.loc).search(/[A-Z]/) > -1) {
      doors.push(g(curr.loc));
    }
    // add curr to visited
    const visited = curr.visited.slice();
    visited.push(curr.loc);

    // check all next possibilities which are not walls and not visited
    const next = poss(curr)
      .filter(filterBoundries)
      .filter(filterVisited(visited))
      .map((loc) => {
        return {
          loc,
          key: curr.key,
          visited,
          doors,
        } as Point;
      });
    queue.push(...next);
  }
  p(edges);
  return -1;
};

p(await part1(raw));
