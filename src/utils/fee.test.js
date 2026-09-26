import { describe, it, expect } from 'vitest'
import { lateFee, formatAmount } from './fee'

describe('lateFee', () => {
  it('är 0 kr på återlämningsdagen', () => {
    expect(lateFee('2026-10-15', '2026-10-15')).toBe(0)
  })

  it('är 0 kr före återlämningsdagen', () => {
    expect(lateFee('2026-10-15', '2026-10-01')).toBe(0)
  })

  it('kostar 5 kr per försenad dag', () => {
    expect(lateFee('2026-10-15', '2026-10-18')).toBe(15)
  })

  it('stannar på taket 100 kr', () => {
    expect(lateFee('2026-10-15', '2026-12-01')).toBe(100)
  })
})

describe('formatAmount', () => {
  it('skriver kronor utan decimaler', () => {
    expect(formatAmount(15)).toBe('15 kr')
  })
})
