const p = console.log;
const raw =
  `59738571488265718089358904960114455280973585922664604231570733151978336391124265667937788506879073944958411270241510791284757734034790319100185375919394328222644897570527214451044757312242600574353568346245764353769293536616467729923693209336874623429206418395498129094105619169880166958902855461622600841062466017030859476352821921910265996487329020467621714808665711053916709619048510429655689461607438170767108694118419011350540476627272614676919542728299869247813713586665464823624393342098676116916475052995741277706794475619032833146441996338192744444491539626122725710939892200153464936225009531836069741189390642278774113797883240104687033645`;

const phase = [0, 1, 0, -1];

const phaseRepeat = (length: number) =>
  (repeat: number) => {
    const repeater = (pt: number) => {
      const ans = [];
      for (let i = 0; i < repeat; i++) {
        ans.push(pt);
      }
      return ans;
    };
    const fill = (arr: number[]) => {
      const factor = Math.ceil(length / arr.length) + 1;
      const ans = [];
      for (let i = 0; i < factor; i++) {
        ans.push(...arr);
      }
      return ans;
    };

    const one = phase.map(repeater).flat();
    return fill(one).slice(1, length + 1);
  };

const part1 = (arr: number[], cycles: number) => {
  const phaseGenerator = phaseRepeat(arr.length);
  const sum = (a: number, b: number): number => a + b;
  const calc = (el: number): number => {
    return Math.abs(el) % 10;
  };
  let input = arr.slice();
  for (let j = 0; j < cycles; j++) {
    const ans = [];
    for (let i = 1; i <= arr.length; i++) {
      const phase = phaseGenerator(i);
      const res = input.map((e, idx) => e * phase[idx]).reduce(sum, 0);
      ans.push(calc(res));
    }
    input = ans.slice();
  }
  return input.slice(0, 8).join("");
};

const part2 = (arr: number[]) => {
  const repeat = (arr: number[]) => {
    const ans = [];
    for (let i = 0; i < 10000; i++) {
      ans.push(...arr);
    }
    return ans;
  };
  const offset = Number(arr.slice(0, 7).join(""));
  const calc = (el: number): number => {
    return Math.abs(el) % 10;
  };
  let input = repeat(arr).slice(offset).reverse();
  for (let i = 0; i < 100; i++) {
    const ans = [];
    ans.push(input[0]);
    for (let j = 1; j < input.length; j++) {
      ans.push(calc(ans[j - 1] + input[j]));
    }
    input = ans.slice();
  }
  return input.reverse().slice(0, 8).join("");
};

console.time("p");
p(part1(raw.split("").map(Number), 100));
console.timeLog("p");
p(part2(raw.split("").map(Number)));
console.timeEnd("p");
