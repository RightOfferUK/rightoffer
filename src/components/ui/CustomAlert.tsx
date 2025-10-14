'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface CustomAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: AlertType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    iconColor: 'text-emerald-400',
    bgColor: 'bg-gradient-to-br from-emerald-500/30 to-green-500/20',
    borderColor: 'border-emerald-400/30',
    titleColor: 'text-emerald-300',
    messageColor: 'text-white/90',
    buttonColor: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
  },
  error: {
    icon: XCircle,
    iconColor: 'text-rose-400',
    bgColor: 'bg-gradient-to-br from-rose-500/30 to-red-500/20',
    borderColor: 'border-rose-400/30',
    titleColor: 'text-rose-300',
    messageColor: 'text-white/90',
    buttonColor: 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700'
  },
  warning: {
    icon: AlertCircle,
    iconColor: 'text-amber-400',
    bgColor: 'bg-gradient-to-br from-amber-500/30 to-yellow-500/20',
    borderColor: 'border-amber-400/30',
    titleColor: 'text-amber-300',
    messageColor: 'text-white/90',
    buttonColor: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
  },
  info: {
    icon: Info,
    iconColor: 'text-cyan-400',
    bgColor: 'bg-gradient-to-br from-cyan-500/30 to-blue-500/20',
    borderColor: 'border-cyan-400/30',
    titleColor: 'text-cyan-300',
    messageColor: 'text-white/90',
    buttonColor: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'
  }
};

export default function CustomAlert({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  showCancel = false,
  autoClose = false,
  autoCloseDelay = 3000
}: CustomAlertProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (autoClose && isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-2xl p-8 w-full max-w-md shadow-2xl"
            onClick={handleBackdropClick}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center mb-6 shadow-lg`}>
                <Icon className={`w-8 h-8 ${config.iconColor}`} />
              </div>
              
              <h3 className={`text-2xl font-bold ${config.titleColor} mb-3`}>
                {title}
              </h3>
              <p className={`text-base ${config.messageColor} mb-8 leading-relaxed`}>
                {message}
              </p>
              
              <div className="flex gap-4 w-full">
                {showCancel && (
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 border border-white/30 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-sm font-medium backdrop-blur-sm"
                  >
                    {cancelText}
                  </button>
                )}
                <button
                  onClick={handleConfirm}
                  className={`flex-1 px-6 py-3 text-white rounded-xl transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${config.buttonColor}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Hook for easy usage
export function useCustomAlert() {
  const [alert, setAlert] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: AlertType;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
    autoClose?: boolean;
    autoCloseDelay?: number;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showAlert = (props: Omit<typeof alert, 'isOpen'>) => {
    setAlert({ ...props, isOpen: true });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  const AlertComponent = () => (
    <CustomAlert
      {...alert}
      onClose={hideAlert}
    />
  );

  return {
    showAlert,
    hideAlert,
    AlertComponent
  };
}
