import { createContext, useState, useContext } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    // Adiciona uma nova notificação
    const addToast = (message, type = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Remove automaticamente após 3 segundos
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            {/* Container das Notificações (Fixo no canto superior direito) */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 ${
                            toast.type === "success" ? "bg-green-600" : "bg-red-600"
                        }`}
                        style={{ minWidth: "250px", animation: "slideIn 0.3s ease-out forwards" }}
                    >
                        {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <span className="text-sm font-medium flex-1">{toast.message}</span>
                        <button onClick={() => removeToast(toast.id)} className="hover:bg-white/20 rounded p-1">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}