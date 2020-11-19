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

const checkRepeat = (moons: Moon[][]) => {
  const initial = moons[0];
  const xInitial = initial.map((m) => [m.pos.x, m.vel.x]).flat();
  const yInitial = initial.map((m) => [m.pos.y, m.vel.y]).flat();
  const zInitial = initial.map((m) => [m.pos.z, m.vel.z]).flat();
  const xSteps = moons.map((mm) => mm.map((m) => [m.pos.x, m.vel.x]).flat());
  const ySteps = moons.map((mm) => mm.map((m) => [m.pos.y, m.vel.y]).flat());
  const zSteps = moons.map((mm) => mm.map((m) => [m.pos.z, m.vel.z]).flat());
  let dx = 0n;
  let dy = 0n;
  let dz = 0n;
  for (let i = 1; i < moons.length; i++) {
    const xStep = xSteps[i];
    const yStep = ySteps[i];
    const zStep = zSteps[i];
    let fx = true;
    let fy = true;
    let fz = true;
    for (let j = 0; j < 6; j++) {
      if (xStep[j] !== xInitial[j]) {
        fx = false;
      }
      if (yStep[j] !== yInitial[j]) {
        fy = false;
      }
      if (zStep[j] !== zInitial[j]) {
        fz = false;
      }
    }
    if (fx) dx = BigInt(i);
    if (fy) dy = BigInt(i);
    if (fz) dz = BigInt(i);
    if (dx > 0n && dy > 0n && dz > 0n) break;
  }
  p(`x: ${dx} y: ${dy} z: ${dz}`)
  p(lcm(dx, lcm(dy, dz)));
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
  const cycleLength = checkRepeat(arr);
  console.timeEnd("investigate");
};

const moons = prepInput(input);

console.time('part1')
part1(moons);
console.timeEnd('part1')
part2(moons);
