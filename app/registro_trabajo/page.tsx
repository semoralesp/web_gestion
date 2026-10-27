"use client";

import { useState, useEffect } from "react";

const URL_TRABAJOS = "http://localhost:4000/trabajos";

export default function RegistroTrabajo() {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [estado, setEstado] = useState("Pendiente");
    const [mensaje, setMensaje] = useState("");
    const [trabajos, setTrabajos] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);

    const cargarTrabajos = async () => {
        try {
            const respuesta = await fetch(URL_TRABAJOS);
            if (!respuesta.ok) throw new Error("Error al obtener trabajos");
            const datos = await respuesta.json();
            setTrabajos(datos);
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarTrabajos();
    }, []);

    const registrarOrden = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!nombre.trim() || !descripcion.trim() || !estado) {
            setMensaje("Debe completar todos los campos");
            return;
        }

        const ahora = new Date();
        const nuevaOrden = {
            nombre: nombre,
            descripcion: descripcion,
            estado: estado,
            fecha: ahora.toLocaleDateString("es-CL"),
            empleadoId: "Uwd0eSz7DPo"
        };

        try {
            const respuesta = await fetch(URL_TRABAJOS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaOrden)
            });

            if (!respuesta.ok) throw new Error("No se pudo registrar la orden");

            setMensaje("Orden de trabajo registrada correctamente");
            setNombre("");
            setDescripcion("");
            setEstado("Pendiente");
            await cargarTrabajos();
            setTimeout(() => setMensaje(""), 4000);
        } catch (error) {
            setMensaje("Error al registrar la orden");
        }
    };

    return (
        <main className="container my-4" style={{ maxWidth: "1000px" }}>
            <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
                <h4 className="fw-bold mb-1">Orden de Trabajo</h4>
                <p className="text-muted small mb-4">Registra el trabajo realizado durante el día</p>

                <form onSubmit={registrarOrden}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Nombre del Trabajo</label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            placeholder="Ej: Reparación de sistema eléctrico"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Estado del Trabajo</label>
                        <select
                            className="form-select bg-light"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            required
                        >
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Proceso">En Proceso</option>
                            <option value="Completado">Completado</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold small">Descripción del Trabajo Realizado</label>
                        <textarea
                            className="form-control bg-light"
                            rows={3}
                            placeholder="Describe detalladamente el trabajo realizado..."
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-dark w-100 fw-semibold py-2">
                        + Registrar Orden de Trabajo
                    </button>
                </form>

                {mensaje && (
                    <div className={`alert mt-3 py-2 small ${mensaje.includes('Error') || mensaje.includes('Debe') ? 'alert-danger' : 'alert-success'}`}>
                        {mensaje}
                    </div>
                )}
            </div>

            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                <h5 className="fw-bold mb-1">Mis Órdenes de Trabajo</h5>
                <p className="text-muted small mb-3">Historial de trabajos realizados</p>

                {cargando ? (
                    <div className="text-center py-4 text-muted">Cargando órdenes...</div>
                ) : trabajos.length === 0 ? (
                    <div className="text-center py-5 text-muted">No hay órdenes de trabajo registradas</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Fecha</th>
                                    <th>Nombre del Trabajo</th>
                                    <th>Descripción</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...trabajos].reverse().map((t, index) => (
                                    <tr key={index}>
                                        <td>{t.fecha}</td>
                                        <td className="fw-semibold">{t.nombre}</td>
                                        <td className="text-muted small">{t.descripcion}</td>
                                        <td>
                                            <span className={`badge ${t.estado === 'Completado' ? 'bg-success' : t.estado === 'En Proceso' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                                {t.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}