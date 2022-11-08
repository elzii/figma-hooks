import * as React from 'react'

export const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms ?? 1000))

export interface createTextareaInputOptions {
  id: string
  value: string
}

export function supportsClipboardAPI(forceUnsupported?: boolean | "DEPRECATED" | string) {
  try {
    if ( forceUnsupported !== undefined ) {
      return false
    } else {
      // Copy contents via `execCommand`
      if ( !!navigator && !!navigator.clipboard ) {
        if ( typeof navigator.clipboard.writeText === 'function' ) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  } catch(ex) {
    return false
  }
}

export const clipboardTextareaCSS = `position: absolute; bottom: 0; left: 0; border:none; opacity: 0; pointer-events: none;`
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
  logger,
  removeAfter,
  domElementId = DEFAULT_DOM_ELEMENT_ID,
}: CopyToClipboardHookProps) {

  const ref = React.useRef<HTMLInputElement>()
  const id = domElementId

  
  const clipboardApiSupported = supportsClipboardAPI('DEPRECATED')

  
  React.useEffect(() => {
    !!logger && logger.info('[copyToClipboard] -> Checking Clipboard API Support', clipboardApiSupported)
  }, [])
  
  React.useEffect(() => {
    if (!ref.current && clipboardApiSupported === false) {
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
  }, [ref, clipboardApiSupported])

  const copy = React.useCallback(() => {
    if ( clipboardApiSupported ) {
      navigator.clipboard.writeText(`${contents}`)
    } else {
      if (ref.current) {
        // Select Contents
        ref.current.select()
        !!logger && logger.info('[copyToClipboard] -> Select HTMLInputElement')

        // Copy contents
        document.execCommand('copy')
        !!logger && logger.info('[copyToClipboard] -> Runnning execCommand("copy")', ref.current.value)

        // // Remove element after we're done
        if (removeAfter) {
          sleep(500).then(() => {
            document.querySelectorAll(`#${id}`).forEach((el) => {
              !!logger && logger.info('[copyToClipboard] -> Removing Element After Copy', el)
              el.remove()
            })
          })
        }
      }
    }
  }, [ref, clipboardApiSupported])

  // Auto update contents if value|setValue changes
  React.useEffect(() => {
    if (ref.current && ref.current.value !== contents) {
      !!logger && logger.info('[copyToClipboard] -> Settings Ref[value] to State[value]', ref.current.value, contents)
      ref.current.value = `${contents}`
    }
  }, [contents, ref.current])

  // Update exisiting DOM element content/value
  const setClipboardContents = React.useCallback(() => {
    if ( ref.current ) {
      ref.current.value = `${contents}`
    }
  },[ref])

  const removeDOMElement = React.useCallback(() => {
    document.querySelectorAll(`#${id}`).forEach((el) => {
      el.remove()
    })
  }, [])

  return {
    copy,
    value: ref.current?.value,
    ref,
    setClipboardContents,
    removeDOMElement,
    clipboardApiSupported
  }
}
