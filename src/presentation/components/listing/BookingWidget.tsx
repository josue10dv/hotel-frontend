import React, { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { reservationService } from '../../../infrastructure/services/ReservationService';
import { CreateReservationData } from '../../../domain/entities/Reservation';

interface BookingWidgetProps {
    hotelId: string;
    roomId: string;
    pricePerNight: number;
}

export const BookingWidget = memo(function BookingWidget({ hotelId, roomId, pricePerNight }: BookingWidgetProps) {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);
    const [nights, setNights] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Guest details
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [showGuestForm, setShowGuestForm] = useState(false);

    // Calcular número de noches
    useEffect(() => {
        if (checkIn && checkOut) {
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            const diffTime = end.getTime() - start.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setNights(diffDays > 0 ? diffDays : 0);
        } else {
            setNights(0);
        }
    }, [checkIn, checkOut]);

    // Fecha mínima (hoy)
    const today = new Date().toISOString().split('T')[0];

    // Fecha mínima para checkout (día después del checkin)
    const minCheckOut = checkIn
        ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]
        : today;

    const totalPrice = pricePerNight * nights;
    const cleaningFee = 50;
    const grandTotal = totalPrice + cleaningFee;

    const handleReservation = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!checkIn || !checkOut) {
            setError('Por favor selecciona las fechas de llegada y salida');
            return;
        }
        if (nights <= 0) {
            setError('La fecha de salida debe ser posterior a la fecha de llegada');
            return;
        }

        // Mostrar formulario de datos del huésped
        if (!showGuestForm) {
            setShowGuestForm(true);
            return;
        }

        // Validar datos del huésped
        if (!guestName || !guestEmail || !guestPhone) {
            setError('Por favor completa todos los datos del huésped');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            // Convertir fechas a formato ISO 8601
            const checkInISO = new Date(checkIn).toISOString();
            const checkOutISO = new Date(checkOut).toISOString();

            const reservationData: CreateReservationData = {
                hotel_id: hotelId,
                room_id: roomId,
                check_in: checkInISO,
                check_out: checkOutISO,
                number_of_guests: guests,
                guest_details: {
                    name: guestName,
                    email: guestEmail,
                    phone: guestPhone,
                    special_requests: specialRequests || undefined
                },
                special_requests: specialRequests || undefined
            };

            const reservation = await reservationService.getRepository().createReservation(reservationData);
            
            // Redirigir a la página de mis reservaciones
            navigate('/my-reservations');
        } catch (error: any) {
            setError(error.message || 'Error al crear la reservación');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full border border-gray-200">
            <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-primary">${pricePerNight}</span>
                    <span className="text-gray-600">/ noche</span>
                </div>
            </div>

            <div className="space-y-4">
                {/* Fechas */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            Llegada
                        </label>
                        <input
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            min={today}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            Salida
                        </label>
                        <input
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            min={minCheckOut}
                            disabled={!checkIn}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Huéspedes */}
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Huéspedes
                    </label>
                    <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800 text-sm"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <option key={num} value={num}>
                                {num} {num === 1 ? 'huésped' : 'huéspedes'}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Formulario de datos del huésped */}
                {showGuestForm && (
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 text-sm">Datos del Huésped</h4>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Nombre completo *
                            </label>
                            <input
                                type="text"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                placeholder="Juan Pérez"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                placeholder="juan@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Teléfono *
                            </label>
                            <input
                                type="tel"
                                value={guestPhone}
                                onChange={(e) => setGuestPhone(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                placeholder="+593987654321"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Solicitudes especiales
                            </label>
                            <textarea
                                value={specialRequests}
                                onChange={(e) => setSpecialRequests(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm resize-none"
                                placeholder="Cama extra, llegada tardía..."
                            />
                        </div>
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Botón de reserva */}
                <button
                    onClick={handleReservation}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!checkIn || !checkOut || nights <= 0 || isSubmitting}
                >
                    {isSubmitting ? 'Procesando...' : showGuestForm ? 'Confirmar Reservación' : 'Continuar'}
                </button>

                {/* Desglose de precios */}
                {nights > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                        <div className="flex justify-between text-sm text-gray-700">
                            <span>${pricePerNight} x {nights} {nights === 1 ? 'noche' : 'noches'}</span>
                            <span className="font-semibold">${totalPrice}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-700">
                            <span>Tarifa de limpieza</span>
                            <span className="font-semibold">${cleaningFee}</span>
                        </div>
                        <div className="pt-3 border-t border-gray-200 flex justify-between text-lg font-bold text-primary">
                            <span>Total</span>
                            <span>${grandTotal}</span>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
                No se te cobrará en este momento
            </p>
        </div>
    );
});
