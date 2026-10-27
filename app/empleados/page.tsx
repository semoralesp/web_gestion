"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  obtenerEmpleados as consultarEmpleados,
  eliminarEmpleado as borrarEmpleado,
} from "@/datos/empleados";

type Empleado = {
  id: string;
  rut: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
};

export default function Empleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [mensaje, setMensaje] = useState("Cargando empleados...");

  async function obtenerEmpleados() {
    try {
      const data: Empleado[] = await consultarEmpleados();

      setEmpleados(data);
      setMensaje("");
    } catch {
      setMensaje("No se pudieron cargar los empleados.");
    }
  }

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  async function eliminarEmpleado(id: string) {
    const confirmar = window.confirm(
      "¿Está seguro de eliminar este empleado?"
    );

    if (!confirmar) {
      return;
    }

    try {
      await borrarEmpleado(id);
      await obtenerEmpleados();
    } catch {
      setMensaje("Error al eliminar el empleado.");
    }
  }

  return (
    <main className="container my-4" style={{ maxWidth: "1000px" }}>
      <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="fw-bold mb-1">Empleados</h4>
            <p className="text-muted small mb-0">Gestión y control de los empleados registrados en el sistema</p>
          </div>
          <Link
            href="/empleados/registrar"
            className="btn btn-dark fw-semibold px-4"
          >
            + Registrar empleado
          </Link>
        </div>

        {mensaje && (
          <div className={`alert py-2 small ${mensaje.includes('error') || mensaje.includes('No se') ? 'alert-danger' : 'alert-info'}`} role="alert">
            {mensaje}
          </div>
        )}

        <div className="d-flex align-items-center mb-3">
          <span className="text-muted small">Empleados registrados: <strong className="text-dark">{empleados.length}</strong></span>
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4 p-4 bg-white">
        <h5 className="fw-bold mb-3">Lista de Personal</h5>
        
        {empleados.length === 0 ? (
          <div className="text-center py-5 text-muted">No hay empleados registrados</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>RUT</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {empleados.map((empleado) => (
                  <tr key={empleado.id}>
                    <td>{empleado.rut}</td>
                    <td className="fw-semibold">{empleado.nombre}</td>
                    <td>{empleado.apellido}</td>
                    <td>{empleado.telefono}</td>
                    <td className="text-muted small">{empleado.correo}</td>
                    <td className="text-end">
                      <Link
                        href={`/empleados/editar/${empleado.id}`}
                        className="btn btn-outline-dark btn-sm fw-semibold me-2 px-3"
                      >
                        Editar
                      </Link>

                      <button
                        className="btn btn-outline-danger btn-sm fw-semibold px-3"
                        onClick={() => eliminarEmpleado(empleado.id)}
                      >
                        Eliminar
                      </button>
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