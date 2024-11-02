import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: string;
}

export function Modal({ isOpen, onClose, children, title, size = "max-w-4xl" }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative z-10 w-full ${size} max-h-[90vh] overflow-auto bg-[#1e1e1e] rounded-lg shadow-xl`}>
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2d2d2d]">
            <h2 className="text-[#d4d4d4] text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#2d2d2d] rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[#d4d4d4]" />
            </button>
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}