export function getValue(card) {
  if (card === 'K') return 0;
  if (card === 'A') return 1;
  return parseInt(card);
}

export function calcPoint(c1, c2) {
  return (getValue(c1) + getValue(c2)) % 10;
}

export function isPair(c1, c2) {
  return c1 === c2;
}

export function compareHands(p, d) {
  // p = {main:[c1,c2], side:[c3,c4]}
  // d = same

  // 1. pair check
  const pPair = isPair(...p.main);
  const dPair = isPair(...d.main);

  if (pPair && !dPair) return "win";
  if (!pPair && dPair) return "lose";

  // 2. point
  const pPoint = calcPoint(...p.main);
  const dPoint = calcPoint(...d.main);

  if (pPoint > dPoint) return "win";
  if (pPoint < dPoint) return "lose";

  // 3. clash (side)
  const pSide = calcPoint(...p.side);
  const dSide = calcPoint(...d.side);

  if (pSide > dSide) return "win";
  if (pSide < dSide) return "lose";

  return "draw";
}
