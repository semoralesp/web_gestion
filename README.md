# Electro Mechanic — web_gestion

Sistema de gestión de empleados desarrollado con Next.js, React, TypeScript y Bootstrap.

## Requisitos

- Node.js y npm.
- JSON Server para simular la API de empleados.

## Instalación

Instala las dependencias del proyecto:

```bash
npm install
```

## Ejecución

Abre dos terminales en la carpeta del proyecto.

En la primera, inicia JSON Server:

```bash
npx json-server --watch datos_prueba.json -p 4000
```

En la segunda, inicia Next.js:

```bash
npm run dev
```

Abre http://localhost:3000 en el navegador.

## Funcionalidades actuales

- Registro de empleados.
- Validaciones de datos.
- Generación de contraseña.
- Inicio de sesión.
- Listado, edición y eliminación de empleados.
- Persistencia de datos mediante JSON Server.