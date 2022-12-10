/* experimental non-bruteforce HBD solver */

const optimizeHBDignoringN = ({ stats, iv, ev, n }, optimizeFloor = true) => {
  const [baseH, baseB, baseD] = [
    stats.h + iv.h / 2 + ev.h / 8 + 60,
    stats.b + iv.b / 2 + ev.b / 8 + 5,
    stats.d + iv.d / 2 + ev.d / 8 + 5,
  ];
  const [capH, capB, capD] = [
    (252 - ev.h) / 8,
    (252 - ev.d) / 8,
    (252 - ev.d) / 8,
  ];
  const remainingEv = (508 - ev.h - ev.a - ev.b - ev.c - ev.d - ev.s) / 8;
  if (remainingEv < 1) {
    return { h: 0, b: 0, d: 0 };
  };

  /* H : (B + D) */
  const optimalH = (baseH + baseB + baseD + remainingEv) / 2;
  let [evH, evBD] = [optimalH - baseH, optimalH - baseB - baseD];
  if (evH > capH) {
    evBD += evH - capH;
    evH = capH;
  }
  if (evBD > capB + capD) {
    evH += evBD - capB - capD;
    evBD = capB + capD;
  }
  if (evH < 0) {
    /* H is way higher than BD -> give all EVs to BD */
    evBD += evH;
    evH = 0;
  }
  if (evBD < 0) {
    /* BD is way higher than H -> give all EVs to H */
    evH += evBD;
    evBD = 0;
  }

  /* B : D */
  const optimalB = (baseB + baseD + evBD) / 2;
  let [evB, evD] = [optimalB - baseB, optimalB - baseD];
  if (evB > capB) {
    evD += evB - capB;
    evB = capB;
  }
  if (evD > capD) {
    evB += evD - capD;
    evD = capD;
  }
  if (evB < 0) {
    evD += evB;
    evB = 0;
  }
  if (evD < 0) {
    evB += evD;
    evD = 0;
  }

  // /* workaround the nymphia case http://firefly1987.blog.fc2.com/blog-entry-5.html */
  // if (evH < 0)

  if (!optimizeFloor) {
    return { h: evH * 8, b: evB * 8, d: evD * 8 };
  }

  /* ↓ここも怪しい ツボツボでマイナスになる */

  /* reduce floor loss */
  let floorEvH = Math.floor(baseH + evH) - baseH;
  let floorEvB = Math.floor(baseB + evB) - baseB;
  let floorEvD = Math.floor(baseD + evD) - baseD;
  const loss = remainingEv - floorEvH - floorEvB - floorEvD;
  if (baseH + floorEvH <= baseB + floorEvB + baseD + floorEvD && floorEvH + loss <= capH) {
    floorEvH += loss;
  } else if (baseB + floorEvB <= baseD + floorEvD && floorEvB + loss <= capB) {
    floorEvB += loss;
  } else if (floorEvD + loss <= capD) {
    floorEvD += loss;
  }

  return {
    h: ev.h + floorEvH * 8,
    b: ev.b + floorEvB * 8,
    d: ev.d + floorEvD * 8,
  };
};

/* これむずいな */
const optimizeHBDN = ({ h, b, d }, ev) => {
  const hN = optimizeHBD({ h: h * 1.1, b, d }, ev);
  const bN = optimizeHBD({ h, b: b * 1.1, d }, ev);
  const dN = optimizeHBD({ h, b, d: d * 1.1 }, ev);
  const valueHN = hN.h * hN.b * hN.d / (hN.b + hN.d);
  const valueBN = bN.h * bN.b * bN.d / (bN.b + bN.d);
  const valueDN = dN.h * dN.b * dN.d / (dN.b + dN.d);
  if (valueHN > valueBN) {
    if (valueHN > valueDN) {
      return { ...hN, n: "h" };
    } else {
      return { ...dN, n: "d" };
    }
  } else {
    if (valueBN >= valueDN) {
      return { ...bN, n: "b" };
    } else {
      return { ...dN, n: "d" };
    }
  }
};
