const bruteOptimizeHBD = ({ stats, iv, ev, n, bonus }, balance = 0.5) => {
  const remainingEv = 508 - ev.h - ev.a - ev.b - ev.c - ev.d - ev.s;
  const remainingN = n.a <= 1 && n.b <= 1 && n.c <= 1 && n.d <= 1 && n.s <= 1;
  const possibleNs = !remainingN ? [n] : [{ ...n, b: 1.1 }, { ...n, d: 1.1 }];

  const evaluate = ({ stats, iv, ev, n }) => {
    const h = Math.floor(Math.floor(stats.h + iv.h / 2 + ev.h / 8) + 60 * bonus.h);
    const b = Math.floor(
      Math.floor((Math.floor(stats.b + iv.b / 2 + ev.b / 8) + 5) * n.b) * bonus.b
    );
    const d = Math.floor(
      Math.floor((Math.floor(stats.d + iv.d / 2 + ev.d / 8) + 5) * n.d) * bonus.d
    );
    return { h, b, d, value: h * b * d / (2 * balance * b + (2 - 2 * balance) * d) };
  };

  let maxValue = evaluate({ stats, iv, ev, n });
  let maxEv = ev;
  let maxN = n;
  const limDh = Math.min(remainingEv, 252 - ev.d);
  for (n of possibleNs) {
    for (let dh = 0; dh <= limDh; dh += 4) {
      const limDb = Math.min(remainingEv - dh, 252 - ev.b);
      for (let db = 0; db <= limDb; db += 4) {
        const dd = remainingEv - dh - db;
        if (dh + db + dd <= remainingEv && ev.d + dd <= 252) {
          const newEv = { h: ev.h + dh, a: ev.a, b: ev.b + db, c: ev.c, d: ev.d + dd, s: ev.s };
          const value = evaluate({ stats, iv, n, ev: newEv });
          if (value.value > maxValue.value ||
              (value.value === maxValue.value && newEv.h > maxEv.h) ||
              (value.value === maxValue.value && newEv.b > maxEv.b)) {
            maxValue = value;
            maxEv = newEv;
            maxN = n;
          }
        }
      }
    }
  }

  return { n: maxN, ev: maxEv, value: maxValue };
};

const robustness = [];
pokemonNames.forEach((name) => {
  const po = pokemons[name];
  const iv = { h: 31, a:31, b: 31, c: 31, d: 31, h: 31 };
  const ev508 = { h: 0, a: 0,   b: 0, c: 0, d: 0, s: 0 };
  const ev256 = { h: 0, a: 252, b: 0, c: 0, d: 0, s: 0 };
  const ev4   = { h: 0, a: 252, b: 0, c: 0, d: 0, s: 252 };
  const n   = { a: 1,   b: 1, c: 1, d: 1, s: 1 };
  const noN = { a: 1.1, b: 1, c: 1, d: 1, s: 1 };
  const noBonus = { h: 1, a: 1,   b: 1, c: 1, d: 1, s: 1 };
  const hbMin  = bruteOptimizeHBD({ stats: po.stats, iv, ev: ev4,   n: noN, bonus: noBonus }, 0);
  const hdMin  = bruteOptimizeHBD({ stats: po.stats, iv, ev: ev4,   n: noN, bonus: noBonus }, 1);
  const hb256  = bruteOptimizeHBD({ stats: po.stats, iv, ev: ev256, n: noN, bonus: noBonus }, 0);
  const hd256  = bruteOptimizeHBD({ stats: po.stats, iv, ev: ev256, n: noN, bonus: noBonus }, 1);
  const hbd256 = bruteOptimizeHBD({ stats: po.stats, iv, ev: ev256, n: noN, bonus: noBonus }, 0.5);
  const hb508  = bruteOptimizeHBD({ stats: po.stats, iv, ev: ev508, n: n  , bonus: noBonus }, 0);
  const hd508  = bruteOptimizeHBD({ stats: po.stats, iv, ev: ev508, n: n  , bonus: noBonus }, 1);
  const hbd508 = bruteOptimizeHBD({ stats: po.stats, iv, ev: ev508, n: n  , bonus: noBonus }, 0.5);
  robustness.push({
    name,
    label: name + " 4振り",
    hb: hbMin.value.h * hbMin.value.b,
    hd: hdMin.value.h * hdMin.value.d,
    types: po.types,
  });
  robustness.push({
    name,
    label: name + " 256振り (最適)",
    hb: hbd256.value.h * hbd256.value.b,
    hd: hbd256.value.h * hbd256.value.d,
    types: po.types,
  });
  robustness.push({
    name,
    label: name + " 256振り (特化)",
    hb: hb256.value.h * hb256.value.b,
    hd: hd256.value.h * hd256.value.d,
    types: po.types,
  });
  robustness.push({
    name,
    label: name + " 508振り＋補正 (最適)",
    hb: hbd508.value.h * hbd508.value.b,
    hd: hbd508.value.h * hbd508.value.d,
    types: po.types,
  });
  robustness.push({
    name,
    label: name + " 508振り＋補正 (特化)",
    hb: hb508.value.h * hb508.value.b,
    hd: hd508.value.h * hd508.value.d,
    types: po.types,
  });
});
