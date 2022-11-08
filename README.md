# Figma Hooks
WIP

## useCopyToClipboard

Leverages deprecated `document.execCommand` in the absence of a `Clipboard` API

```jsx
import * as React from 'react'
import { useCopyToClipboard } from 'figma-hooks'

export default function Example() {
  const { copy } = useCopyToClipboard({
    contents: 'Some stuff',
    logger: console,
  })

  return (
    <div>
      <h1>Copy to Clipboard</h1>
      <button type='button' onClick={copy}>
        Copy
      </button>
    </div>
  )
}

```
