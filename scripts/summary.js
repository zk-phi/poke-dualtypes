/* pokemon search */
Array.from(document.querySelectorAll("dl.pokemon")).map((po) => {
  const [h, a, b, c, d, s] =
    po.querySelector("dd.stats").innerText.split("\u00a0")[0].split("-").map(Number);
  return {
    name: po.querySelector("dt a").innerText,
    types: Array.from(po.querySelectorAll("dd.type img")).map((c) => c.alt),
    h, a, b, c, d, s,
  };
}).map((po) => JSON.stringify(po) + ",\n")join("");

/* move list */
Array.from(document.querySelectorAll("tr.sort_tr")).map((mo) => {
  const [name, type, category, value, ...rest] = Array.from(mo.querySelectorAll("td"));
  return {
    kana: name.dataset.sortValue,
    name: name.querySelector("a").innerText,
    type: type.querySelector("a").innerText,
    category: category.querySelector("a").innerText,
    value: Number(value.innerText),
  };
}).filter((mo) => mo.value && mo.value > 0).map((mo) => JSON.stringify(mo) + ",\n").join("");
