'use client';

import React from 'react';
import { Description, Dialog, DialogTitle } from '@headlessui/react';
import { Button } from '@components/Form';

interface ConfirmationModalProps {
  cancelText?: string;
  confirmText?: string;
  isOpen: boolean;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
}

const ConfirmationModal = ({
  cancelText = 'Cancel',
  confirmText = 'Delete',
  isOpen,
  message = 'This action cannot be undone.',
  onClose,
  onConfirm,
  title = 'Are you sure?',
}: ConfirmationModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-8"
    >
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          aria-hidden="true"
        />
      )}
      <div className="relative bg-white rounded-xl p-8 max-w-md w-full shadow-xl z-10 space-y-4">
        <DialogTitle className="font-merriweather text-xl font-semibold text-gray-900">
          {title}
        </DialogTitle>
        <Description className="font-merriweather text-gray-600">
          {message}
        </Description>
        <div className="font-merriweather flex justify-end space-x-8">
          <Button
            id="confirmation-modal-cancel"
            onClick={onClose}
            value={cancelText}
            variant="light"
          />
          <Button
            id="confirmation-modal-confirm"
            onClick={onConfirm}
            value={confirmText}
            variant="outline"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmationModal;
