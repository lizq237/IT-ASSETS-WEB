# IT Assets Management

**Sistema de gestión de activos tecnológicos y tickets de soporte con arquitectura SaaS multi-tenant.**

> Proyecto académico en desarrollo de la Facultad de Informática Culiacán (UAS). Integra un panel web, una aplicación móvil Android y una API REST que comparten las reglas de negocio y el acceso a los datos.

**Estado:** En desarrollo · **Pruebas:** entorno local · **Equipo:** 6 integrantes · **Líder de proyecto:** Lizeth Quiroz Urias

## ¿Qué problema resuelve?

La administración de inventarios de TI suele requerir consultar equipos, ubicaciones, responsables y reportes en diferentes herramientas. IT Assets centraliza esta información y permite que cada organización trabaje con sus propios datos.

### Funcionalidades

- **Multi-tenancy:** separación de información por organización mediante `organization_id`.
- **Administración de activos:** registro, consulta, edición, asignación y actualización de estado.
- **Catálogos:** marcas, categorías y ubicaciones de los equipos.
- **Usuarios y roles:** autenticación mediante Laravel Sanctum y autorización basada en roles (RBAC).
- **Aplicación Android:** consulta de activos asignados al usuario y registro de tickets de soporte.
- **Tickets:** incidencias con prioridad y descripción, con opción de adjuntar evidencia fotográfica; persistencia en MongoDB.

> El sistema **todavía está en desarrollo**. Redis se encuentra definido en Docker Compose, pero la integración funcional de caché es un objetivo próximo; no se presenta como una característica terminada.

## Arquitectura

```mermaid
flowchart TD
    WEB[Web: React + Vite] -->|HTTP / REST| API[Laravel 12 + Sanctum]
    MOBILE[Android: Java + XML + Retrofit] -->|HTTP / REST| API
    API --> PG[(PostgreSQL 16: inventario, organizaciones y usuarios)]
    API --> MG[(MongoDB 7: tickets)]
    REDIS[(Redis: servicio disponible, caché pendiente)]
```

| Componente | Tecnologías |
| --- | --- |
| Frontend web | React, JavaScript, Vite, React Router, Axios |
| Backend | PHP 8.2+, Laravel 12, Laravel Sanctum, API REST |
| App Android | Java, XML, Retrofit, Android Studio |
| Bases de datos | PostgreSQL 16 y MongoDB 7 |
| Desarrollo local | Docker, Docker Compose |
| Organización del equipo | Git, GitHub, Scrum y Taiga |

## Repositorios

El proyecto está dividido en **tres repositorios independientes**:

