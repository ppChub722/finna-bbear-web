import { create } from 'zustand'
import { ReactNode } from 'react'

export type ModalType = 'info' | 'confirm' | 'custom'

export interface ModalState {
  isOpen: boolean
  type: ModalType
  title?: string
  description?: string
  content?: ReactNode
  confirmText?: string
  cancelText?: string
  danger?: boolean
  onConfirm?: () => Promise<void> | void
  onCancel?: () => void
}

interface ModalStore extends ModalState {
  openModal: (state: Omit<ModalState, 'isOpen'>) => void
  closeModal: () => void
}

const initialState: ModalState = {
  isOpen: false,
  type: 'info',
  title: '',
  description: '',
  content: null,
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  danger: false,
}

export const useModalStore = create<ModalStore>((set) => ({
  ...initialState,
  openModal: (state) => set({ ...state, isOpen: true }),
  closeModal: () => set({ ...initialState }),
}))
