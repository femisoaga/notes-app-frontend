import React, { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
};

export const ToastCard: React.FC<{
  toast: ToastItem;
  onClose: (id: string) => void;
}> = ({ toast, onClose }) => {
  const { id, message, type = "info", duration = 3000 } = toast;

  useEffect(() => {
    const t = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(t);
  }, [id, duration, onClose]);

  const bg =
    type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-blue-600";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`max-w-sm w-full ${bg} text-white px-4 py-3 rounded shadow-lg flex items-start gap-3`}
    >
      <div className="flex-1 text-sm">{message}</div>
      <button
        onClick={() => onClose(id)}
        aria-label="Dismiss notification"
        className="text-white opacity-90 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
};

const containerStyles = "fixed top-5 right-5 z-[9999] flex flex-col gap-3 items-end";

export const ToastContainer: React.FC<{
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => {
  return (
    <div className={containerStyles} aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onClose={onRemove} />
      ))}
    </div>
  );
};

export default ToastContainer;
