import * as React from 'react'
import { render } from '@testing-library/react'

import 'jest-canvas-mock'

import Examples from '../src/components/Examples'
// import useCopyToClipboard from '../src/hooks/copyToClipboard'

describe('Common render', () => {
  it('renders without crashing', () => {
    render(<Examples />)
  })
})

// https://blog.logrocket.com/test-react-hooks/
// describe('hooks', () => {
//   it('blah')
// })
