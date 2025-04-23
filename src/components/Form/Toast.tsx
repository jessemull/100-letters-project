import React from 'react';
import { X, OctagonAlert, CircleCheckBig } from 'lucide-react';
import { toast } from 'react-hot-toast';

type ToastType = 'success' | 'error';

const showToast = ({ type, message }: { type: ToastType; message: string }) => {
  toast.custom((t) => (
    <div className="border px-4 py-3 bg-white rounded-md shadow-lg flex items-start gap-3 w-full max-w-sm">
      <div className={`${type === 'success' ? '' : 'pt-[2px]'} flex-shrink-0`}>
        {type === 'success' ? (
          <CircleCheckBig
            data-testid="lucide-icon-success"
            className="w-5 h-5 text-green-600"
          />
        ) : (
          <OctagonAlert
            data-testid="lucide-icon-error"
            className="w-5 h-5 text-red-600"
          />
        )}
      </div>
      <div className="flex-grow text-sm whitespace-pre-wrap break-words leading-snug">
        {message}
      </div>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="flex-shrink-0 hover:text-gray-300 transition"
        aria-label="Close"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  ));
};

export default showToast;
