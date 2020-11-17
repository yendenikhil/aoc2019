const p = console.log;
const input = `<x=5, y=13, z=-3>
<x=18, y=-7, z=13>
<x=16, y=3, z=4>
<x=0, y=8, z=8>`;

interface Velocity {
  dx: number;
  dy: number;
  dz: number;
}
interface Position {
  x: number;
  y: number;
  z: number;
}
interface Moon {
  pos: Position;
  vel: Velocity;
}

const calcVelocity = (moons: Moon[]) =>
  (moon: Moon) => {
    const dx = moons.map((m) => moon.pos.x - m.pos.x)
      .map((v) => {
        if (v === 0) return 0;
        else if (v > 0) return -1;
        else return 1;
      }).reduce((acc: number, v: number) => acc + v, moon.vel.dx);
    const dy = moons.map((m) => moon.pos.y - m.pos.y)
      .map((v) => {
        if (v === 0) return 0;
        else if (v > 0) return -1;
        else return 1;
      }).reduce((acc: number, v: number) => acc + v, moon.vel.dy);
    const dz = moons.map((m) => moon.pos.z - m.pos.z)
      .map((v) => {
        if (v === 0) return 0;
        else if (v > 0) return -1;
        else return 1;
      }).reduce((acc: number, v: number) => acc + v, moon.vel.dz);
      return {dx, dy, dz}
  };

const calcPosition = (moon: Moon, vel: Velocity) => {
    return {
        x: moon.pos.x + vel.dx,
        y: moon.pos.x + vel.dx,
        z: moon.pos.z + vel.dz,
    }
};

const nextStep = (moons: Moon[]) =>
  (moon: Moon) => {
  };
