import { memo } from 'react';
import { hotelService } from '../../infrastructure/services/HotelService';

const DevTools = memo(function DevTools() {
    const currentMode = hotelService.getCurrentMode();

    const toggleMode = () => {
        const newMode = currentMode === 'http' ? 'memory' : 'http';
        hotelService.switchMode(newMode);
        window.location.reload();
    };

    if (import.meta.env.MODE !== 'development') {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
            <button
                onClick={toggleMode}
                className="flex items-center gap-2 hover:bg-gray-700 px-2 py-1 rounded transition-colors"
            >
                <div className={`w-2 h-2 rounded-full ${currentMode === 'http' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                <span className="font-mono">
                    {currentMode === 'http' ? '🌐 Backend HTTP' : '💾 Datos Mock'}
                </span>
            </button>
        </div>
    );
});

export default DevTools;
