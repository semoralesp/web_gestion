"use client";

import { useState, useEffect } from "react";
import { registrarGastoAlmuerzo } from "@/datos/gastos_almuerzo";

const URL_GASTOS = "http://localhost:4000/gastos_almuerzo";

export default function GastoAlmuerzo() {
    const [nombre, setNombre] = useState("");
    const [monto, setMonto] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [gastos, setGastos] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);

    const cargarGastos = async () => {
        try {
            const respuesta = await fetch(URL_GASTOS);
            if (!respuesta.ok) throw new Error("Error al obtener gastos");
            const datos = await respuesta.json();
            setGastos(datos);
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarGastos();
    }, []);

    const registrarGasto = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!nombre.trim() || !monto || !descripcion.trim()) {
            setMensaje("Debe completar todos los campos");
            return;
        }
        if (Number(monto) <= 0) {
            setMensaje("El monto debe ser mayor a cero");
            return;
        }

        const ahora = new Date();
        const fechaSistema = ahora.toLocaleDateString("es-CL");

        const nuevoGasto = {
            fecha: fechaSistema,
            nombre: nombre,
            monto: Number(monto),
            descripcion: descripcion,
            empleadoId: "Uwd0eSz7DPo"
        };

        try {
            await registrarGastoAlmuerzo(nuevoGasto);
            setMensaje("Gasto registrado correctamente");
            setNombre("");
            setMonto("");
            setDescripcion("");
            await cargarGastos();
            setTimeout(() => setMensaje(""), 4000);
        } catch (error) {
            setMensaje("Error al guardar el gasto");
        }
    };

    const hoyStr = new Date().toLocaleDateString("es-CL");
    const totalHoy = gastos.filter(g => g.fecha === hoyStr).reduce((sum, g) => sum + Number(g.monto), 0);
    const totalMes = gastos.reduce((sum, g) => sum + Number(g.monto), 0);
    const totalRegistros = gastos.length;
    const promedio = totalRegistros > 0 ? Math.round(totalMes / totalRegistros) : 0;

    return (
        <main className="container my-4" style={{ maxWidth: "1000px" }}>
            <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
                <h4 className="fw-bold mb-1">Gastos de Almuerzo</h4>
                <p className="text-muted small mb-4">Registra tus gastos de almuerzo en pesos chilenos (CLP)</p>

                <form onSubmit={registrarGasto}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Nombre del local</label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            placeholder="Ej: McDonald's"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold small">Descripción</label>
                        <textarea
                            className="form-control bg-light"
                            placeholder="Detalles adicionales del almuerzo"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        />
                    </div>

                    <div className="row g-3 align-items-end mb-3">
                        <div className="col-md-10">
                            <label className="form-label fw-semibold small">Monto gastado (CLP)</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light">$</span>
                                <input
                                    type="number"
                                    className="form-control bg-light"
                                    placeholder="Ej: 5000"
                                    value={monto}
                                    onChange={(e) => setMonto(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <button type="submit" className="btn btn-dark w-100 fw-semibold">
                                + Agregar
                            </button>
                        </div>
                    </div>

                </form>

                {mensaje && (
                    <div className={`alert mt-3 py-2 small ${mensaje.includes('Error') || mensaje.includes('Debe') ? 'alert-danger' : 'alert-success'}`}>
                        {mensaje}
                    </div>
                )}

                <div className="row g-3 mb-4 mt-2">
                    <div className="col-md-3">
                        <div className="p-3 rounded-3 border bg-light bg-opacity-50 h-100">
                            <span className="text-muted small d-block mb-1">Hoy</span>
                            <h4 className="fw-bold text-primary mb-0">${totalHoy.toLocaleString('es-CL')}</h4>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: "#f0fff4", borderColor: "#c6f6d5" }}>
                            <span className="text-muted small d-block mb-1">Esta Semana</span>
                            <h4 className="fw-bold text-success mb-0">${totalHoy.toLocaleString('es-CL')}</h4>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: "#fffaf0", borderColor: "#feebc8" }}>
                            <span className="text-muted small d-block mb-1">Este Mes</span>
                            <h4 className="fw-bold text-warning mb-0">${totalMes.toLocaleString('es-CL')}</h4>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: "#f7fafc", borderColor: "#e2e8f0" }}>
                            <span className="text-muted small d-block mb-1">Promedio</span>
                            <h4 className="fw-bold mb-0" style={{ color: "#8a2be2" }}>${promedio.toLocaleString('es-CL')}</h4>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-4 text-center border" style={{ backgroundColor: "#f8f9fa" }}>
                    <span className="text-muted small d-block mb-1">Total Gastado</span>
                    <h1 className="fw-bold mb-1" style={{ color: "#8a2be2" }}>${totalMes.toLocaleString('es-CL')}</h1>
                    <span className="text-muted small">{totalRegistros} registros</span>
                </div>
            </div>

            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
                <h5 className="fw-bold mb-1">Historial de Gastos</h5>
                <p className="text-muted small mb-3">Registro detallado de tus gastos de almuerzo</p>

                {cargando ? (
                    <div className="text-center py-4 text-muted">Cargando historial...</div>
                ) : gastos.length === 0 ? (
                    <div className="text-center py-5 text-muted">No hay gastos registrados aún</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Fecha</th>
                                    <th>Local</th>
                                    <th>Descripción</th>
                                    <th>Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...gastos].reverse().map((g, index) => (
                                    <tr key={index}>
                                        <td>{g.fecha}</td>
                                        <td className="fw-semibold">{g.nombre}</td>
                                        <td className="text-muted small">{g.descripcion}</td>
                                        <td className="fw-bold text-success">${Number(g.monto).toLocaleString('es-CL')}</td>
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