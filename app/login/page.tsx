"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Empleado = {
  id: string;
  rut: string;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
};

export default function Login() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [ingresando, setIngresando] = useState(false);

  async function iniciarSesion(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMensaje("");
    setIngresando(true);

    try {
      const respuesta = await fetch(
        "http://localhost:4000/empleados"
      );

      if (!respuesta.ok) {
        throw new Error("No se pudieron consultar los empleados.");
      }

      const empleados: Empleado[] = await respuesta.json();

      const empleado = empleados.find(
        (empleado) =>
          empleado.correo.toLowerCase() === correo.trim().toLowerCase() &&
          empleado.contrasena === contrasena
      );

      if (!empleado) {
        setMensaje("Correo electrónico o contraseña incorrectos.");
        return;
      }

      sessionStorage.setItem(
        "usuario_actual",
        JSON.stringify({
          id: empleado.id,
          rut: empleado.rut,
          nombre: empleado.nombre,
          apellido: empleado.apellido,
          correo: empleado.correo,
        })
      );

      router.push("/empleados");
    } catch {
      setMensaje(
        "No se pudo iniciar sesión. Comprueba que la API esté funcionando."
      );
    } finally {
      setIngresando(false);
    }
  }

  return (
    <main className="container mt-5" style={{ maxWidth: "500px" }}>
      <h1 className="text-primary">Electro Mechanic</h1>
      <h2 className="mt-4">Iniciar sesión</h2>

      <form onSubmit={iniciarSesion} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
            placeholder="usuario@electromechanic.cl"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={contrasena}
            onChange={(event) => setContrasena(event.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={ingresando}
        >
          {ingresando ? "Ingresando..." : "Iniciar sesión"}
        </button>

        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => router.push("/")}
        >
          Volver
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