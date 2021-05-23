const raw = await Deno.readTextFile(Deno.args[0] ?? "18.in");
const p = console.log;

const rekeys = new RegExp("[a-z]");
const redoors = new RegExp("[A-Z]");

interface Point {
  x: number;
  y: number;
  keys: number;
  distance: number;
}

class PriorityQueue {
  queue: Array<Point>;
  keys: Set<string>;
  constructor(start: Point) {
    this.queue = [start];
    this.keys = new Set();
    this.keys.add(this.makekey(start));
  }
  makekey(pt: Point): string {
    return JSON.stringify([pt.x, pt.y, pt.keys]);
  }
  push(pt: Point): void {
    // dont add if exists
    if (!this.keys.has(this.makekey(pt))) {
      this.queue.push(pt);
      this.keys.add(this.makekey(pt));
    } else {
      const index = this.queue
        .findIndex((p) => p.x === pt.x && p.y === pt.y && p.keys === pt.keys);
      const old = this.queue[index];
      if (old.distance > pt.distance) {
        this.queue.splice(index, 1, pt);
      }
    }
  }
  pop(): Point {
    this.queue.sort((a, b) => a.distance - b.distance);
    const pt = this.queue.shift();
    if (pt) {
      this.keys.delete(this.makekey(pt));
      return pt;
    }
    throw new Error("Empty queue");
  }
  hasmore(): boolean {
    return this.queue.length > 0;
  }
}

const iskeypresent = (keys: number, key: string) => {
  return keys === (keys | Math.pow(2, key.charCodeAt(0) - 97));
};
const keyadd = (keys: number, key: string) => {
  return keys | Math.pow(2, key.charCodeAt(0) - 97);
};

const findstart = (graph: string[][]) => {
  let x = -1;
  let y = -1;
  graph.forEach((line, r) => {
    line.forEach((cell, c) => {
      if (cell === "@") {
        x = r;
        y = c;
      }
    });
  });
  return [x, y];
};

const findalledges = (graph: string[][]) =>
  (from: Point) => {
    // p("==============");
    // p({ from });
    const visited: Set<string> = new Set();
    const ans: Array<Point> = [];
    const makekey = (pt: Point) => JSON.stringify([pt.x, pt.y]);
    const neighbours = (pt: Point) => {
      return [[0, 1], [0, -1], [1, 0], [-1, 0]].map(([dx, dy]) => {
        return {
          x: pt.x + dx,
          y: pt.y + dy,
          keys: pt.keys,
          distance: pt.distance + 1,
        } as Point;
      });
    };
    const obj = (pt: Point) => graph[pt.x][pt.y];
    const notblocked = (pt: Point) => obj(pt) !== "#";
    const queue = [from];
    while (queue.length > 0) {
      const curr = queue.shift();
      // p({curr, queue})
      if (curr === undefined) break;
      if (visited.has(makekey(curr))) continue;
      visited.add(makekey(curr));
      const val = obj(curr);
      // if door and has key, then go ahead, else break this link
      if (redoors.test(val)) {
        if (!iskeypresent(curr.keys, val.toLowerCase())) continue;
      }
      // if key and not present in keys then add edge else go further
      if (rekeys.test(val)) {
        if (!iskeypresent(curr.keys, val)) {
          const key: Point = {
            x: curr.x,
            y: curr.y,
            keys: keyadd(curr.keys, val),
            distance: curr.distance,
          };
          ans.push(key);
          continue;
        }
      }
      // else get eligible (non #) neighbours and add to queue
      queue.push(...neighbours(curr).filter((nn) => notblocked(nn)));
    }
    return ans;
  };

const part1 = (raw: string) => {
  // raw.split("\n").forEach((line) => p(line));
  const graph = raw.split("\n").map((line) => line.split(""));
  const allkeys = raw.split("").filter((c) => rekeys.test(c)).sort();
  // check wether entry exists with same keys, same coords
  const visited: Set<string> = new Set();
  const makekey = (pt: Point) => JSON.stringify([pt.x, pt.y, pt.keys]);
  const allkeynum = Math.pow(2, allkeys.length) - 1;
  // p({allkeys, allkeynum, bits: allkeynum.toString(2)})
  const findE = findalledges(graph);
  const start = findstart(graph);
  const q = new PriorityQueue({
    x: start[0],
    y: start[1],
    keys: 0,
    distance: 0,
  });

  while (q.hasmore()) {
    const curr = q.pop();
    visited.add(makekey(curr));
    if (curr.keys === allkeynum) {
      p(">>>>>==============");
      p({ curr });
      break;
    }
    const edges = findE(curr);
    edges.filter((e) => !visited.has(makekey(e)))
      .forEach((e) => q.push(e));
    // p({ curr, edges });
  }
};
part1(raw);
