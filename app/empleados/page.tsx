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
    <main className="container mt-5">
      <h1 className="text-primary">Empleados</h1>

      <Link
        href="/empleados/registrar"
        className="btn btn-success mt-3"
      >
        Registrar empleado
      </Link>

      <p className="mt-3">
        Empleados registrados: {empleados.length}
      </p>

      {mensaje && <p>{mensaje}</p>}

      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>RUT</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {empleados.map((empleado) => (
            <tr key={empleado.id}>
              <td>{empleado.rut}</td>
              <td>{empleado.nombre}</td>
              <td>{empleado.apellido}</td>
              <td>{empleado.telefono}</td>
              <td>{empleado.correo}</td>
              <td>
                <Link
                  href={`/empleados/editar/${empleado.id}`}
                  className="btn btn-primary btn-sm me-2"
                >
                  Editar
                </Link>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarEmpleado(empleado.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}