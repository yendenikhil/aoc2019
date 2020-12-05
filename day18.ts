const raw = await Deno.readTextFile("18.1.in");
const p = console.log;

interface ANode {
  keys: string[];
  visited: string[];
  name: string;
  weight: number;
  hWeight: number;
  totalWeight: number;
}

class PriorityQueue {
  private items: ANode[];
  constructor() {
    this.items = [];
  }
  isEmpty(): boolean {
    return this.items.length <= 0;
  }
  // we need to do two things, once add comes, reshuffle to manage prio
  // prio by the total weight
  // if the element is present then compare the weights and if new node has less weight then replace with new node
  push(node: ANode): void {
    // if the node exists, should we remove it?
    const existing = this.items.find((n) => n.name === node.name);
    if (existing) {
      if (existing.keys.length < node.keys.length) {
        this.items.splice(this.items.indexOf(existing), 1, node);
      } else if (existing.totalWeight > node.totalWeight) {
        this.items.splice(this.items.indexOf(existing), 1, node);
      }
    } else {
      this.items.push(node);
    }
    // rearrange
    // p(`items: ${JSON.stringify(this.items)}`)
    this.items.sort((a, b) => a.totalWeight - b.totalWeight);
    // this.items.filter(e => e.keys.length === 17).forEach(e => p(e))
  }
  front(): ANode | undefined {
    return this.items.shift();
  }
}

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
  // const queue: Point[] = "@abcdefghijklmnopqurstuvwxyz".split("")
  const nodes = "@abcdefghijklmnop".split("");
  const queue: Point[] = nodes
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
      // continue;
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
  p(edges.sort());
  // now we have all edges so time to work on A* algorithm to find shortest path
  // NOT WORKINGfor heuristic measure we can use missing keys * some_number
  // Take2: need something more concrete for hWeight
  //  What if we remove matching keys from matching doors and for remaining doors * some_big_number
  //  and remaining_keys * some_small_number * 1 and the value always non-negative
  const missingKeyWeights = (keys: string[], doors: string[]): number => {
    return doors.map((d) => d.toLowerCase())
      .filter((d) => !keys.includes(d)).length * 26000 + (17 - keys.length)
  };
  const pq: PriorityQueue = new PriorityQueue();
  pq.push({
    name: "@",
    weight: 0,
    keys: ["@"],
    visited: [],
    hWeight: 0,
    totalWeight: 0,
  });
  while (!pq.isEmpty()) {
    const curr = pq.front();
    if (!curr) break;
    // if curr keys have all the keys (nodes.length - 1) then we found the answer, time to exit
    // p();
    p(">>", JSON.stringify(curr));
    if (curr.keys.length === nodes.length) {
      return curr;
    }

    // add to visitedNodes
    const visitedNodes = curr.visited.slice();
    visitedNodes.push(curr.name);

    // find in edges all edges with start name of curr.name and
    // filter out visitedNode with end name
    // now edge.length is weight
    // heuristic weight
    // now to create new ANodes (we will remove duplicate from queue by queue impl so do not worry here)
    // name is toKey, keys are curr.keys + name, weight = curr.weight + edge.len, heuristic distance is calculated by missingKeyWeight
    // add these all to PriorityQueue
    edges.filter((e) =>
      e[0] === curr.name && !visitedNodes.some((v) => v === e[1])
      // e[0] === curr.name // lets allow visited to visit again for Take2
    )
      .map((e) => {
        const keys = curr.keys.slice();
        if (!keys.includes(e[1])) keys.push(e[1]);
        const ee = {
          name: e[1],
          keys,
          visited: visitedNodes,
          weight: curr.weight + e[2],
          hWeight: missingKeyWeights(curr.keys, e[3]),
          totalWeight: missingKeyWeights(curr.keys, e[3]) + curr.weight + e[2],
        } as ANode;
        // p(JSON.stringify(ee));
        return ee;
      }).forEach((an) => pq.push(an));
  }
};

p(await part1(raw));
