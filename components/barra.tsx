"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Barra() {
    const pathname = usePathname();
    const esVistaAdmin = pathname.startsWith("/admin") || pathname.startsWith("/empleados");

    const clasesEnlace = (ruta: string) => {
        const activo = pathname === ruta;
        return `px-4 py-2 rounded-pill text-decoration-none text-dark d-flex align-items-center gap-2 transition-all ${
            activo ? "bg-white shadow-sm fw-bold" : "text-muted"
        }`;
    };

    return (
        <header className="w-100 bg-white">
            <div className="container-fluid px-4 border-bottom">
                <div className="d-flex justify-content-between align-items-center py-3 mx-auto" style={{ maxWidth: "1200px" }}>
                    
                    <div className="d-flex align-items-center gap-2">
                        <div className="d-flex flex-column lh-1">
                            <span className="fs-5" style={{ fontWeight: 900, letterSpacing: "-0.5px" }}>ELECTRO</span>
                            <span className="fs-5" style={{ fontWeight: 900, letterSpacing: "-0.5px" }}>MECHANIC</span>
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2 bg-light px-3 py-2 rounded-3 border-0">
                            <span className="fw-semibold text-secondary small">Admin Prueba</span>
                        </div>
                        
                        <button className="btn btn-white border px-3 py-2 d-flex align-items-center gap-2 rounded-3 shadow-sm text-secondary fw-semibold small">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-100 bg-light py-3 border-bottom">
                <div className="container d-flex justify-content-center">
                    <nav className="bg-secondary bg-opacity-10 p-1 rounded-pill d-inline-flex flex-wrap gap-1 align-items-center">
                        
                        <Link href="/asistencia" className={clasesEnlace("/asistencia")}>
                            Control de Horario
                        </Link>
                        
                        <Link href="/gasto_almuerzo" className={clasesEnlace("/gasto_almuerzo")}>
                            Gastos de Almuerzo
                        </Link>
                        
                        <Link href="/registro_trabajo" className={clasesEnlace("/registro_trabajo")}>
                            Órdenes de Trabajo
                        </Link>
                        
                        <Link href="/admin" className={clasesEnlace("/admin")}>
                            Admin Panel
                        </Link>

                        {esVistaAdmin && (
                            <>
                                <Link href="/empleados/registrar" className={clasesEnlace("/empleados/registrar")}>
                                    Registrar Empleado
                                </Link>
                                
                                <Link href="/empleados" className={clasesEnlace("/empleados")}>
                                    Ver Empleados
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}