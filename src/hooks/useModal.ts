import { useModalStore, ModalType } from '@/store/useModalStore'
import { ReactNode } from 'react'

interface ModalOptions {
  title?: string
  description?: string
  content?: ReactNode
  confirmText?: string
  cancelText?: string
  danger?: boolean
  onConfirm?: () => Promise<void> | void
  onCancel?: () => void
}

export const useModal = () => {
  const { openModal, closeModal } = useModalStore()

  const info = (options: ModalOptions) => {
    openModal({ ...options, type: 'info' })
  }

  const confirm = (options: ModalOptions) => {
    openModal({ ...options, type: 'confirm' })
  }

  const custom = (
    content: ReactNode,
    options?: Omit<ModalOptions, 'content'>
  ) => {
    openModal({ ...options, content, type: 'custom' })
  }

  return { info, confirm, custom, closeModal }
}
