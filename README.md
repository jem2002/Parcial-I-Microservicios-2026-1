# Biblioteca Frontend

Frontend de la aplicación de gestión de biblioteca construido con **React + Vite** y **Tailwind CSS**.

## Requisitos Previos

- **Node.js** (v18 o superior)
- **npm** o **yarn**
- **Docker** y **Docker Compose** (para despliegue en contenedores)

## Instalación Local

### 1. Clonar el repositorio
```bash
git clone <repositorio>
cd biblioteca-frontend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:
```env
VITE_AUTH_SERVICE_URL=http://localhost:5132
VITE_CATALOG_SERVICE_URL=http://localhost:3002
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Scripts Disponibles

- **`npm run dev`** - Inicia el servidor de desarrollo con hot-reload
- **`npm run build`** - Compila la aplicación para producción
- **`npm run preview`** - Previsualiza la build de producción localmente
- **`npm run lint`** - Ejecuta ESLint para verificar el código

## 🐳 Despliegue con Docker

### Usando Docker Compose (Recomendado)

1. **Construir la imagen:**
```bash
docker-compose build
```

2. **Ejecutar el contenedor:**
```bash
docker-compose up -d
```

La aplicación estará disponible en `http://localhost:4173`

### Variables de Entorno en Docker

El archivo `docker-compose.yml` usa variables de entorno. Puedes crear un `.env` en la raíz:
```env
VITE_AUTH_SERVICE_URL=http://identity-service:5132
VITE_CATALOG_SERVICE_URL=http://catalog-service:3002
```

### Usando solo Docker

```bash
# Construir la imagen
docker build \
  --build-arg VITE_AUTH_SERVICE_URL=http://localhost:5132 \
  --build-arg VITE_CATALOG_SERVICE_URL=http://localhost:3002 \
  -t biblioteca-frontend:latest .

# Ejecutar el contenedor
docker run -p 4173:80 biblioteca-frontend:latest
```

## Estructura del Proyecto

```
src/
├── api/               # Integraciones con APIs (auth, catalog, roles, users)
├── components/        # Componentes reutilizables
│   ├── books/        # Componentes relacionados con libros
│   ├── common/       # Componentes comunes (NavBar, ProtectedRoute, etc)
│   └── roles/        # Componentes de roles
├── context/          # Context API (AuthContext)
├── hooks/            # Hooks personalizados
├── pages/            # Páginas principales
└── utils/            # Funciones utilitarias
```

## Características

- ✅ Autenticación y autorización
- ✅ Gestión de roles (RoleGuard)
- ✅ Protección de rutas privadas
- ✅ Catálogo de libros con filtros
- ✅ Interfaz responsiva con Tailwind CSS
- ✅ Linting con ESLint

## Tecnologías

- **React 19** - Framework UI
- **Vite** - Build tool y dev server
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilos CSS
- **Nginx** - Servidor web (producción)

## Notas

- El archivo `nginx.conf` configura el servidor web para SPA (Single Page Application)
- Las variables de entorno de Vite (`VITE_*`) se definen en tiempo de build en Docker