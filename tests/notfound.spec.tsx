import '@testing-library/jest-dom'
import { h } from 'preact'
import { render } from '@testing-library/preact'
import NotFound from '../src/routes/notfound'

describe('NotFound', () => {
  it('display the text "404"', () => {
    const { queryByText } = render(<NotFound />)
    expect(queryByText('Error 404')).toBeInTheDocument()
  })
})
