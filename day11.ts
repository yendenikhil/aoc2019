const p = console.log;
const input =
    "3,8,1005,8,326,1106,0,11,0,0,0,104,1,104,0,3,8,102,-1,8,10,101,1,10,10,4,10,1008,8,1,10,4,10,1001,8,0,29,2,1003,17,10,1006,0,22,2,106,5,10,1006,0,87,3,8,102,-1,8,10,101,1,10,10,4,10,1008,8,1,10,4,10,1001,8,0,65,2,7,20,10,2,9,17,10,2,6,16,10,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,0,10,4,10,101,0,8,99,1006,0,69,1006,0,40,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,1,10,4,10,101,0,8,127,1006,0,51,2,102,17,10,3,8,1002,8,-1,10,1001,10,1,10,4,10,108,1,8,10,4,10,1002,8,1,155,1006,0,42,3,8,1002,8,-1,10,101,1,10,10,4,10,108,0,8,10,4,10,101,0,8,180,1,106,4,10,2,1103,0,10,1006,0,14,3,8,102,-1,8,10,1001,10,1,10,4,10,108,0,8,10,4,10,1001,8,0,213,1,1009,0,10,3,8,1002,8,-1,10,1001,10,1,10,4,10,108,0,8,10,4,10,1002,8,1,239,1006,0,5,2,108,5,10,2,1104,7,10,3,8,102,-1,8,10,101,1,10,10,4,10,108,0,8,10,4,10,102,1,8,272,2,1104,12,10,1,1109,10,10,3,8,102,-1,8,10,1001,10,1,10,4,10,108,1,8,10,4,10,102,1,8,302,1006,0,35,101,1,9,9,1007,9,1095,10,1005,10,15,99,109,648,104,0,104,1,21102,937268449940,1,1,21102,1,343,0,1105,1,447,21101,387365315480,0,1,21102,1,354,0,1105,1,447,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,21101,0,29220891795,1,21102,1,401,0,1106,0,447,21101,0,248075283623,1,21102,412,1,0,1105,1,447,3,10,104,0,104,0,3,10,104,0,104,0,21101,0,984353760012,1,21102,1,435,0,1105,1,447,21102,1,718078227200,1,21102,1,446,0,1105,1,447,99,109,2,21202,-1,1,1,21102,40,1,2,21101,0,478,3,21101,468,0,0,1106,0,511,109,-2,2106,0,0,0,1,0,0,1,109,2,3,10,204,-1,1001,473,474,489,4,0,1001,473,1,473,108,4,473,10,1006,10,505,1102,1,0,473,109,-2,2105,1,0,0,109,4,1202,-1,1,510,1207,-3,0,10,1006,10,528,21102,1,0,-3,22102,1,-3,1,22101,0,-2,2,21101,0,1,3,21102,1,547,0,1105,1,552,109,-4,2105,1,0,109,5,1207,-3,1,10,1006,10,575,2207,-4,-2,10,1006,10,575,21202,-4,1,-4,1105,1,643,21202,-4,1,1,21201,-3,-1,2,21202,-2,2,3,21102,1,594,0,1106,0,552,22102,1,1,-4,21101,1,0,-1,2207,-4,-2,10,1006,10,613,21101,0,0,-1,22202,-2,-1,-2,2107,0,-3,10,1006,10,635,22101,0,-1,1,21101,0,635,0,106,0,510,21202,-2,-1,-2,22201,-4,-2,-4,109,-5,2105,1,0";
const indexForMode = (arr: string[], base: number) =>
    (mode: number) =>
        (index: number): number => {
            switch (mode) {
                case 0:
                    return Number(arr[index]) ?? 0;
                case 1:
                    return index;
                case 2:
                    return Number(arr[index] ?? 0) + base;
                default:
                    p(`error in indexForMode mode: ${mode}, index: ${index}`);
                    return -1;
            }
        };
const opSplitter = (input: string): number[] => {
    const raw = "0000" + input;
    const re = /.*(.)(.)(.)(..)/;
    const out = raw.match(re);
    if (out) {
        return out.slice(1).map((e) => Number(e)).reverse();
    } else {
        return [99];
    }
};

const decodeIndex = (arr: string[]) =>
    async (index: number, base: number): Promise<[number, number[]]> => {
        const [op, ...pos] = opSplitter(arr[index]);
        const posFunc = indexForMode(arr, base);
        const indices = pos.map((v, i) => posFunc(v)(index + i + 1));
        // p(`i: ${index} b: ${base} with arr val: ${arr[index]} pos: ${indices}`);
        //    await delay(10);
        return [op, indices];
    };

const getVal = (arr: string[]) =>
    (index: number) => {
        const str = arr[index] ?? "0";
        return BigInt(str);
    };

const setVal = (arr: string[]) =>
    (index: number) =>
        (val: bigint | undefined) => {
            const ans = arr.slice();
            if (val !== undefined) {
                if (index >= ans.length) {
                    for (let i = ans.length; i < index; i++) {
                        ans[i] = "0";
                    }
                }
                // p(`setting ${val.toString()} on index: ${index}`);
                ans[index] = val.toString();
            }
            return ans;
        };

