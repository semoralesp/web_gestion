"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  obtenerEmpleado as consultarEmpleado,
  obtenerEmpleados as consultarEmpleados,
  actualizarEmpleado as guardarCambiosEmpleado,
} from "@/datos/empleados";

type Empleado = {
  id: string;
  rut: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  contrasena?: string;
};

function validarRut(rut: string) {
  const rutLimpio = rut
    .replace(/\./g, "")
    .replace(/-/g, "")
    .toUpperCase();

  if (!/^\d{7,8}[0-9K]$/.test(rutLimpio)) {
    return false;
  }

  const cuerpo = rutLimpio.slice(0, -1);
  const digitoIngresado = rutLimpio.slice(-1);

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resultado = 11 - (suma % 11);

  let digitoEsperado = "";

  if (resultado === 11) {
    digitoEsperado = "0";
  } else if (resultado === 10) {
    digitoEsperado = "K";
  } else {
    digitoEsperado = String(resultado);
  }

  return digitoIngresado === digitoEsperado;
}

function normalizarRut(rut: string) {
  return rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
}

export default function EditarEmpleado() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("Cargando empleado...");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    async function cargarEmpleado() {
      try {
        const empleado: Empleado = await consultarEmpleado(id);

        setRut(empleado.rut);
        setNombre(empleado.nombre);
        setApellido(empleado.apellido);
        setTelefono(empleado.telefono);
        setCorreo(empleado.correo);
        setMensaje("");
      } catch {
        setMensaje("No se pudo cargar el empleado.");
      }
    }

    cargarEmpleado();
  }, [id]);

  async function actualizarEmpleado(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMensaje("");

    const rutLimpio = rut.trim();
    const nombreLimpio = nombre.trim();
    const apellidoLimpio = apellido.trim();
    const correoLimpio = correo.trim().toLowerCase();

    if (!validarRut(rutLimpio)) {
      setMensaje("El RUT ingresado no es válido.");
      return;
    }

    if (
      nombreLimpio.length > 25 ||
      !/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ ]+$/.test(nombreLimpio)
    ) {
      setMensaje(
        "El nombre debe contener solo letras y espacios, con un máximo de 25 caracteres."
      );
      return;
    }

    if (
      apellidoLimpio.length > 50 ||
      !/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ ]+$/.test(apellidoLimpio)
    ) {
      setMensaje(
        "El apellido debe contener solo letras y espacios, con un máximo de 50 caracteres."
      );
      return;
    }

    if (!/^9\d{8}$/.test(telefono)) {
      setMensaje("El teléfono debe tener 9 dígitos y comenzar con 9.");
      return;
    }

    if (
      correoLimpio.length > 100 ||
      !/^[^\s@]+@electromechanic\.cl$/.test(correoLimpio)
    ) {
      setMensaje(
        "El correo debe tener un máximo de 100 caracteres y terminar en @electromechanic.cl."
      );
      return;
    }

    setGuardando(true);

    try {
      const empleados: Empleado[] = await consultarEmpleados();

      const rutDuplicado = empleados.some(
        (empleado) =>
          empleado.id !== id &&
          normalizarRut(empleado.rut) === normalizarRut(rutLimpio)
      );

      if (rutDuplicado) {
        setMensaje("Ese RUT ya pertenece a otro empleado.");
        return;
      }

      const empleadoActual: Empleado = await consultarEmpleado(id);

      const empleadoActualizado = {
        rut: rutLimpio,
        nombre: nombreLimpio,
        apellido: apellidoLimpio,
        telefono,
        correo: correoLimpio,
        ...(empleadoActual.contrasena !== undefined && {
          contrasena: empleadoActual.contrasena,
        }),
      };

      await guardarCambiosEmpleado(id, empleadoActualizado);

      router.push("/empleados");
    } catch {
      setMensaje(
        "Ocurrió un error al actualizar. Comprueba que la API esté funcionando."
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <main className="container mt-5">
      <h1 className="text-primary">Editar empleado</h1>

      {mensaje && (
        <div className="alert alert-danger mt-3" role="alert">
          {mensaje}
        </div>
      )}

      <form onSubmit={actualizarEmpleado} className="mt-4">
        <div className="mb-3">
          <label className="form-label">RUT</label>
          <input
            className="form-control"
            value={rut}
            onChange={(event) => setRut(event.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            className="form-control"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            maxLength={25}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Apellido</label>
          <input
            className="form-control"
            value={apellido}
            onChange={(event) => setApellido(event.target.value)}
            maxLength={50}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="tel"
            className="form-control"
            value={telefono}
            onChange={(event) => setTelefono(event.target.value)}
            maxLength={9}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
            maxLength={100}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={guardando}
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>

        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => router.push("/empleados")}
        >
          Cancelar
        </button>
      </form>
    </main>
  );
}