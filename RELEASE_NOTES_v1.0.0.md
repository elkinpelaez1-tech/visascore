# Release Notes - VisaScore v1.0.0

**Fecha de Lanzamiento:** 1 de Agosto de 2026  
**Versión:** 1.0.0 (Primera Versión Estable de Producción)  

---

## 🚀 Resumen del Lanzamiento

Nos complace anunciar la primera versión estable (**v1.0.0**) de **VisaScore**, una plataforma unificada para simplificar y gestionar trámites de visado a través de una experiencia moderna, elegante y ahora, plenamente segura y centralizada. 

Este hito representa una madurez en la arquitectura, asegurando que VisaScore esté listo para operar con datos sensibles de clientes en entornos reales.

## 🌟 Novedades Principales

### 1. Migración Exitosa a la Nube (Supabase)
Hemos sustituido el almacenamiento local (`localStorage`) por una infraestructura robusta apoyada en **Supabase (PostgreSQL)**. Esto significa que los expedientes de todos los solicitantes generados a través de la web ahora se almacenan de manera centralizada.
- **Sincronización multi-dispositivo:** Los asesores consulares pueden iniciar sesión desde cualquier navegador, en cualquier ubicación, y visualizar los mismos expedientes en tiempo real.
- **Integridad de Datos:** Los cambios en los estados de un proceso (DS-160, lista de comprobación) se guardan instantáneamente en la base de datos oficial.

### 2. Autenticación y Seguridad (Supabase Auth + RLS)
La confidencialidad es crítica para los datos de un trámite consular. Hemos integrado un esquema estricto de seguridad:
- **Inicio de Sesión Privado:** El **Portal de Asesores Desk** ahora requiere autenticación a través de credenciales formales (`admin@visascore.info`), implementadas a nivel de servicio backend y encriptadas.
- **Seguridad a Nivel de Fila (RLS):** Hemos habilitado candados criptográficos directamente en la base de datos que dictan que **ningún usuario anónimo puede leer información de la base de datos**. Los solicitantes desde la web pública únicamente tienen privilegios de "inserción" o creación de su propio expediente.

### 3. Generación y Descarga de PDF Fiable
El sistema que permite al cliente obtener su Score Consular de Visado en formato PDF ha sido depurado exitosamente para entornos serverless (Render). Utilizando `puppeteer-core` y `@sparticuz/chromium`, las conversiones de HTML a PDF funcionan a la perfección y con un rendimiento superior.

### 4. Experiencia de Asesor Fluida
El Portal de Asesores Desk incluye nuevas características clave:
- **Gestión Avanzada:** Capacidad de visualizar en un solo vistazo información vital de los aplicantes y editar manualmente la etapa del proceso y el identificador DS-160, que son invisibles al cliente.
- **Cierre de Sesión Seguro:** Botón accesible en la parte superior para invalidar el token activo en el navegador actual, permitiendo trabajar desde ordenadores compartidos con seguridad.

## 🛠 Entorno de Ejecución

Esta versión compila 100% de manera estática y eficiente bajo **Next.js 16 (Turbopack)**, e integra variables de entorno para su correcto funcionamiento en servidores PaaS como Vercel y Render. 

*VisaScore v1.0.0 sienta una arquitectura escalable lista para dar el siguiente paso en la gestión de visas a nivel internacional.*
