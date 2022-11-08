import * as React from 'react'
import useCopyToClipboard from '../hooks/copyToClipboard'

type Props = {
  [key: string]: any
}
export default function Examples(_props: Props) {
  const { copy } = useCopyToClipboard({
    contents: 'Some stuff',
    removeAfter: true,
    logger: console,
  })

  return (
    <div>
      <h1>Copy to Clipboard</h1>
      <button type='button' onClick={copy}>
        Copy Stuff to Clipboard
      </button>
    </div>
  )
}