| Parte | Repositorio | Rama principal |
| --- | --- | --- |
| Web e infraestructura Docker | [IT-ASSETS-WEB](https://github.com/lizq237/IT-ASSETS-WEB) | `developer` |
| API REST | [IT-ASSETS-API](https://github.com/lizq237/IT-ASSETS-API) | `developer` |
| Android | [IT-ASSETS-MOVIL](https://github.com/lizq237/IT-ASSETS-MOVIL) | `main` |

## Guía para probar el proyecto localmente

**Requisitos:** Git, Docker Desktop con Compose, PHP 8.2 o superior, Composer, extensiones PHP `pdo_pgsql`, `pgsql` y `mongodb`, Node.js compatible con Vite 8 (20.19+ o 22.12+) y npm. Android Studio es opcional, salvo que también quieras probar la app móvil.

**Puertos necesarios:** `5432` (PostgreSQL), `27017` (MongoDB), `6379` (Redis), `8000` (Laravel) y `5173` (Vite, por defecto).

### 1. Clonar los repositorios

Desde una misma carpeta de trabajo:

```bash
git clone -b developer https://github.com/lizq237/IT-ASSETS-WEB.git
git clone -b developer https://github.com/lizq237/IT-ASSETS-API.git
git clone -b main https://github.com/lizq237/IT-ASSETS-MOVIL.git
```

### 2. Levantar las bases de datos

```bash
cd IT-ASSETS-WEB
docker compose up -d
docker compose ps
```

El `docker-compose.yml` de este repositorio inicia PostgreSQL, MongoDB y Redis. PostgreSQL y MongoDB conservan sus datos en volúmenes locales de Docker.

### 3. Configurar la API (Laravel)

Abre **otra terminal**:

```bash
cd IT-ASSETS-API
composer install
```

Crea un archivo `.env` a partir de `.env.example` (en PowerShell: `Copy-Item .env.example .env`; en Bash: `cp .env.example .env`). Ajusta estas variables para el entorno local definido en el Compose del repositorio Web:

```dotenv
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=inventario_fic
DB_USERNAME=root
DB_PASSWORD=secretpassword

MONGODB_URI=mongodb://root:secretpassword@127.0.0.1:27017/?authSource=admin
MONGODB_DATABASE=sysbase_tickets
```

**Estas contraseñas son exclusivamente de ejemplo para el entorno local.** Nunca reutilices estos valores en producción ni subas archivos `.env` con credenciales a GitHub.

Ejecuta:

```bash
php artisan key:generate
php artisan optimize:clear
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

La API quedará en **http://127.0.0.1:8000/api**. Los seeders crean cuentas y organizaciones para pruebas; **no generan un inventario completo**.

### 4. Iniciar la web (React)

En otra terminal:

```bash
cd IT-ASSETS-WEB
npm ci
npm run dev
```

Abre la URL mostrada por Vite, normalmente **http://localhost:5173**. El frontend utiliza `/api` y el proxy de `vite.config.js` redirige esas llamadas a `http://127.0.0.1:8000`.

### 5. Acceso de demostración local

Después de `php artisan migrate --seed`, `SuperAdminSeeder.php` crea esta **cuenta ficticia únicamente para evaluación local**:

| Campo | Valor |
| --- | --- |
| Usuario | `super@sysbase.com` |
| Contraseña local de ejemplo | `password123` |
| Rol | `super_admin` |

`TenantSeeder.php` también crea organizaciones y administradores de ejemplo. Para ver o cambiar esos registros revisa los seeders de la [API](https://github.com/lizq237/IT-ASSETS-API/tree/developer/database/seeders).

**No utilices estas cuentas predeterminadas ni estas contraseñas en producción.**

### 6. Recorrido de evaluación sugerido

1. Inicia sesión como `super_admin` y revisa el módulo de organizaciones.
2. Utiliza un administrador `admin_ti` creado por los seeders o registra una nueva organización.
3. Configura catálogos de marcas, categorías y ubicaciones.
4. Registra un activo tecnológico y asígnalo a un usuario.
5. Comprueba que un usuario no pueda consultar ni editar datos de otra organización.
6. Desde Android, inicia sesión con un usuario al que se le haya asignado un equipo y crea un ticket con título, descripción, prioridad y, opcionalmente, evidencia fotográfica.

**Nota:** el inventario y los equipos asignados deben prepararse manualmente para completar la prueba móvil. No se garantiza una demo con datos precargados.

## Probar la API sin la interfaz

Inicio de sesión:

```bash
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"super@sysbase.com","password":"password123","device_name":"web"}'
```

La respuesta correcta devuelve un `access_token`. Las rutas protegidas usan `Authorization: Bearer <token>`.

| Método | Ruta | Función |
| --- | --- | --- |
| POST | `/api/login` | Autenticarse |
| GET | `/api/me` | Consultar sesión |
| GET | `/api/assets` | Listar activos |
| POST | `/api/assets` | Registrar activos (admin TI) |
| GET | `/api/employee/assets` | Consultar equipos asignados |
| POST | `/api/employee/tickets` | Registrar tickets |
| POST | `/api/register-tenant` | Registrar organizaciones (super admin) |

Las rutas, permisos y validaciones vigentes están definidos en [`routes/api.php`](https://github.com/lizq237/IT-ASSETS-API/blob/developer/routes/api.php).

## Probar Android

1. Abre `IT-ASSETS-MOVIL` en **Android Studio** y sincroniza Gradle.
2. Inicia un **emulador Android**. `RetrofitClient.java` ya utiliza `http://10.0.2.2:8000/api/`, dirección que permite al emulador conectarse al Laravel de tu computadora.
3. Mantén activa la API en el puerto `8000`; ejecuta la app e inicia sesión con un usuario local de prueba que tenga activos asignados.
4. Consulta sus equipos y registra un ticket.

Para probar en **un dispositivo Android físico**, debes actualizar `BASE_URL` en [`RetrofitClient.java`](https://github.com/lizq237/IT-ASSETS-MOVIL/blob/main/app/src/main/java/com/example/sysbase/RetrofitClient.java) a la IP local de tu PC (por ejemplo, `http://IP_LOCAL:8000/api/`). Inicia Laravel con `php artisan serve --host=0.0.0.0 --port=8000` y comprueba que el firewall permita la conexión **únicamente en la red de confianza**.

## Comprobaciones

```bash
# Desde IT-ASSETS-API
php artisan test

# Desde IT-ASSETS-WEB
npm run build
```

Los comandos están disponibles en los repositorios; no se afirma aquí que todas las pruebas automatizadas pasen en el estado actual del proyecto.

### Problemas frecuentes

- **La web no conecta:** comprueba que Laravel siga activo en el puerto `8000` y que el proxy de Vite esté configurado.
- **No conecta PostgreSQL/MongoDB:** ejecuta `docker compose ps`, revisa la configuración del `.env` y comprueba las extensiones PHP.
- **No aparecen activos:** las migraciones y seeders no crean un inventario completo; registra equipos desde la web.
- **Android devuelve `Connection refused`:** en el emulador usa `10.0.2.2`, no `localhost`. En dispositivo físico usa la IP de tu PC y revisa el firewall.
- **Laravel mantiene configuración antigua:** ejecuta `php artisan optimize:clear` y reinicia el servidor.

## Estado y mejoras previstas

IT Assets continúa en desarrollo. Las siguientes mejoras contemplan integrar Redis para caché, ampliar la gestión de tickets y preparar datos de demostración completos, capturas de pantalla y pruebas de extremo a extremo.

## Equipo y contribución

Proyecto universitario desarrollado por **un equipo de seis integrantes** bajo metodología Scrum, con seguimiento de tareas en Taiga.

**Lizeth Quiroz Urias — Líder de proyecto y desarrolladora full stack.** Coordino la planificación de sprints, la distribución y revisión de tareas y la integración técnica de web, API y móvil.

---

**Disponibilidad:** actualmente no existe una demo pública confirmada. La forma prevista de evaluación es mediante instalación local de los repositorios anteriores.
