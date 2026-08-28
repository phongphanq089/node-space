import { useFlashMessageContext } from '../core/context/flash-message-context'
import type { ShowFlashMessage } from '../core/context/flash-message-context'

export default function useFlashMessage(): ShowFlashMessage {
  return useFlashMessageContext()
}
