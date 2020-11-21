const input = `2 WZMS, 3 NPNFD => 5 SLRGD
4 QTFCJ, 1 RFZF => 1 QFQPN
2 LCDPV => 6 DGPND
1 MVSHM, 3 XSDR, 1 RSJD => 6 GNKB
6 XJRML, 1 LCDPV => 7 HTSJ
3 LQBX => 3 GKNTG
2 NZMLP, 5 FTNZQ => 2 QSLTQ
8 WZMS, 4 XSDR, 2 NPNFD => 9 CJVT
16 HFHB, 1 TRVQG => 8 QTBQ
177 ORE => 7 DNWGS
10 ZJFM, 4 MVSHM => 8 LCDPV
1 LTVKM => 5 ZJFM
5 QFJS => 6 LTVKM
4 CZHM, 12 CJVT => 9 PGMS
104 ORE => 8 QCGM
1 JWLZ, 5 QTFCJ => 4 DHNL
20 VKRBJ => 3 FQCKM
1 FTNZQ, 1 QSLTQ => 4 HFHB
1 JLPVD => 2 JGJFQ
12 PTDL => 1 LVPK
31 JGJFQ, 5 PGMS, 38 PTDL, 1 PGCZ, 3 LVPK, 47 JGHWZ, 21 LVPJ, 27 LTVKM, 5 ZDQD, 5 LCDPV => 1 FUEL
6 WFJT, 2 VKRBJ => 8 NZMLP
21 HNJW, 3 NXTL, 8 WZMS, 5 SLRGD, 2 VZJHN, 6 QFQPN, 5 DHNL, 19 RNXQ => 2 PGCZ
1 QTBQ, 3 MVSHM => 1 XSDR
25 ZKZNB => 9 VZJHN
4 WHLT => 9 PHFKW
29 QPVNV => 9 JGHWZ
13 ZJFM => 2 RNXQ
1 DGPND, 12 PHFKW => 9 BXGXT
25 ZJFM => 6 WHLT
3 QPVNV => 9 BTLH
1 KXQG => 8 TRVQG
2 JWLZ => 8 JLPVD
2 GKNTG => 6 NXTL
28 VKRBJ => 2 DXWSH
126 ORE => 7 VKRBJ
11 WHLT => 8 QTFCJ
1 NZMLP, 1 DNWGS, 8 VKRBJ => 5 XJRML
16 XJRML => 6 SKHJL
3 QTFCJ, 6 ZTHWQ, 15 GKNTG, 1 NXRZL, 1 DGBRZ, 1 SKHJL, 1 VZJHN => 7 LVPJ
1 HFHB, 16 QTBQ, 7 XJRML => 3 NPNFD
2 TRVQG => 4 JWLZ
8 GKNTG, 1 NSVG, 23 RNXQ => 9 NXRZL
3 QTFCJ => 6 CZHM
2 NPNFD => 8 JQSTD
1 DXWSH, 1 DGPND => 4 DGBRZ
3 DXWSH, 24 QFJS, 8 FTNZQ => 8 KXQG
6 FXJQX, 14 ZKZNB, 3 QTFCJ => 2 ZTHWQ
31 NSVG, 1 NXRZL, 3 QPVNV, 2 RNXQ, 17 NXTL, 6 BTLH, 1 HNJW, 2 HTSJ => 1 ZDQD
5 RNXQ, 23 BXGXT, 5 JQSTD => 7 QPVNV
8 NPNFD => 7 WZMS
6 KXQG => 7 ZDZM
129 ORE => 9 WFJT
9 NZMLP, 5 FQCKM, 8 QFJS => 1 LQBX
170 ORE => 9 GDBNV
5 RSJD, 3 CZHM, 1 GNKB => 6 HNJW
14 HTSJ => 7 FXJQX
11 NPNFD, 1 LCDPV, 2 FXJQX => 6 RSJD
9 DGBRZ => 6 ZKZNB
7 GDBNV, 1 QCGM => 8 QFJS
2 QFQPN, 5 JWLZ => 4 NSVG
8 QFJS, 1 ZDZM, 4 QSLTQ => 7 MVSHM
1 LTVKM => 8 RFZF
4 DNWGS => 3 FTNZQ
6 VZJHN => 9 PTDL`;
const p = console.log;

interface Element {
  name: string;
  amount: number;
}
interface Eq {
  left: Element[];
  right: Element;
}

const processInput = (raw: string) => {
  const eq = [];
  for (const row of raw.split("\n")) {
    const [left, right] = row.split(" => ");
    const leftList = left.split(", ");
    const leftE = leftList.map((e) => {
      const [amt, ee] = e.split(" ");
      return { name: ee, amount: amt };
    });
    const rightE = { amount: right.split(" ")[0], name: right.split(" ")[1] };
    eq.push({ left: leftE, right: rightE });
  }
  return eq
};

const eq = processInput(input);
const part1 = 

