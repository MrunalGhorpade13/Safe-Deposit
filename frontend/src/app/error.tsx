"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global application error caught by boundary:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-rose-200 p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-rose-100 p-3 rounded-full">
                        <AlertTriangle className="h-10 w-10 text-rose-500" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong!</h2>
                <p className="text-slate-500 mb-8">
                    We encountered an unexpected error while communicating with the Stellar network. Please try again.
                </p>
                <div className="space-y-4">
                    <button
                        onClick={() => reset()}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-md transition-colors"
                    >
                        Try again
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium py-3 px-4 rounded-md transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        </div>
    );
}
