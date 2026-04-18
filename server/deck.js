export const deck = [
  'A','A','2','2','3','3','4','4',
  '5','5','6','6','7','7','8','8','K','K'
];

export function shuffle(cards) {
  return [...cards].sort(() => Math.random() - 0.5);
}
