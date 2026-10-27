"use client";

import { useState, useEffect } from "react";
import { registrarAsistencia, obtenerAsistencia } from "@/datos/asistencia";

export default function RegistroHorario() {
    const [horaReal, setHoraReal] = useState("Cargando...");
    const [fechaReal, setFechaReal] = useState("");
    const [tipoSiguiente, setTipoSiguiente] = useState<"Entrada" | "Salida">("Entrada");
    const [horaEntradaVista, setHoraEntradaVista] = useState("--:--");
    const [horaSalidaVista, setHoraSalidaVista] = useState("--:--");
    const [lugar, setLugar] = useState("Taller Principal");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);
    const [historial, setHistorial] = useState<any[]>([]);

    useEffect(() => {
        const timer = setInterval(() => {
            const ahora = new Date();
            setHoraReal(ahora.toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            setFechaReal(ahora.toLocaleDateString("es-CL", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const cargarDatos = async () => {
        try {
            const datos = await obtenerAsistencia();
            setHistorial([...datos].reverse());

            const hoy = new Date().toLocaleDateString("es-CL");
            const hoyHistorial = datos.filter((m: any) => m.fecha === hoy);

            if (hoyHistorial.length > 0) {
                const ultimoMarcaje = hoyHistorial[hoyHistorial.length - 1];
                setTipoSiguiente(ultimoMarcaje.tipo === "Entrada" ? "Salida" : "Entrada");

                const entrada = hoyHistorial.find((m: any) => m.tipo === "Entrada");
                const salida = [...hoyHistorial].reverse().find((m: any) => m.tipo === "Salida");

                setHoraEntradaVista(entrada ? entrada.hora : "--:--");
                setHoraSalidaVista(salida ? salida.hora : "--:--");
            } else {
                setTipoSiguiente("Entrada");
                setHoraEntradaVista("--:--");
                setHoraSalidaVista("--:--");
            }
        } catch (error) {
            
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const confirmarMarcaje = async () => {
        setCargando(true);
        const ahora = new Date();
        const nuevoMarcaje = {
            tipo: tipoSiguiente,
            fecha: ahora.toLocaleDateString("es-CL"),
            hora: ahora.toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            lugar: lugar,
            empleadoId: "Uwd0eSz7DPo"
        };

        try {
            await registrarAsistencia(nuevoMarcaje);
            setMensaje(`${tipoSiguiente} registrada exitosamente a las ${nuevoMarcaje.hora}.`);
            await cargarDatos();
            setTimeout(() => setMensaje(""), 4000);
        } catch (error) {
            setMensaje("Error al registrar el marcaje.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <main className="container mt-4" style={{ maxWidth: "800px" }}>
            <h4 className="fw-bold mb-1">
                <i className="bi bi-clock me-2"></i> Registro de Horario
            </h4>
            <p className="text-muted mb-4">Ingresa tu hora de entrada y salida automáticamente.</p>

            <div className="p-4 rounded-4 text-center mb-4 border" style={{ backgroundColor: "#f4f8ff", borderColor: "#e5edff" }}>
                <h1 className="display-3 fw-bold text-primary" style={{ fontFamily: "monospace" }}>
                    {horaReal}
                </h1>
                <p className="text-secondary mb-0 text-capitalize">{fechaReal}</p>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: "#f0fff4", borderColor: "#c6f6d5" }}>
                        <p className="text-muted mb-1 small">Entrada</p>
                        <h5 className="fw-bold text-success mb-0">{horaEntradaVista}</h5>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: "#fff5f5", borderColor: "#fed7d7" }}>
                        <p className="text-muted mb-1 small">Salida</p>
                        <h5 className="fw-bold text-danger mb-0">{horaSalidaVista}</h5>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: "#f4f8ff", borderColor: "#e2e8f0" }}>
                        <p className="text-muted mb-1 small">
                            <i className="bi bi-geo-alt me-1"></i> Lugar
                        </p>
                        <h5 className="fw-bold text-primary mb-0">{lugar}</h5>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-0 rounded-4 p-2 mb-5 border border-success-subtle">
                <div className="card-body">
                    <h5 className={`fw-bold ${tipoSiguiente === 'Entrada' ? 'text-success' : 'text-danger'}`}>
                        Marcar {tipoSiguiente}
                    </h5>
                    <p className="text-muted small mb-4">La hora se registrará automáticamente según el sistema.</p>

                    <div className="mb-4">
                        <label className="form-label fw-semibold small">Lugar de Trabajo</label>
                        <select 
                            className="form-select bg-light" 
                            value={lugar} 
                            onChange={(e) => setLugar(e.target.value)}
                        >
                            <option value="Taller Principal">Taller Principal</option>
                            <option value="Terreno / Visita">Terreno / Visita Cliente</option>
                            <option value="Oficina Central">Oficina Central</option>
                        </select>
                    </div>

                    <div className="text-center p-3 rounded-3 mb-4 border bg-light">
                        <p className="mb-1 text-muted small">Hora a registrar:</p>
                        <h3 className={`fw-bold mb-0 ${tipoSiguiente === 'Entrada' ? 'text-success' : 'text-danger'}`}>
                            {horaReal !== "Cargando..." ? horaReal : "--:--"}
                        </h3>
                    </div>

                    <button 
                        onClick={confirmarMarcaje} 
                        disabled={cargando}
                        className={`btn btn-lg w-100 fw-bold ${tipoSiguiente === 'Entrada' ? 'btn-success' : 'btn-danger'}`}
                    >
                        {cargando ? "Guardando..." : `Confirmar ${tipoSiguiente}`}
                    </button>

                    {mensaje && (
                        <div className={`alert mt-3 ${mensaje.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
                            {mensaje}
                        </div>
                    )}
                </div>
            </div>

            <hr className="my-5" />
            
            <h5 className="fw-bold mb-3 text-secondary">Historial de Marcajes</h5>
            <div className="table-responsive mb-5">
                <table className="table table-hover border bg-white shadow-sm rounded">
                    <thead className="table-light">
                        <tr>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Tipo</th>
                            <th>Lugar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historial.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center text-muted py-4">No hay registros de asistencia.</td>
                            </tr>
                        ) : (
                            historial.map((marcaje, index) => (
                                <tr key={index}>
                                    <td className="align-middle">{marcaje.fecha}</td>
                                    <td className="align-middle fw-semibold">{marcaje.hora}</td>
                                    <td className="align-middle">
                                        <span className={`badge ${marcaje.tipo === 'Entrada' ? 'bg-success' : 'bg-danger'}`}>
                                            {marcaje.tipo}
                                        </span>
                                    </td>
                                    <td className="align-middle">{marcaje.lugar || "-"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}