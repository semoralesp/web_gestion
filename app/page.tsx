import Link from "next/link";

export default function Home() {
  return (
    <main className="container mt-5">
      <h1 className="text-primary">Electro Mechanic</h1>

      <p className="lead">
        Sistema de gestión de empleados.
      </p>

      <div className="d-flex gap-2 mt-4">
        <Link href="/empleados" className="btn btn-primary">
          Ver empleados
        </Link>

        <Link
          href="/empleados/registrar"
          className="btn btn-success"
        >
          Registrar empleado
        </Link>
        <Link href="/gasto_almuerzo" className="btn btn-success">
           Gasto Almuerzo
        </Link>
        
        <Link href="/registro_trabajo" className="btn btn-success">
           Registro de Trabajo
        </Link>

        <Link href="/asistencia" className="btn btn-success">
           Registro Horario
        </Link>

        <Link href="/admin" className="btn btn-success">
            Panel de Administrador
        </Link>
      </div>
    </main>
  );
}