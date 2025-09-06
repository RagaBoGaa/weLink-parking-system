import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

interface ModalHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
}: ModalProps) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
    >
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity'
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative w-full bg-white rounded-2xl shadow-2xl transition-all duration-300 transform',
          sizeClasses[size],
          className
        )}
      >
        <ModalHeader onClose={onClose}>{title}</ModalHeader>

        <div className='px-6 pb-6'>{children}</div>
      </div>
    </div>
  );
};

const ModalHeader = ({ children, onClose, className }: ModalHeaderProps) => (
  <div
    className={cn(
      'flex items-center justify-between p-6 pb-4 border-b border-gray-100',
      className
    )}
  >
    <h2
      id='modal-title'
      className='text-xl font-semibold text-gray-900 leading-none'
    >
      {children}
    </h2>
    {onClose && (
      <Button
        onClick={onClose}
        variant='ghost'
        size='icon'
        className='h-8 w-8 rounded-full hover:bg-gray-100'
      >
        <X className='h-4 w-4' />
        <span className='sr-only'>Close</span>
      </Button>
    )}
  </div>
);

const ModalBody = ({ children, className }: ModalBodyProps) => (
  <div className={cn('py-4', className)}>{children}</div>
);

const ModalFooter = ({ children, className }: ModalFooterProps) => (
  <div
    className={cn(
      'flex items-center justify-end gap-3 pt-6 border-t border-gray-100',
      className
    )}
  >
    {children}
  </div>
);

// Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmationModalProps) => {
  const buttonVariants = {
    danger: 'destructive',
    warning: 'default',
    info: 'default',
  } as const;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size='sm'>
      <ModalBody>
        <p className='text-gray-600 leading-relaxed'>{message}</p>
      </ModalBody>

      <ModalFooter>
        <Button onClick={onClose} variant='outline' disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant={buttonVariants[variant]}
          disabled={isLoading}
          className={
            variant === 'warning' ? 'bg-orange-600 hover:bg-orange-700' : ''
          }
        >
          {isLoading ? 'Processing...' : confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { Modal, ModalHeader, ModalBody, ModalFooter, ConfirmationModal };
