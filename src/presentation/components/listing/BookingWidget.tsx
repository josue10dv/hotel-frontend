import React, { memo } from 'react';

interface BookingWidgetProps {
  pricePerNight: number;
}

export const BookingWidget = memo(function BookingWidget({ pricePerNight }: BookingWidgetProps) {
  return (
    <div className="bg-[#4b5563] text-white p-6 rounded-3xl shadow-xl w-full">
      <div className="flex gap-4 items-end">
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 bg-white/10 rounded-xl px-3 py-2">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-300">Llegada</label>
              <div className="h-4 bg-gray-300/20 rounded w-16 mt-1"></div>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl px-3 py-2">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-300">Salida</label>
              <div className="h-4 bg-gray-300/20 rounded w-16 mt-1"></div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl px-3 py-2 w-full">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-300">Huespedes</label>
            <div className="h-4 bg-gray-300/20 rounded w-24 mt-1"></div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between h-full gap-4 w-[140px]">
          <div className="text-center mt-2">
            <span className="text-xs text-gray-300 block mb-1">Total</span>
            <span className="text-2xl font-bold tracking-tight">${pricePerNight * 5}</span>
          </div>

          <button className="w-full bg-gray-300 text-gray-900 font-bold py-3 rounded-full hover:bg-white transition-colors">
            Reservar
          </button>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 hidden">
        <div className="flex justify-between text-sm text-gray-600">
          <span>${pricePerNight} x 5 noches</span>
          <span>${pricePerNight * 5}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tarifa de limpieza</span>
          <span>$50</span>
        </div>
      </div>
    </div>
  );
});
