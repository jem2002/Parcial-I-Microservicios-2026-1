# Biblioteca Frontend

Frontend de la biblioteca construido con React, Vite y Tailwind CSS.

## Instrucciones de desarrollo

1. Ve a la carpeta del frontend:
   ```bash
   cd biblioteca-frontend
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación en desarrollo:
   ```bash
   npm run dev
   ```

## Variables de entorno

Usa `.env` para ajustar las APIs backend:

```env
VITE_AUTH_SERVICE_URL=http://localhost:5132
VITE_CATALOG_SERVICE_URL=http://localhost:3002
```

## Enlaces

- Frontend: `http://localhost:4173`
- Auth service: `http://localhost:5132`
- Catalog service: `http://localhost:3002`

## Notas

- El frontend almacena el token en `localStorage` y lo envía en el header `Authorization`.
- Las rutas protegidas requieren sesión activa.
