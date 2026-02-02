import { memo } from 'react';

const DevTools = memo(function DevTools() {
    if (import.meta.env.MODE !== 'development') {
        return null;
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
            <div className="flex items-center gap-2 px-2 py-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-mono">
                    🌐 API: {apiUrl}
                </span>
            </div>
        </div>
    );
});

export default DevTools;
