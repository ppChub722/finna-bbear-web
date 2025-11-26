'use client'

import { useModalStore } from '@/store/useModalStore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function GlobalModal() {
  const {
    isOpen,
    type,
    title,
    description,
    content,
    confirmText,
    cancelText,
    danger,
    onConfirm,
    onCancel,
    closeModal,
  } = useModalStore()

  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    if (onConfirm) {
      setIsLoading(true)
      try {
        await onConfirm()
        closeModal()
      } catch (error) {
        console.error('Modal confirm error:', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      closeModal()
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (onCancel) onCancel()
      closeModal()
    }
  }

  if (type === 'custom') {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>{content}</DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {content && <div className="py-4">{content}</div>}
        <DialogFooter>
          {type === 'confirm' && (
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
          )}
          <Button
            variant={danger ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
