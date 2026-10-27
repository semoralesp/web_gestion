"use client";

import { useState, useEffect } from "react";
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
        <main className="container mt-5">
            <h1 className="text-primary mb-4">Panel de Administrador</h1>
            
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <label className="form-label fw-bold">Filtrar información por empleado:</label>
                    <select 
                        className="form-select" 
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
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {cargando ? (
                <div className="text-center mt-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm border-0 border-start border-primary border-4">
                            <div className="card-body text-center">
                                <h5 className="card-title text-muted mb-3">Empleados Activos</h5>
                                <p className="card-text display-5 fw-bold text-primary">
                                    {estadisticas.totalUsuarios}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm border-0 border-start border-success border-4">
                            <div className="card-body text-center">
                                <h5 className="card-title text-muted mb-3">Horas Trabajadas</h5>
                                <p className="card-text display-5 fw-bold text-success">
                                    {estadisticas.totalHoras} <span className="fs-5 text-muted">hrs</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm border-0 border-start border-danger border-4">
                            <div className="card-body text-center">
                                <h5 className="card-title text-muted mb-3">Gastos de Almuerzo</h5>
                                <p className="card-text display-5 fw-bold text-danger">
                                    ${estadisticas.totalGastos.toLocaleString('es-CL')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}