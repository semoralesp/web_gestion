"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  obtenerEmpleados as consultarEmpleados,
  registrarEmpleado as guardarEmpleado,
} from "@/datos/empleados";

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

function generarContrasena(rut: string, nombre: string) {
  return normalizarRut(rut) + nombre.trim().charAt(0).toUpperCase();
}

export default function RegistrarEmpleado() {
  const router = useRouter();

  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function registrarEmpleado(
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
      const empleadosExistentes = await consultarEmpleados();

      const existeRut = empleadosExistentes.some(
        (empleado: { rut: string }) =>
          normalizarRut(empleado.rut) === normalizarRut(rutLimpio)
      );

      if (existeRut) {
        setMensaje("Ya existe un empleado registrado con ese RUT.");
        return;
      }

      const contrasena = generarContrasena(rutLimpio, nombreLimpio);

      const empleado = {
        rut: rutLimpio,
        nombre: nombreLimpio,
        apellido: apellidoLimpio,
        telefono,
        correo: correoLimpio,
        contrasena,
      };

      await guardarEmpleado(empleado);

      router.push("/empleados");
    } catch {
      setMensaje(
        "Ocurrió un error al registrar el empleado. Comprueba que la API esté funcionando."
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <main className="container mt-5">
      <h1 className="text-primary">Registrar empleado</h1>

      <form onSubmit={registrarEmpleado} className="mt-4">
        <div className="mb-3">
          <label className="form-label">RUT</label>
          <input
            className="form-control"
            value={rut}
            onChange={(event) => setRut(event.target.value)}
            placeholder="12.345.678-5"
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
            placeholder="912345678"
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
            placeholder="usuario@electromechanic.cl"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-success"
          disabled={guardando}
        >
          {guardando ? "Registrando..." : "Registrar empleado"}
        </button>

        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => router.push("/empleados")}
        >
          Cancelar
        </button>
      </form>

      {mensaje && (
        <div className="alert alert-danger mt-3" role="alert">
          {mensaje}
        </div>
      )}
    </main>
  );
}