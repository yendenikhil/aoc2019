const raw = await Deno.readTextFile(Deno.args[0] ?? "18.in");
const nodes = "@abcdefghijklmnopqrstuvwxyz".split("");
const p = console.log;

interface Point {
  loc: number[];
  visited: number[][];
  key: string;
  doors: string[];
}

interface Edge {
  weight: number;
  doors: string[];
}

const matchCoords = (a: number[], b: number[]) =>
  a[0] === b[0] && a[1] === b[1];

const getAtLoc = (graph: string[][]) =>
  (loc: number[]) => graph[loc[0]][loc[1]];

const findKeyLoc = (graph: string[][]) =>
  (key: string): [string, number[]] => {
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

const poss = (pt: Point) => {
  const { loc } = pt;
  return [
    [loc[0], loc[1] + 1],
    [loc[0], loc[1] - 1],
    [loc[0] + 1, loc[1]],
    [loc[0] - 1, loc[1]],
  ];
};

const filterBoundries = (graph: string[][]) =>
  (p: number[]) => graph[p[0]][p[1]] !== "#";

const filterVisited = (visited: number[][]) =>
  (p: number[]) => !visited.some((v) => matchCoords(v, p));

const isBlocked = (edge: Edge, rem: string[]) => {
  return edge.doors.every((d) => !rem.includes(d));
};

// we are going to find shortest path with memo table
const cache: Map<string, number> = new Map();
const shortestPath = (
  from: string,
  to: string[],
  edges: Map<string, Edge>,
): number => {
  if (to.length === 0) return -1;
  const key = from + to.sort().join("");
  const cachedVal = cache.get(key);
  if (cachedVal) return cachedVal;
  const paths: number[] = [];
  for (let i = 0; i < to.length; i++) {
    const newFrom = to[i];
    const newTo = to.slice();
    newTo.splice(i, 1);
    const edge = edges.get(from + ":" + newFrom);
    if (!edge) continue;
    if (!isBlocked(edge, newTo)) continue;
    let path = edge.weight ?? -1;
    if (newTo.length > 0) {
      path += shortestPath(newFrom, newTo, edges);
    }
    paths.push(path);
  }
  const min = Math.min(...paths);
  cache.set(key, min);
  return min;
};

const buildGraph = (raw: string) => {
  const lines = raw.split("\n");
  const graph: string[][] = [];
  for (const line of lines) {
    graph.push(line.split(""));
  }
  return graph;
};

const calcEdges = (graph: string[][]) => {
  const findKey = findKeyLoc(graph);
  const bounds = filterBoundries(graph);
  const queue: Point[] = nodes
    .map((k) => findKey(k))
    .map((loc) => {
      return {
        loc: loc[1],
        visited: [],
        key: loc[0],
        doors: [],
      } as Point;
    });

  const edges: Map<string, Edge> = new Map();
  const g = getAtLoc(graph);
  while (queue.length > 0) {
    const curr = queue.shift();
    if (!curr) break;
    if (g(curr.loc).search(/[a-z@]/) > -1 && curr.key !== g(curr.loc)) {
      const key = curr.key + ":" + g(curr.loc);
      if (!edges.has(key)) {
        edges.set(key, {
          weight: curr.visited.length,
          doors: curr.doors,
        });
      }
    }

    const doors = curr.doors.slice();
    if (g(curr.loc).search(/[A-Z]/) > -1) {
      doors.push(g(curr.loc).toLowerCase());
    }
    const visited = curr.visited.slice();
    visited.push(curr.loc);
    const next = poss(curr)
      .filter(bounds)
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
  return edges;
};

const part1 = (raw: string) => {
  const graph = buildGraph(raw);
  return shortestPath("@", nodes.slice(1), calcEdges(graph));
};


console.time("p");
p(part1(raw));
console.timeEnd("p");
