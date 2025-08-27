### **Documento de Requerimientos – Sistema de Gestión de Calidad (SGC)**

Este documento detalla los requerimientos funcionales y no funcionales para la aplicación "SGC Pavi", un panel de control para la gestión de sistemas de calidad.

#### **1. Resumen del Proyecto**

El objetivo es desarrollar una Aplicación de Una Sola Página (SPA) que permita a los usuarios administrar y visualizar datos relacionados con un Sistema de Gestión de Calidad (SGC), incluyendo módulos para documentos, auditorías, personal, y más. La aplicación debe ser intuitiva, segura y ofrecer herramientas para el análisis de datos.

#### **2. Requerimientos Funcionales (RF)**

**RF-01: Autenticación de Usuarios**
*   **RF-01.1:** El sistema debe presentar una pantalla de inicio de sesión para acceder a la aplicación.
*   **RF-01.2:** El sistema debe validar las credenciales del usuario (usuario y contraseña) contra una lista de usuarios registrados.
*   **RF-01.3:** El sistema debe mantener la sesión del usuario activa mientras navega por la aplicación.
*   **RF-01.4:** El sistema debe permitir al usuario cerrar su sesión, lo que limpiará sus datos de sesión y lo redirigirá a la página de inicio de sesión.

**RF-02: Dashboard Principal**
*   **RF-02.1:** Al iniciar sesión, el usuario será dirigido a un dashboard principal.
*   **RF-02.2:** El dashboard debe mostrar visualizaciones clave, incluyendo:
    *   Un gráfico de dona (`doughnut chart`) que muestre el estado de las auditorías (Ej: Planificada, En Proceso, Finalizada).
    *   Un gráfico de barras (`bar chart`) que muestre el origen de las no conformidades (Ej: Auditoría Interna, Cliente).

**RF-03: Gestión de Módulos (Operaciones CRUD)**
*   El sistema debe permitir la gestión completa (Crear, Leer, Actualizar, Eliminar) de los siguientes módulos:
    *   **RF-03.1: Objetivos:** Gestionar objetivos de calidad.
    *   **RF-03.2: Indicadores:** Gestionar indicadores de rendimiento.
    *   **RF-03.3: Documentos:** Administrar documentos, incluyendo su estado (Vigente, Obsoleto).
    *   **RF-03.4: Procesos:** Administrar los procesos de la organización.
    *   **RF-03.5: Auditorías:** Planificar y registrar auditorías, incluyendo su estado.
    *   **RF-03.6: No Conformidades:** Registrar y dar seguimiento a las no conformidades.
    *   **RF-03.7: Avisos:** Crear y gestionar avisos o recordatorios con fechas y estado.
    *   **RF-03.8: Personal:** Administrar la información del personal de la empresa.
    *   **RF-03.9: Administración de Usuarios:** Gestionar las cuentas de usuario que pueden acceder al sistema.
    *   **RF-03.10: Catálogos:** Administrar datos maestros como áreas, puestos, tipos de auditores, etc.

**RF-04: Interfaz de Usuario y Experiencia**
*   **RF-04.1:** La adición y edición de datos se debe realizar a través de ventanas modales para no recargar la página.
*   **RF-04.2:** Las tablas de datos deben mostrar indicadores visuales de estado (ej. "Activo" en verde, "Inactivo" en gris).
*   **RF-04.3:** Cada módulo principal debe contar con una barra de búsqueda para filtrar los registros por texto.
*   **RF-04.4:** La interfaz debe tener un menú de navegación lateral para cambiar entre los diferentes módulos.
*   **RF-04.5:** El perfil del usuario autenticado debe mostrarse en la cabecera, con una opción para cerrar sesión.

#### **3. Requerimientos No Funcionales (RNF)**

**RNF-01: Tecnología y Arquitectura**
*   **RNF-01.1:** La aplicación debe ser una Aplicación de Una Sola Página (SPA) para una experiencia de usuario fluida.
*   **RNF-01.2:** El frontend debe estar construido con el framework **Vue.js (versión 3)**.
*   **RNF-01.3:** Los gráficos deben ser renderizados utilizando la librería **Chart.js**.
*   **RNF-01.4:** El diseño y los estilos deben implementarse con **TailwindCSS** (cargado vía CDN).
*   **RNF-01.5:** La iconografía se debe gestionar con **Font Awesome** (cargado vía CDN).

**RNF-02: Usabilidad**
*   **RNF-02.1:** La interfaz debe ser intuitiva y fácil de usar, sin requerir capacitación extensiva.
*   **RNF-02.2:** La aplicación debe ser accesible desde navegadores web modernos (Chrome, Firefox, Safari, Edge).

**RNF-03: Seguridad**
*   **RNF-03.1:** El acceso a la aplicación debe estar restringido a usuarios autenticados.
*   **RNF-03.2:** La información de la sesión del usuario se debe almacenar de forma segura en el navegador utilizando `sessionStorage`.

**RNF-04: Entorno de Desarrollo**
*   **RNF-04.1:** El proyecto debe poder ejecutarse localmente utilizando un servidor web simple, como `http-server` de Node.js.
*   **RNF-04.2:** Debe existir un archivo `package.json` que documente las dependencias del proyecto.
