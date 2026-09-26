import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/vue'
import StatusChip from './StatusChip.vue'

describe('StatusChip', () => {
  it('visar Återlämnad för ett återlämnat lån', () => {
    render(StatusChip, { props: { loan: { due: '2026-01-01', returned: true } } })
    expect(screen.getByRole('status')).toHaveTextContent('Återlämnad')
  })

  it('visar Försenad när återlämningsdagen passerat', () => {
    render(StatusChip, { props: { loan: { due: '2020-01-01', returned: false } } })
    expect(screen.getByRole('status')).toHaveTextContent('Försenad')
  })

  it('visar Pågår för ett lån som inte förfallit', () => {
    render(StatusChip, { props: { loan: { due: '2999-12-31', returned: false } } })
    expect(screen.getByText('Pågår')).toBeInTheDocument()
  })
})
