/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX, ReactNode } from 'react'

import { createPortal } from 'react-dom'

export interface FlashMessageProps {
  children: ReactNode
}

export default function FlashMessage({
  children,
}: FlashMessageProps): JSX.Element {
  return createPortal(
    <div
      className="pointer-none fixed inset-0 top-0 right-0 bottom-0 left-0 flex items-center justify-center"
      role="dialog"
    >
      <p
        className="bg-[rgba(0, 0, 0, 0.8)] rounded-[1rem] p-[20px] text-[1.5rem] text-white"
        role="alert"
      >
        {children}
      </p>
    </div>,
    document.body
  )
}
