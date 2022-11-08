import * as React from 'react'

export interface createTextareaInputOptions {
  id: string
  value: string
}

export const clipboardTextareaCSS = `visibility: hidden; position: absolute; bottom: 0; left: 0; z-index: -100;, pointer-events: none;`
export const DEFAULT_DOM_ELEMENT_ID = `figma-react-clipboard-textarea`

export function createInvisibleTextArea({ value, id }: createTextareaInputOptions): HTMLInputElement {
  const textarea = document.createElement('input')
  textarea.type = 'textarea'
  textarea.setAttribute('style', clipboardTextareaCSS)
  textarea.id = id ?? DEFAULT_DOM_ELEMENT_ID
  textarea.value = `${value}`

  document.body.appendChild(textarea)
  return document.getElementById('figma-react-clipboard-textarea') as HTMLInputElement
  // return textarea
}

export type ClipboardInputContents = string | number | Buffer | Uint8Array

export interface CopyToClipboardHookProps {
  contents: ClipboardInputContents
  domElementId?: string
  removeAfter?: boolean
  logger?: Console | any
}

export default function useCopyToClipboard({
  contents,
  removeAfter = true,
  logger = console,
  domElementId = DEFAULT_DOM_ELEMENT_ID,
}: CopyToClipboardHookProps) {
  const [value, setValue] = React.useState<string>('')
  const ref = React.useRef<HTMLInputElement>()

  const id = domElementId

  React.useEffect(() => {
    if (!ref.current) {
      try {
        // Create Invisible DIV
        const el = createInvisibleTextArea({
          value: `${contents}`,
          id,
        }) as HTMLInputElement

        !!logger && logger.info('[copyToClipboard] -> Create HTMLInputElement', el)

        // Set ref to the newly created element
        ref.current = el
        !!logger && logger.info('[copyToClipboard] -> Set Ref', ref)
      } catch (ex) {
        // messenger.send('notify', ex.toString())
        !!logger && logger.error(ex)
      }
    }
  }, [ref])

  const copy = React.useCallback(() => {
    if (ref.current) {
      // Select Contents
      ref.current.select()
      !!logger && logger.info('[copyToClipboard] -> Select HTMLInputElement')

      // Copy contents via `execCommand`
      document.execCommand('copy')

      if (removeAfter) {
        document.querySelectorAll(`#${id}`).forEach((el) => {
          el.remove()
        })
        !!logger && logger.info('[copyToClipboard] -> Removing Element After Copy', document.querySelectorAll(`#${id}`))
      }
    }
  }, [ref])

  // Auto update contents
  React.useEffect(() => {
    if (removeAfter === false) {
      if (ref.current && ref.current.value !== value) {
        ref.current.value = value
      }
    }
  }, [value, ref.current])

  // Update exisiting DOM element content/value
  const setClipboardContents = React.useCallback(
    (newValue: any) => {
      if (removeAfter === false) {
        setValue(newValue)
      }
    },
    [setValue],
  )

  const removeDOMElement = React.useCallback(() => {
    document.querySelectorAll(`#${id}`).forEach((el) => {
      el.remove()
    })
  }, [])

  return {
    copy,
    value,
    ref,
    setClipboardContents,
    removeDOMElement,
  }
}
