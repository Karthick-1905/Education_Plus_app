"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "loading";

interface Toast {
    id: string;
    title?: string;
    description?: string;
    type?: ToastType;
    duration?: number;
}

interface ToastContextType {
    toast: (props: Omit<Toast, "id">) => string;
    dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const dismiss = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = React.useCallback((props: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { ...props, id }]);

        if (props.type !== "loading" && props.duration !== 0) {
            setTimeout(() => {
                dismiss(id);
            }, props.duration || 5000);
        }

        return id;
    }, [dismiss]);

    return (
        <ToastContext.Provider value={{ toast, dismiss }}>
            {children}
            <div className="fixed bottom-0 right-0 z-[100] flex flex-col gap-2 p-4 md:max-w-[420px] w-full pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            layout
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="pointer-events-auto"
                        >
                            <div className={cn(
                                "relative overflow-hidden rounded-2xl border p-4 shadow-2xl backdrop-blur-xl flex items-start gap-4 ring-1",
                                t.type === "success" ? "bg-emerald-50/90 border-emerald-100 ring-emerald-200 text-emerald-900" :
                                    t.type === "error" ? "bg-rose-50/90 border-rose-100 ring-rose-200 text-rose-900" :
                                        t.type === "loading" ? "bg-indigo-50/90 border-indigo-100 ring-indigo-200 text-indigo-900" :
                                            "bg-white/90 border-slate-100 ring-slate-200 text-slate-900"
                            )}>
                                <div className="flex-shrink-0 mt-0.5">
                                    {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                                    {t.type === "error" && <AlertCircle className="w-5 h-5 text-rose-600" />}
                                    {t.type === "loading" && <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />}
                                    {(!t.type || t.type === "info") && <Info className="w-5 h-5 text-blue-600" />}
                                </div>

                                <div className="flex-1 space-y-1">
                                    {t.title && <p className="text-sm font-bold tracking-tight">{t.title}</p>}
                                    {t.description && <p className="text-xs font-medium opacity-80 leading-relaxed">{t.description}</p>}
                                </div>

                                <button
                                    onClick={() => dismiss(t.id)}
                                    className="flex-shrink-0 p-1 opacity-40 hover:opacity-100 transition-opacity"
                                >
                                    <X size={14} />
                                </button>

                                {t.type !== "loading" && (
                                    <motion.div
                                        initial={{ scaleX: 1 }}
                                        animate={{ scaleX: 0 }}
                                        transition={{ duration: (t.duration || 5000) / 1000, ease: "linear" }}
                                        className={cn(
                                            "absolute bottom-0 left-0 h-0.5 w-full origin-left",
                                            t.type === "success" ? "bg-emerald-500/30" :
                                                t.type === "error" ? "bg-rose-500/30" :
                                                    "bg-indigo-500/30"
                                        )}
                                    />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
