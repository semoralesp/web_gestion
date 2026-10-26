"use client";


import { useState } from "react";
import { registrarGastoAlmuerzo } from "@/datos/gastos_almuerzo";


export default function GastoAlmuerzo(){
    const [fecha, setFecha] = useState("");
    const [nombre, setNombre] = useState("");
    const [monto, setMonto] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [mensaje, setMensaje] = useState("");
    const formatearFecha = (valor: string) => {
    const numeros = valor.replace(/\D/g, "").slice(0, 8);
    if (numeros.length > 4) {
        return numeros.slice(0, 2) + "/" +
               numeros.slice(2, 4) + "/" +
               numeros.slice(4);
    }
    if (numeros.length > 2) {
        return numeros.slice(0, 2) + "/" + numeros.slice(2);
    }
    return numeros;
};
    const registrarGasto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fecha || !nombre.trim() || !monto || !descripcion.trim()) {
        setMensaje("Debe completar todos los campos");
        return;
    }
    if (Number(monto) <= 0) {
        setMensaje("El monto debe ser mayor a cero");
        return;
    }
    const nuevoGasto = {
        fecha: fecha,
        nombre: nombre,
        monto: Number(monto),
        descripcion: descripcion
    };

    try {await registrarGastoAlmuerzo(nuevoGasto);

        setMensaje("Gasto registrado correctamente");

        setFecha("");
        setNombre("");
        setMonto("");
        setDescripcion("");

    } catch (error) {
        setMensaje("Error al guardar el gasto");
    }
};

    return(
        <main className="container mt-5">
        <h1 className="text-primary">Gasto Almuerzo</h1>
        <p>Ingrese los datos de su almuerzo.</p>
        <form onSubmit={registrarGasto}>
            <div className="mb-3">
                <label className="form-label">Fecha</label>
                <input
                  type="text"
                    className="form-control"
                    placeholder="DD/MM/AAAA"
                    value={fecha}
                    maxLength={10}
                    onChange={(e) => setFecha(formatearFecha(e.target.value))}
                    required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Nombre del plato o local</label>
                <input
                   type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Monto gastado</label>
                <input
                  type="number"
                  className="form-control"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                />
            </div>

            <button
                type="submit" 
                className="btn btn-success">
                Registrar gasto
            </button>
            {mensaje && (
            <p className="mt-3 text-success">
                {mensaje}
            </p>)}
        </form>
    </main>
    );
}