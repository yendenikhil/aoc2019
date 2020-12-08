import { delay } from "https://deno.land/std/async/mod.ts";
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
  from: string;
  to: string;
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

const keysToNumber = (keys: string[]): number => {
  return parseInt(nodes.map((e) => keys.includes(e) ? "1" : "0").join(""), 2);
};
const numberToKey = (num: number) => {
  return num.toString(2).padStart(nodes.length).split("")
    .map((e, i) => {
      if (e === "1") return nodes[i];
      else return undefined;
    }).filter((e) => e !== undefined);
};
const getWeightFromEdges = (edges: Edge[]) =>
  (from: string, to: string) => {
    const edge = edges.find((e) => e.from === from && e.to === to);
    if (edge) {
      return edge.weight;
    }
    p(`edge not found for ${from}: ${to}`);
    return -1;
  };
const canIGo = (edges: Edge[]) =>
  (from: string, to: string, rem: string[]) => {
    const edge = edges.find((e) => e.from === from && e.to === to);
    if (edge) {
      return edge.doors.every((d) => !rem.includes(d));
    }

    p(`edge not found for ${from}: ${to}`);
    return false;
  };

// we are going to find shortest path with memo table
const memo: [string, number, number][] = [];
let counterWithout = 0;
let counterWithMemo = 0;
const shortestPath = async (
  from: string,
  to: string[],
  edges: Edge[],
): Promise<number> => {
  if (counterWithout % 5000 === 0) p({ counterWithout, counterWithMemo });
  // await delay(1000);
  // corner case
  if (to.length === 0) return -1;
  counterWithout++;
  // check if we have cached val if so return
  const cachedVal = memo.find((e) =>
    e[0] === from && e[1] === keysToNumber(to)
  );
  if (cachedVal) return cachedVal[2];
  counterWithMemo++;
  // p({ from, to });
  const getE = getWeightFromEdges(edges);
  const blocked = canIGo(edges);
  // we have not reached to the point where we can take the vals from edges
  const paths: number[] = [];
  for (let i = 0; i < to.length; i++) {
    const newFrom = to[i];
    const newTo = to.slice();
    newTo.splice(i, 1);
    // p({ from, newFrom, newTo });
    if (!blocked(from, newFrom, newTo)) continue;

    // p({ newFrom, newTo });
    let path = getE(from, newFrom);
    if (newTo.length > 0) {
      path += await shortestPath(newFrom, newTo, edges);
    }
    // p({ from, newFrom, newTo, path });
    paths.push(path);
  }
  const min = Math.min(...paths);
  memo.push([from, keysToNumber(to), min]);
  return min;
};

const part1 = async (raw: string) => {
  const lines = raw.split("\n");
  const graph: string[][] = [];
  for (const line of lines) {
    graph.push(line.split(""));
  }
  // BFS to find all point to all point edges
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

  const edges: Edge[] = [];
  const g = getAtLoc(graph);
  while (queue.length > 0) {
    const curr = queue.shift();
    if (!curr) break;
    if (g(curr.loc).search(/[a-z@]/) > -1 && curr.key !== g(curr.loc)) {
      if (!edges.some((e) => e.from === curr.key && e.to === g(curr.loc))) {
        edges.push({
          from: curr.key,
          to: g(curr.loc),
          weight: curr.visited.length,
          doors: curr.doors,
        });
      }
      // continue;
    }

    // is curr a door, add and proceed
    const doors = curr.doors.slice();
    if (g(curr.loc).search(/[A-Z]/) > -1) {
      doors.push(g(curr.loc).toLowerCase());
    }
    // add curr to visited
    const visited = curr.visited.slice();
    visited.push(curr.loc);

    // check all next possibilities which are not walls and not visited
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
  p(edges.sort());
  // alright we have all the edges, time to brute force with memo table, we will need
  // recurrsive function for this.
  return await shortestPath("@", nodes.slice(1), edges);
};

p(await part1(raw));
// memo.sort().forEach((e) => {
//   const [from, to, weight] = e;
//   p([from, numberToKey(to), weight]);
// });
