# Portal Legislativo — Concejo Deliberante Alberdi

Sistema web para el **Concejo Deliberante de Juan Bautista Alberdi, Tucumán**.
El proyecto tiene como objetivo centralizar y facilitar el acceso a la información legislativa, permitiendo a los ciudadanos consultar normativa y participar mediante formularios, mientras que los concejales y administradores disponen de herramientas para gestionar y mantener actualizado el digesto legislativo.

## Funcionalidades

### Portal público

* Información sobre concejales.
* Agenda de sesiones.
* Consulta y descarga de normativa vigente.
* Formulario de participación ciudadana.

### Área de concejales

* Inicio de sesión.
* Carga de ordenanzas, decretos, resoluciones y otros documentos.
* Gestión y actualización del digesto.
* Consulta de formularios ciudadanos.

### Área administrativa

* Gestión de usuarios.
* Administración de la agenda.
* Revisión y corrección de documentos.
* Administración general del sistema.

## Tecnologías

* **Frontend:** React + Vite
* **Backend:** Express + TypeScript
* **Base de datos:** PostgreSQL
* **ORM:** Prisma
* **CMS:** Directus
* **Gestor de paquetes:** pnpm

## Estructura

```text
proyecto-consejo/
├── frontend/
├── backend/
└── .git/
```

## Estado

🚧 Proyecto en desarrollo.

La carga y digitalización del archivo histórico del Concejo, desde aproximadamente 1984, será realizada como una etapa independiente.

## Desarrollo

Para instalar las dependencias:

```bash
cd frontend
pnpm install
```

```bash
cd ../backend
pnpm install
```

Para configurar las base de datos:

Crear archivo .env
dentro la varible 
DATABASE_URL= "DATABASE_URL="postgresql://USUARIO:PASSWORD@localhost:5432/NOMBRE_BASE_DE_DATOS""

Para ejecutar el proyecto:

```bash
pnpm dev
```

El frontend y backend se ejecutan de forma independiente.

---

Desarrollado para el **Concejo Deliberante de Juan Bautista Alberdi**.
