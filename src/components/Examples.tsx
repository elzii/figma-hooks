import * as React from 'react'
import useCopyToClipboard from '../hooks/copyToClipboard'

type Props = {
  [key: string]: any
}
const INITIAL_STRING = 'wat'
export default function Examples(_props: Props) {
  const [state, setState] = React.useState<string>(INITIAL_STRING)
  const { copy, ref: _ref, value } = useCopyToClipboard({
    contents: state,
    removeAfter: true,
    logger: console,
  })

  return (
    <div>
      <h1>Copy to Clipboard</h1>
      <div>
        <p>To be copied: <input type="text" onChange={(event) => setState(event.target.value)} defaultValue={INITIAL_STRING} /></p>
        <p>Ref value: <code>{value}</code></p>
      </div>
      <div>
        <button type='button' onClick={copy}>
          Copy
        </button>
      </div>
      <br />
    </div>
  )
}
