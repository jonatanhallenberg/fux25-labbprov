import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import MessagesView from './MessagesView.vue'

vi.mock('../services/api', () => ({
  fetchMessages: vi.fn().mockResolvedValue([
    { id: 1, date: '2026-10-01', from: 'Näsby bibliotek', text: 'Boken du reserverade finns att hämta.', html: 'Boken du reserverade finns att hämta.' }
  ])
}))

describe('MessagesView', () => {
  it('visar meddelandets text och avsändare', async () => {
    render(MessagesView)
    expect(await screen.findByText('Boken du reserverade finns att hämta.')).toBeInTheDocument()
    expect(screen.getByText(/Näsby bibliotek/)).toBeInTheDocument()
  })
})
