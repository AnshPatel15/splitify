import clsx from "clsx";
import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />

      {/* Modal content */}
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md relative z-50",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          <X size={20} />
        </button>
        {title && (
          <h2 className="text-lg font-semibold mb-4 text-black">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
