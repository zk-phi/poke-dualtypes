const speeds = [];
pokemonNames.forEach((name) => {
  const po = pokemons[name];
  speeds.push({
    name,
    label: name + " 最遅",
    s: po.stats.s + 5,
  });
  speeds.push({
    name,
    label: name + " 無振り",
    s: Math.floor(po.stats.s + 31 / 2) + 5,
  });
  speeds.push({
    name,
    label: name + " 準速",
    s: Math.floor(po.stats.s + 31 / 2 + 252 / 8) + 5,
  });
  speeds.push({
    name,
    label: name + " 最速",
    s: Math.floor((Math.floor(po.stats.s + 31 / 2 + 252 / 8) + 5) * 1.1),
  });
  speeds.push({
    name,
    label: name + " 準速スカーフ",
    s: Math.floor((Math.floor(po.stats.s + 31 / 2 + 252 / 8) + 5) * 1.5),
  });
  speeds.push({
    name,
    label: name + " 最速スカーフ",
    s: Math.floor(Math.floor((Math.floor(po.stats.s + 31 / 2 + 252 / 8) + 5) * 1.1) * 1.5),
  });
});
