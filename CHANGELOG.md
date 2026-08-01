# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-01

### Añadido (Added)
- **Portal de Asesores:** Creado un dashboard exclusivo e interno para la gestión integral de expedientes consulares de visado.
- **Autenticación (Supabase Auth):** Implementado el inicio de sesión seguro para el Portal de Asesores, utilizando validaciones de sesión reales (sesión no anónima).
- **Integración de Base de Datos (Supabase DB):** Todos los expedientes generados por el asistente guiado (VisaWizard) ahora se sincronizan de forma centralizada en la nube mediante PostgreSQL.
- **Políticas de Seguridad (Row Level Security - RLS):** 
  - Restricción estricta de consultas (SELECT) únicamente a usuarios asesores autenticados.
  - Permiso de inserción (INSERT) de expedientes habilitado para clientes de forma anónima desde la landing.
- **Generación de PDF en Producción:** Implementación definitiva de `puppeteer-core` y `@sparticuz/chromium` para la creación y descarga estable de PDF en el entorno de producción (Render).
- **Botón "Cerrar Sesión":** Función para destruir de manera segura la sesión activa del asesor y redirigir a la pantalla de login.
- **Soporte Responsivo y de Diseño Dinámico:** Interfaz moderna y adaptable con paletas de colores en tonos azules, oscuros, degradados fluidos y componentes accesibles en todo el flujo del cliente.

### Modificado (Changed)
- **Capa de Persistencia de Datos:** Se reemplazó completamente el uso de almacenamiento local (`localStorage`) en los asesores, garantizando la persistencia y lectura cruzada desde cualquier dispositivo u ordenador.
- **Flujo General del Asesor (`visaService.ts`):** Todas las consultas locales del archivo `visaService.ts` fueron refactorizadas a llamadas asíncronas de base de datos utilizando el SDK de `@supabase/supabase-js`.
- **UI del Dashboard de Asesores:** Múltiples mejoras estéticas y estructuración en fichas funcionales ("Información DS-160", "Lista de Verificación", etc.).

### Corregido (Fixed)
- Solucionados errores de compilación (`executablePath`) que impedían la ejecución del motor Chromium para los expedientes PDF del cliente final.
- Eliminada la pérdida de estados asíncronos y solapamientos en los expedientes que se generaban mediante guardado local.
