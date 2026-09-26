import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import DashboardView from './DashboardView.vue'

// Diagrammet ritar på en <canvas> som jsdom inte har – chart.js har egna tester, vi mockar bort det.
vi.mock('chart.js/auto', () => ({
  default: class ChartMock {
    destroy() {}
  }
}))

const renderDashboard = (initialState) =>
  render(DashboardView, {
    global: {
      plugins: [createTestingPinia({ initialState, createSpy: vi.fn })]
    }
  })

describe('DashboardView', () => {
  it('hälsar med förnamnet när användaren är inloggad', () => {
    renderDashboard({ auth: { name: 'Maja Lind' } })
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hej Maja!')
  })

  it('hälsar neutralt innan namnet finns (ingen krasch)', () => {
    renderDashboard({ auth: { name: null } })
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hej!')
  })

  it('räknar pågående och försenade lån', () => {
    renderDashboard({
      loans: {
        loans: [
          { id: 1, due: '2999-01-01', returned: false },
          { id: 2, due: '2020-01-01', returned: false },
          { id: 3, due: '2020-01-01', returned: true }
        ]
      }
    })
    expect(screen.getByText('pågående lån').previousElementSibling).toHaveTextContent('2')
    expect(screen.getByText('försenade').previousElementSibling).toHaveTextContent('1')
  })
})
