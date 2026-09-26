import { daysBetween } from './date'

export const FEE_PER_DAY = 5
export const FEE_MAX = 100

// Förseningsavgift: 5 kr per dag efter återlämningsdagen, högst 100 kr per lån.
// Återlämningsdagen själv är gratis.
export const lateFee = (due, today) => {
  const daysLate = daysBetween(due, today)
  if (daysLate <= 0) return 0
  return daysLate * FEE_PER_DAY
}

// "12 kr" med svenskt tusentalsavstånd – utan decimaler, avgifter är hela kronor
export const formatAmount = (amount) => `${amount.toLocaleString('sv-SE')} kr`
