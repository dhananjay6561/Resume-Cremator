export function scoreColor(score: number) {
  if (score <= 40) return { text: 'text-[#B91C1C]', bg: 'bg-[#B91C1C]', hex: '#B91C1C' };
  if (score <= 70) return { text: 'text-[#D97706]', bg: 'bg-[#D97706]', hex: '#D97706' };
  return { text: 'text-[#15803D]', bg: 'bg-[#15803D]', hex: '#15803D' };
}
