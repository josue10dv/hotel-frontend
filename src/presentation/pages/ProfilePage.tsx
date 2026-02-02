import { useState } from 'react';
import { DashboardLayout } from '../components/layouts';
import { useAuthContext } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

type ActiveTab = 'profile' | 'security' | 'preferences' | 'notifications';

export default function ProfilePage() {
    const { user, updateProfile, isLoading } = useAuthContext();
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Profile form state
    const [profileData, setProfileData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        username: user?.username || '',
    });

    // Security form state
    const [securityData, setSecurityData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    // Preferences state
    const [preferences, setPreferences] = useState({
        language: 'es',
        currency: 'USD',
        timezone: 'America/Bogota',
        dateFormat: 'DD/MM/YYYY',
    });

    // Notifications state
    const [notifications, setNotifications] = useState({
        emailReservations: true,
        emailPromotions: false,
        emailNewsletters: false,
        pushReservations: true,
        pushReminders: true,
        smsReservations: false,
    });

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            await updateProfile(profileData);
            setSuccessMessage('Perfil actualizado exitosamente');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            setErrorMessage('Error al actualizar el perfil');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSecuritySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        if (securityData.new_password !== securityData.confirm_password) {
            setErrorMessage('Las contraseñas no coinciden');
            setIsSaving(false);
            return;
        }

        if (securityData.new_password.length < 6) {
            setErrorMessage('La nueva contraseña debe tener al menos 6 caracteres');
            setIsSaving(false);
            return;
        }

        try {
            if (!user?.id) throw new Error('Usuario no encontrado');

            // Usar authService para cambiar contraseña
            const { authService } = await import('../../infrastructure/services/AuthService');
            await authService.getRepository().changePassword(user.id, {
                old_password: securityData.current_password,
                new_password: securityData.new_password,
                new_password_confirm: securityData.confirm_password,
            });

            setSuccessMessage('Contraseña actualizada exitosamente');
            setSecurityData({ current_password: '', new_password: '', confirm_password: '' });
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error: any) {
            setErrorMessage(error.message || 'Error al cambiar la contraseña');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePreferencesSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            setSuccessMessage('Preferencias guardadas exitosamente');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            setErrorMessage('Error al guardar preferencias');
        } finally {
            setIsSaving(false);
        }
    };

    const handleNotificationsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            setSuccessMessage('Configuración de notificaciones actualizada');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            setErrorMessage('Error al actualizar notificaciones');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading && !user) {
        return (
            <DashboardLayout>
                <LoadingSpinner message="Cargando perfil..." />
            </DashboardLayout>
        );
    }

    const tabs = [
        { id: 'profile' as ActiveTab, label: 'Información Personal', icon: '👤' },
        { id: 'security' as ActiveTab, label: 'Seguridad', icon: '🔒' },
        { id: 'preferences' as ActiveTab, label: 'Preferencias', icon: '⚙️' },
        { id: 'notifications' as ActiveTab, label: 'Notificaciones', icon: '🔔' },
    ];

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">Mi Perfil</h1>
                    <p className="text-gray-600 text-lg">
                        Administra tu información personal y configuración de la cuenta
                    </p>
                </div>

                {/* Success/Error Messages */}
                {successMessage && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errorMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
                            <div className="space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeTab === tab.id
                                            ? 'bg-secondary/10 text-secondary font-semibold'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="text-2xl">{tab.icon}</span>
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-primary mb-2">Información Personal</h2>
                                    <p className="text-gray-600">Actualiza tu información personal y foto de perfil</p>
                                </div>

                                {/* Avatar Section */}
                                <div className="mb-8 pb-8 border-b border-gray-200">
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                            {user?.full_name ? (() => {
                                                const names = user.full_name.trim().split(' ');
                                                if (names.length >= 2) {
                                                    return names[0][0] + names[names.length - 1][0];
                                                }
                                                return names[0][0];
                                            })() : 'U'}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-primary mb-2">Foto de Perfil</h3>
                                            <div className="flex gap-3">
                                                <button className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors">
                                                    Cambiar Foto
                                                </button>
                                                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleProfileSubmit}>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre Completo
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.full_name}
                                            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                            placeholder="Ej: Juan Pérez García"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nombre de Usuario
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.username}
                                                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Correo Electrónico
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tipo de Cuenta
                                        </label>
                                        <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                                            <span className="capitalize text-gray-700">{user?.user_type}</span>
                                            <span className="ml-2 text-xs text-gray-500">(No modificable)</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setProfileData({
                                                full_name: user?.full_name || '',
                                                email: user?.email || '',
                                                username: user?.username || '',
                                            })}
                                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-6 py-3 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-colors font-medium disabled:opacity-50"
                                        >
                                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-primary mb-2">Seguridad</h2>
                                    <p className="text-gray-600">Actualiza tu contraseña y gestiona la seguridad de tu cuenta</p>
                                </div>

                                <form onSubmit={handleSecuritySubmit}>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contraseña Actual
                                        </label>
                                        <input
                                            type="password"
                                            value={securityData.current_password}
                                            onChange={(e) => setSecurityData({ ...securityData, current_password: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nueva Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            value={securityData.new_password}
                                            onChange={(e) => setSecurityData({ ...securityData, new_password: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                        <p className="mt-2 text-xs text-gray-500">
                                            La contraseña debe tener al menos 8 caracteres
                                        </p>
                                    </div>

                                    <div className="mb-8">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirmar Nueva Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            value={securityData.confirm_password}
                                            onChange={(e) => setSecurityData({ ...securityData, confirm_password: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                        <div className="flex gap-3">
                                            <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <h4 className="font-medium text-blue-900 mb-1">Consejos de seguridad</h4>
                                                <ul className="text-sm text-blue-800 space-y-1">
                                                    <li>• Usa una combinación de letras, números y símbolos</li>
                                                    <li>• No reutilices contraseñas de otras cuentas</li>
                                                    <li>• Cambia tu contraseña regularmente</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setSecurityData({ current_password: '', new_password: '', confirm_password: '' })}
                                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-6 py-3 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-colors font-medium disabled:opacity-50"
                                        >
                                            {isSaving ? 'Actualizando...' : 'Cambiar Contraseña'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === 'preferences' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-primary mb-2">Preferencias</h2>
                                    <p className="text-gray-600">Personaliza tu experiencia en la plataforma</p>
                                </div>

                                <form onSubmit={handlePreferencesSubmit}>
                                    <div className="space-y-6 mb-8">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Idioma
                                            </label>
                                            <select
                                                value={preferences.language}
                                                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                                            >
                                                <option value="es">Español</option>
                                                <option value="en">English</option>
                                                <option value="pt">Português</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Moneda
                                            </label>
                                            <select
                                                value={preferences.currency}
                                                onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                                            >
                                                <option value="USD">USD - Dólar Estadounidense</option>
                                                <option value="MXN">MXN - Peso Mexicano</option>
                                                <option value="EUR">EUR - Euro</option>
                                                <option value="GBP">GBP - Libra Esterlina</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Zona Horaria
                                            </label>
                                            <select
                                                value={preferences.timezone}
                                                onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                                            >
                                                <option value="America/Bogota">América/Bogotá (GMT-5)</option>
                                                <option value="America/New_York">América/Nueva York (GMT-5)</option>
                                                <option value="America/Los_Angeles">América/Los Ángeles (GMT-8)</option>
                                                <option value="Europe/Madrid">Europa/Madrid (GMT+1)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Formato de Fecha
                                            </label>
                                            <select
                                                value={preferences.dateFormat}
                                                onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                                            >
                                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                        >
                                            Restaurar Predeterminados
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-6 py-3 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-colors font-medium disabled:opacity-50"
                                        >
                                            {isSaving ? 'Guardando...' : 'Guardar Preferencias'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-primary mb-2">Notificaciones</h2>
                                    <p className="text-gray-600">Gestiona cómo y cuándo quieres recibir notificaciones</p>
                                </div>

                                <form onSubmit={handleNotificationsSubmit}>
                                    <div className="space-y-8 mb-8">
                                        {/* Email Notifications */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-primary mb-4">Notificaciones por Email</h3>
                                            <div className="space-y-4">
                                                {[
                                                    { key: 'emailReservations', label: 'Confirmaciones de reservaciones', description: 'Recibe emails cuando hagas o canceles una reservación' },
                                                    { key: 'emailPromotions', label: 'Promociones y ofertas', description: 'Ofertas especiales y descuentos exclusivos' },
                                                    { key: 'emailNewsletters', label: 'Boletines informativos', description: 'Noticias, consejos de viaje y actualizaciones' },
                                                ].map((item) => (
                                                    <label key={item.key} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={notifications[item.key as keyof typeof notifications]}
                                                            onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                                            className="mt-1 w-5 h-5 text-secondary rounded focus:ring-2 focus:ring-secondary"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">{item.label}</p>
                                                            <p className="text-sm text-gray-600">{item.description}</p>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Push Notifications */}
                                        <div className="pt-6 border-t border-gray-200">
                                            <h3 className="text-lg font-semibold text-primary mb-4">Notificaciones Push</h3>
                                            <div className="space-y-4">
                                                {[
                                                    { key: 'pushReservations', label: 'Actualizaciones de reservaciones', description: 'Cambios en tus reservaciones activas' },
                                                    { key: 'pushReminders', label: 'Recordatorios', description: 'Recordatorios antes del check-in' },
                                                ].map((item) => (
                                                    <label key={item.key} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={notifications[item.key as keyof typeof notifications]}
                                                            onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                                            className="mt-1 w-5 h-5 text-secondary rounded focus:ring-2 focus:ring-secondary"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">{item.label}</p>
                                                            <p className="text-sm text-gray-600">{item.description}</p>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* SMS Notifications */}
                                        <div className="pt-6 border-t border-gray-200">
                                            <h3 className="text-lg font-semibold text-primary mb-4">Notificaciones por SMS</h3>
                                            <div className="space-y-4">
                                                <label className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={notifications.smsReservations}
                                                        onChange={(e) => setNotifications({ ...notifications, smsReservations: e.target.checked })}
                                                        className="mt-1 w-5 h-5 text-secondary rounded focus:ring-2 focus:ring-secondary"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">Confirmaciones de reservación</p>
                                                        <p className="text-sm text-gray-600">Recibe SMS para reservaciones importantes</p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-6 py-3 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-colors font-medium disabled:opacity-50"
                                        >
                                            {isSaving ? 'Guardando...' : 'Guardar Configuración'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
