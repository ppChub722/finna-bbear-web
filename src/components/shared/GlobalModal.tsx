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
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

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
    authView,
  } = useModalStore()

  const [isLoading, setIsLoading] = useState(false)

  if (authView) return null

  const handleConfirm = async () => {
    if (onConfirm) {
      setIsLoading(true)
      try {
        // Support both async and sync callbacks
        const result = onConfirm()

        // Check if it's a Promise (async function)
        if (result instanceof Promise) {
          await result
        }

        closeModal()
      } catch (error) {
        console.error('Modal confirm error:', error)
        // Don't close modal on error, let user retry or cancel
      } finally {
        setIsLoading(false)
      }
    } else {
      // No callback, just close
      closeModal()
    }
  }

  const handleCancel = () => {
    if (!isLoading) {
      if (onCancel) {
        try {
          onCancel()
        } catch (error) {
          console.error('Modal cancel error:', error)
        }
      }
      closeModal()
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      handleCancel()
    }
  }

  if (type === 'custom') {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            {title ? (
              <DialogTitle>{title}</DialogTitle>
            ) : (
              <VisuallyHidden>
                <DialogTitle>Modal</DialogTitle>
              </VisuallyHidden>
            )}
          </DialogHeader>
          {content}
        </DialogContent>
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
              onClick={handleCancel}
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
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Loading...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
