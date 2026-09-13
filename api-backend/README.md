# IT Asset Management - Ecosistema de Desarrollo (Facultad de Informática Culiacán)

Este repositorio contiene la arquitectura completa del proyecto: infraestructura de bases de datos (Docker), API (Laravel) y cliente web (React). 

## 1. Verificación de Requisitos Previos
Antes de clonar el proyecto, abre tu terminal (PowerShell o CMD) y verifica que tienes las siguientes herramientas instaladas ejecutando los comandos indicados. Si algún comando marca error, descarga la herramienta desde su enlace oficial.

* **Git** 
  * *Verificar:* Ejecuta `git --version`
  * *Descargar:* [git-scm.com](https://git-scm.com/downloads)
* **Docker Desktop**
  * *Verificar:* Ejecuta `docker --version`. Asegúrate también de tener WSL2 actualizado ejecutando `wsl --update` y de tener la virtualización activada en la BIOS de tu computadora.
  * *Descargar:* [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
* **Node.js (para React)**
  * *Verificar:* Ejecuta `node -v` y `npm -v`
  * *Descargar:* [nodejs.org](https://nodejs.org/) (Descarga la versión LTS)
* **PHP 8.2+ y Composer (XAMPP)**
  * *Verificar PHP:* Ejecuta `php -v` (Debe ser versión 8.2 o superior). Si no lo tienes, descarga [XAMPP](https://www.apachefriends.org/es/index.html).
  * *Verificar Composer:* Ejecuta `composer -V`. Si no lo tienes, descárgalo en [getcomposer.org](https://getcomposer.org/download/).

### ⚠️ Configuración Obligatoria de PHP (XAMPP)
Laravel necesita comunicarse con PostgreSQL y MongoDB. Sigue estos pasos exactos antes de continuar:
1. Abre tu archivo `C:\xampp\php\php.ini`.
2. **Para PostgreSQL:** Busca la línea `;extension=pdo_pgsql` y bórra el punto y coma (`;`) al inicio para activarla. Haz lo mismo con `;extension=pgsql`.
3. **Para MongoDB:** Necesitas descargar el traductor interno. 
   * Ve a [PECL MongoDB](https://pecl.php.net/package/mongodb) y descarga el archivo `.zip` DLL para tu versión exacta de PHP (Thread Safe, x64).
   * Extrae el archivo `php_mongodb.dll` y pégalo en `C:\xampp\php\ext\`.
   * En tu archivo `php.ini`, agrega la línea `extension=mongodb` en la sección de extensiones.
4. Guarda el archivo y reinicia tu terminal.

---

## 2. Levantar la Infraestructura
Clona el repositorio y enciende los motores de bases de datos en segundo plano:

```bash
git clone [https://gitlab.com/it-asset-management-group1/it-asset-management-project.git](https://gitlab.com/it-asset-management-group1/it-asset-management-project.git)
cd it-asset-management-project
docker compose up -d
```

> **Nota:** Abre la aplicación de Docker Desktop y verifica que los contenedores de PostgreSQL, MongoDB y Redis tengan el indicador verde de encendido antes de avanzar.

---

## 3. Configurar el Backend (Laravel)
Abre una terminal nueva, entra a la carpeta de la API y descarga el núcleo del framework:

```bash
cd api-backend
composer install
```

Duplica el archivo `.env.example`, renómbralo exactamente a `.env` y actualiza las variables `DB_*` y `MONGODB_*` con las credenciales locales de Docker. Finalmente, prepara tu base de datos:

```bash
php artisan key:generate
php artisan migrate
```

---

## 4. Configurar el Frontend (React)
Abre una terminal nueva en la raíz del proyecto, descarga los paquetes de la interfaz y levanta el servidor de desarrollo local:

```bash
cd frontend
npm install
npm run dev
```
