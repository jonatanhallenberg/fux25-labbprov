import { describe, it, expect } from 'vitest'
import { loanStatus } from './loan'

describe('loanStatus', () => {
  it('är Återlämnad när lånet är återlämnat', () => {
    expect(loanStatus({ due: '2020-01-01', returned: true }, '2026-10-15')).toBe('Återlämnad')
  })

  it('är Försenad dagen efter återlämningsdagen', () => {
    expect(loanStatus({ due: '2026-10-14', returned: false }, '2026-10-15')).toBe('Försenad')
  })

  it('är Pågår på återlämningsdagen', () => {
    expect(loanStatus({ due: '2026-10-15', returned: false }, '2026-10-15')).toBe('Pågår')
  })
})
