const p = console.log;
const input = `<x=5, y=13, z=-3>
<x=18, y=-7, z=13>
<x=16, y=3, z=4>
<x=0, y=8, z=8>`;

interface Coords {
  x: number;
  y: number;
  z: number;
}
interface Moon {
  pos: Coords;
  vel: Coords;
}

const calcVelocity = (moons: Moon[]) =>
  (moon: Moon): Coords => {
    const x = moons.map((m) => moon.pos.x - m.pos.x)
      .map((v) => {
        if (v === 0) return 0;
        else if (v > 0) return -1;
        else return 1;
      }).reduce((acc: number, v: number) => acc + v, moon.vel.x);
    const y = moons.map((m) => moon.pos.y - m.pos.y)
      .map((v) => {
        if (v === 0) return 0;
        else if (v > 0) return -1;
        else return 1;
      }).reduce((acc: number, v: number) => acc + v, moon.vel.y);
    const z = moons.map((m) => moon.pos.z - m.pos.z)
      .map((v) => {
        if (v === 0) return 0;
        else if (v > 0) return -1;
        else return 1;
      }).reduce((acc: number, v: number) => acc + v, moon.vel.z);
    return { x, y, z };
  };

const calcStep = (moon: Moon) =>
  (vel: Coords): Moon => {
    return {
      pos: {
        x: moon.pos.x + vel.x,
        y: moon.pos.y + vel.y,
        z: moon.pos.z + vel.z,
      },
      vel: vel,
    };
  };

const nextStep = (moons: Moon[]): Moon[] => {
  const currentPosition = moons.slice();
  const velCalc = calcVelocity(currentPosition);
  return currentPosition.map((m) => calcStep(m)(velCalc(m)));
};

const energy = (moons: Moon[]): number => {
  const e = (p1: number, p2: number, p3: number) => {
    return Math.abs(p1) + Math.abs(p2) + Math.abs(p3);
  };
  return moons
    .map((m) => e(m.pos.x, m.pos.y, m.pos.z) * e(m.vel.x, m.vel.y, m.vel.z))
    .reduce((a, v) => a + v, 0);
};

const gcd = (a: bigint, b: bigint): bigint => {
  if (a === 0n) return b;
  return gcd(b % a, a);
};

const lcm = (a: bigint, b: bigint): bigint => {
  return a * b / gcd(a, b);
};

const checkRepeat = (moons: Moon[]) => {
  const initial = moons[0];
  let dx = 0;
  let dy = 0;
  let dz = 0;
  if (initial) {
    const { x: px, y: py, z: pz } = initial.pos;
    const { x: vx, y: vy, z: vz } = initial.vel;

    for (let i = 1; i < moons.length; i++) {
      const m = moons[i];
      if (dx === 0) {
        dx = (m.pos.x === px && m.vel.x === vx) ? i : 0;
      }
      if (dy === 0) {
        dy = (m.pos.y === py && m.vel.y === vy) ? i : 0;
      }
      if (dz === 0) {
        dz = (m.pos.z === pz && m.vel.z === vz) ? i : 0;
      }
      if (dx > 0 && dy > 0 && dz > 0) break;
    }
  }
  p(`dx: ${dx}, dy: ${dy}, dz: ${dz}`);
  const ans = lcm(BigInt(dx), lcm(BigInt(dy), BigInt(dz)));
  p(`lcm: ${ans}`);
  return ans;
};

const prepInput = (input: string): Moon[] => {
  return input.split("\n").map((line) => {
    const [x, y, z] = [...line.matchAll(/=(-?[0-9]+)/g)].map((e) =>
      Number(e[1])
    );
    return {
      pos: {
        x,
        y,
        z,
      },
      vel: { x: 0, y: 0, z: 0 },
    };
  });
};

const part1 = (moons: Moon[]) => {
  let m = moons.slice();
  for (let i = 0; i < 1000; i++) {
    m = nextStep(m);
  }
  p(energy(m));
};

const part2 = (moons: Moon[]) => {
  let m = moons.slice();
  const arr = [m];
  console.time("generate");
  for (let i = 0; i < 1000000; i++) {
    m = nextStep(m);
    arr.push(m);
  }
  console.timeEnd("generate");
  console.time("investigate");
  const ans = [];
  for (let i = 0; i < 4; i++) {
    ans.push(checkRepeat(arr.map((mm) => mm[i])));
  }
  p(ans);
  const cycle = ans.reduce((acc, v) => lcm(acc, v), 1n);
  p(cycle);
  console.timeEnd("investigate");
};

const moons = prepInput(input);

part1(moons);
part2(moons);
