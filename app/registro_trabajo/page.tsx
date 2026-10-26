"use client";

import { useState } from "react";
import { registrarTrabajoDatos } from "@/datos/registro_trabajo";

export default function RegistroTrabajo() {
    const [fecha, setFecha] = useState("");
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [estado, setEstado] = useState("");
    const [mensaje, setMensaje] = useState("");
    const formatearFecha = (valor: string) => {
        const numeros = valor.replace(/\D/g, "").slice(0, 8);
        if (numeros.length > 4) {
            return numeros.slice(0, 2) + "/" +
                   numeros.slice(2, 4) + "/" +
                   numeros.slice(4);
        }
        if (numeros.length > 2) {
            return numeros.slice(0, 2) + "/" +
                   numeros.slice(2);
        }return numeros;
    };
    const registrarTrabajo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!fecha || !nombre.trim() || !descripcion.trim() || !estado.trim()) {
            setMensaje("Debe completar todos los campos");
            return;
        }
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
            setMensaje("Ingrese la fecha completa (DD/MM/AAAA)");
            return;
        }
        const nuevoTrabajo = {
            fecha: fecha,
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            estado: estado.trim()
        };
        try {
            await registrarTrabajoDatos(nuevoTrabajo);
            setMensaje("Trabajo registrado correctamente");
            setFecha("");
            setNombre("");
            setDescripcion("");
            setEstado("");
        } catch (error) {
            setMensaje("Error al registrar el trabajo");
        }
    };return (
        <main className="container mt-5">
            <h1 className="text-primary">Registro de Trabajo</h1>
            <p>Ingrese los datos del trabajo realizado.</p>
            <form onSubmit={registrarTrabajo}>
                <div className="mb-3">
                    <label className="form-label">Fecha</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="DD/MM/AAAA"
                        value={fecha}
                        maxLength={10}
                        onChange={(e) =>
                            setFecha(formatearFecha(e.target.value))}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Nombre del trabajo</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ej: Reparacion de motor"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Descripcion</label>
                        <textarea
                        className="form-control"
                        placeholder="Describa el trabajo realizado"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Estado del trabajo</label>
                        <select
                        className="form-select"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        required
                        >
                        <option value="">Seleccione un estado</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Completado">Completado</option>
                        </select>
                    </div>
                    
                <button type="submit" className="btn btn-success">
                    Registrar trabajo
                </button>
                {mensaje && (
                    <p className="mt-3">{mensaje}</p>
                )}
            </form>
        </main>
    );
}