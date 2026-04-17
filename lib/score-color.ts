export function scoreColor(score: number) {
  if (score <= 40) return { text: 'text-[#ff3b30]', bg: 'bg-[#ff3b30]', hex: '#ff3b30' };
  if (score <= 70) return { text: 'text-[#f5a623]', bg: 'bg-[#f5a623]', hex: '#f5a623' };
  return { text: 'text-[#22c55e]', bg: 'bg-[#22c55e]', hex: '#22c55e' };
}