const operate3 = (func: { (a: bigint, b: bigint): bigint }) =>
    (arr: string[]) =>
        (i1: number, i2: number, i3: number) => {
            const s = setVal(arr);
            const g = getVal(arr);
            return s(i3)(func(g(i1), g(i2)));
        };
const indexChanger = (func: { (a: bigint): boolean }) =>
    (i1: number, i2: number) =>
        (arr: string[]) =>
            (index: number) => {
                const av = getVal(arr)(i1);
                const ans = func(av);
                // p(`av: ${av} and ans: ${ans}`);
                if (ans) {
                    return Number(getVal(arr)(i2));
                } else {
                    return index + 3;
                }
            };

interface Step {
    arr: string[];
    input?: number;
    output?: string;
    index: number;
    base: number;
    halt: boolean;
}

const step = async (step: Step) => {
    // p(`arr slice ${step.arr.slice(step.index, step.index + 4)}`);
    const [op, indices] = await decodeIndex(step.arr)(step.index, step.base);
    let arrFunc;
    let indexFun;
    let output = undefined;
    let newBase = step.base;
    let isInputUsed = false;
    let halt = false;
    // deal with arr operations
    switch (op) {
        case 1:
            arrFunc = operate3((a, b) => a + b);
            indexFun = (index: number) => index + 4;
            break;
        case 2:
            arrFunc = operate3((a, b) => a * b);
            indexFun = (index: number) => index + 4;
            break;
        case 3:
            isInputUsed = true;
            arrFunc = (arr: string[]) =>
                (index: number) => setVal(arr)(index)(BigInt(step.input));
            indexFun = (index: number) => index + 2;
            break;
        case 7:
            arrFunc = operate3((a, b) => a < b ? 1n : 0n);
            indexFun = (index: number) => index + 4;
            break;
        case 8:
            arrFunc = operate3((a, b) => a === b ? 1n : 0n);
            indexFun = (index: number) => index + 4;
            break;
        default:
            arrFunc = (arr: string[]) => (index: number) => arr.slice();
    }
    // deal with non array changes like  index change and output and base changes
    switch (op) {
        case 4:
            //p(`arr slice ${step.arr.slice(step.index, step.index + 4)}`);
            output = getVal(step.arr)(indices[0]).toString();
            // p(`output: ${output}`);
            indexFun = (index: number) => index + 2;
            break;
        case 5:
            indexFun = indexChanger((a) => a !== 0n)(indices[0], indices[1])(
                step.arr,
            );
            break;
        case 6:
            indexFun = indexChanger((a) => a === 0n)(indices[0], indices[1])(
                step.arr,
            );
            break;
        case 9:
            newBase = newBase + Number(getVal(step.arr)(indices[0]));
            indexFun = (index: number) => index + 2;
            break;
        case 99:
            halt = true;
            indexFun = (index: number) => index;
            break;
        default:
            if (!indexFun) {
                indexFun = (index: number) => index + 1;
            }
    }
    return {
        arr: arrFunc(step.arr)(indices[0], indices[1], indices[2]),
        index: indexFun(step.index),
        output: output,
        base: newBase,
        input: isInputUsed ? undefined : step.input,
        halt: halt,
    };
};

interface Point {
    x: number;
    y: number;
    color?: number;
    direction?: string;
}
const units: Point[] = [
    { x: 0, y: 1, direction: "N" },
    { x: 1, y: 0, direction: "E" },
    { x: 0, y: -1, direction: "S" },
    { x: -1, y: 0, direction: "W" },
];

const calcNextPoint = (currPoint: Point, turn: number) => {
    const dir = units.findIndex((e) => e.direction === currPoint.direction);
    const unit = turn === 0 ? units[(dir + 3) % 4] : units[(dir + 5) % 4];
    return {
        x: currPoint.x + unit.x,
        y: currPoint.y + unit.y,
        direction: unit.direction,
    };
};

const colorOfPoint = (arr: Point[], pt: Point) => {
    const matches = arr.filter((e) => e.x === pt.x && e.y === pt.y);
    if (matches.length > 0) {
        return matches[matches.length - 1].color ?? 0;
    } else {
        return 0;
    }
};

const moveStep = (arr: Point[], output: number[]) => {
    const ans = arr.slice();
    const currPoint = ans[arr.length - 1];
    currPoint.color = output[0];
    const nextPoint: Point = calcNextPoint(currPoint, output[1]);
    nextPoint.color = colorOfPoint(arr, nextPoint);
    ans.push(nextPoint);
    return ans;
};

const part1 = async (arr: string[]) => {
    const point: Point = { x: 0, y: 0, color: 0, direction: "N" };
    let moves = [point];
    let stepper: Step = {
        arr: arr,
        index: 0,
        input: 0,
        base: 0,
        output: undefined,
        halt: false,
    };
    let out = [];
    while (!stepper.halt) {
        stepper = await step(stepper);
        if (stepper.output !== undefined) out.push(stepper.output);
        if (out.length === 2) {
            moves = moveStep(moves, out.map(Number));
            stepper.input = moves[moves.length - 1].color
            out = [];
        }
    }
    p(`unique steps: ${new Set(moves.map(e => {const pt = {x: e.x, y: e.y}; return JSON.stringify(pt)})).size}`)

};
await part1(input.split(','))