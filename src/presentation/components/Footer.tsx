export default function Footer() {
    return (
        <footer className="bg-primary border-t border-white/10 mt-auto">
            <div className="max-w-[1920px] mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            </div>
                            <span className="text-white text-lg font-bold">Nomada</span>
                        </div>
                        <p className="text-white/60 text-sm">
                            Tu plataforma de confianza para encontrar y reservar hoteles excepcionales.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="https://github.com/josue10dv" className="text-white/60 hover:text-secondary transition-colors text-sm">
                                    Github Josue Toapanta
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/alessitott" className="text-white/60 hover:text-secondary transition-colors text-sm">
                                    Github David Cordoba
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contacto</h3>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li>Instagram: @maestro_prompt</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-8 pt-6 text-center">
                    <p className="text-white/60 text-sm">
                        © {new Date().getFullYear()} Nomada. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
