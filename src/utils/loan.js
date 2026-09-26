import { daysBetween } from './date'

// Status för ett lån räknat på "i dag" – skickas in så att den går att testa.
export const loanStatus = (loan, today = new Date()) => {
  if (loan.returned) return 'Återlämnad'
  return daysBetween(loan.due, today) > 0 ? 'Försenad' : 'Pågår'
}
