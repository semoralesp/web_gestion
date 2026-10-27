"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { obtenerEmpleados, obtenerEstadisticas } from "@/datos/admin";

export default function VistaAdministrador() {
    const [empleados, setEmpleados] = useState<{ id: string; nombre: string; apellido: string }[]>([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState("");
    
    const [estadisticas, setEstadisticas] = useState({
        totalUsuarios: 0,
        totalHoras: 0,
        totalGastos: 0
    });

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarDatosIniciales = async () => {
            try {
                const listaEmpleados = await obtenerEmpleados();
                setEmpleados(listaEmpleados);
            } catch (err) {
                setError("Error al cargar la lista de empleados.");
            }
        };
        cargarDatosIniciales();
    }, []);

    useEffect(() => {
        const cargarEstadisticas = async () => {
            setCargando(true);
            try {
                const data = await obtenerEstadisticas(empleadoSeleccionado);
                setEstadisticas(data);
                setError("");
            } catch (err) {
                setError("Error al cargar las estadísticas.");
            } finally {
                setCargando(false);
            }
        };
        cargarEstadisticas();
    }, [empleadoSeleccionado]);

    return (
        <main className="container my-4" style={{ maxWidth: "1000px" }}>
            <div className="p-4 rounded-4 text-white mb-4 shadow-sm" style={{ backgroundColor: "#8a2be2" }}>
                <h4 className="fw-bold mb-1">Panel de Administración</h4>
                <p className="mb-0 small text-white-50">Vista completa de todos los usuarios del sistema</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {cargando ? (
                <div className="text-center mt-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0 rounded-4 p-3">
                                <div className="card-body p-0">
                                    <span className="text-muted small d-block mb-1">Usuarios Totales</span>
                                    <h3 className="fw-bold mb-0 text-primary">{estadisticas.totalUsuarios}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0 rounded-4 p-3">
                                <div className="card-body p-0">
                                    <span className="text-muted small d-block mb-1">Horas Totales</span>
                                    <h3 className="fw-bold mb-0 text-success">{estadisticas.totalHoras}.00 h</h3>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0 rounded-4 p-3">
                                <div className="card-body p-0">
                                    <span className="text-muted small d-block mb-1">Gastos Totales</span>
                                    <h3 className="fw-bold mb-0 text-danger">${estadisticas.totalGastos.toLocaleString('es-CL')}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 rounded-4 p-4">
                        <h5 className="fw-bold mb-3">Seleccionar Usuario</h5>
                        <div className="row g-3 align-items-center">
                            <div className="col-md-6">
                                <select 
                                    className="form-select bg-light" 
                                    value={empleadoSeleccionado} 
                                    onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                                >
                                    <option value="">Todos los empleados</option>
                                    {empleados.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.nombre} {emp.apellido}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6 d-flex gap-2 justify-content-md-end">
                                <Link href="/empleados/registrar" className="btn btn-dark btn-sm px-3 fw-semibold">
                                    Registrar Empleado
                                </Link>
                                <Link href="/empleados" className="btn btn-outline-dark btn-sm px-3 fw-semibold">
                                    Ver Empleados
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}