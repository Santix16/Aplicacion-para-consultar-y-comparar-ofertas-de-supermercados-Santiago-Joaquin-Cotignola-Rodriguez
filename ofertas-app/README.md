# Ofertas App - Santiago Joaquin Cotignola Rodriguez

Aplicación web full-stack para consultar y comparar ofertas de supermercados. El usuario explora productos por categorías, compara las ofertas de un mismo producto entre distintas tiendas, consulta el detalle de cada oferta y guarda las que le interesan en una lista personal. El frontend está desarrollado en Angular y el backend en Node.js con Express y MongoDB.

## ¿Qué es este proyecto?

Es un MVP de comparador de ofertas de supermercado. La mecánica principal consiste en:

- Explorar las categorías de productos: Lácteos, Panadería, Carnes, Frutas y Verduras, Bebidas, Limpieza, Congelados y Alimentación.
- Ver los productos de cada categoría que tienen al menos una oferta activa.
- Comparar, para un producto, las ofertas de las distintas tiendas y ver cuál ofrece la mejor relación calidad-precio.
- Consultar el detalle de una oferta: precios, ahorro, fechas de validez y datos de la tienda (dirección, contacto y horario semanal).
- Guardar ofertas en una lista personal que se conserva entre sesiones.

## Características principales

- API REST con Express para productos, ofertas y tiendas.
- Persistencia en MongoDB con Mongoose y script de seed para cargar datos de ejemplo.
- Portada con buscador de categorías y contador de productos y ofertas activas por categoría.
- Comparativa de ofertas por tienda, ordenada con una puntuación que combina descuento, valoración de la tienda y precio final.
- Página única de detalle de oferta, accesible tanto desde la comparativa como desde la lista personal.
- Lista personal ("Mi lista") guardada en el navegador con localStorage.
- Servicio de geolocalización y cálculo de distancias (Haversine) preparado, aunque todavía no está conectado a las pantallas.

## Tecnologías utilizadas

- Angular 21 (componentes standalone, sin zone.js)
- TypeScript 5.9
- RxJS 7.8
- Vitest y jsdom (tests del frontend)
- Node.js y Express 4
- MongoDB y Mongoose 7
- cors, dotenv y nodemon

## Requisitos previos

Necesitarás tener instalado:

- Node.js 20.19 o superior (también valen 22.12+ y 24+, requisito de Angular 21)
- npm
- MongoDB en local (`mongodb://localhost:27017`) o una base de datos en MongoDB Atlas

## Instalación

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd ofertas-app
```

2. Instala las dependencias del backend:

```bash
cd backend
npm install
```

3. Instala las dependencias del frontend:

```bash
cd ../frontend
npm install
```

### Variables de entorno

El backend lee su configuración de `backend/.env` (puedes partir de `.env.example`):

```
PORT=3001
MONGO_URI=mongodb://localhost:27017/ofertas-app
```

El nombre de la variable es `MONGO_URI` (no `MONGODB_URI`). Si no defines el archivo se usan estos mismos valores por defecto. Si cambias el puerto del backend, actualiza también `apiUrl` en `frontend/src/environments/environment.ts`.

## Scripts disponibles

### Backend (`backend/`)

| Script | Comando | Descripción |
|--------|---------|-------------|
| start | `npm start` | Inicia el servidor con Node |
| dev | `npm run dev` | Inicia el servidor con nodemon (recarga automática) |
| seed | `npm run seed` | Vacía y vuelve a cargar la base de datos con los datos de ejemplo |

### Frontend (`frontend/`)

| Script | Comando | Descripción |
|--------|---------|-------------|
| start | `npm start` | Inicia Angular en modo desarrollo |
| build | `npm run build` | Compila la aplicación |
| watch | `npm run watch` | Compila en modo desarrollo y vigila cambios |
| test | `npm test` | Ejecuta los tests con Vitest |

## Cómo ejecutar la aplicación

### 1) Arrancar MongoDB

Asegúrate de que MongoDB está en marcha antes de continuar.

### 2) Cargar los datos de ejemplo

```bash
cd backend
npm run seed
```

El script lee `frontend/server/db.json`, **borra las colecciones existentes** y las vuelve a crear con 6 tiendas, 20 productos, 90 ofertas y 8 categorías. Si añades datos a mano en ese archivo, los `_id` deben ser ObjectId válidos (24 caracteres hexadecimales); en caso contrario el seed falla. Las ofertas de ejemplo tienen fechas de vigencia propias (varias hasta el 31/10/2026): cuando caduquen, el detalle las mostrará como expiradas. Actualiza las fechas en `db.json` y vuelve a ejecutar el seed.

### 3) Levantar el backend

```bash
npm run dev
```

Deberías ver `Conectado exitosamente a MongoDB` y `Server is running on port 3001`. Para comprobarlo, abre `http://localhost:3001/api/health`.

### 4) Iniciar el frontend

En otra terminal:

```bash
cd frontend
npm start
```

La aplicación queda disponible en `http://localhost:4200`.

### 5) Ejecutar las pruebas

```bash
cd frontend
npm test
```

El backend todavía no tiene un script de tests configurado.

## Estructura del proyecto

```
ofertas-app/
├── backend/
│   ├── src/
│   │   ├── controllers/     # offerController, productController, storeController
│   │   ├── models/          # Category, Offer, Product, Store
│   │   ├── routes/          # categories, offers, products, stores
│   │   └── services/        # Utilidades de negocio
│   ├── seed.js              # Carga los datos de frontend/server/db.json en MongoDB
│   ├── server.js            # Punto de entrada del servidor
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/              # Recursos públicos
│   ├── server/
│   │   └── db.json          # Datos de ejemplo usados por el seed
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # map-view, offer-card, search-bar, store-list
│   │   │   ├── models/      # offer, product y store (interfaces TypeScript)
│   │   │   ├── pages/       # home, category, offers, offer-detail, personal-list,
│   │   │   │                # product-detail, results
│   │   │   ├── services/    # api, favorites, geolocation, products
│   │   │   ├── app.routes.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.ts       # Componente raíz
│   │   ├── environments/    # environment.ts y environment.prod.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── angular.json
│   └── package.json
│
├── test-api.ps1 / test-api.sh   # Scripts auxiliares de prueba de la API
└── README.md
```

## Cómo usar la aplicación

1. Abre `http://localhost:4200`. La portada muestra las categorías; el buscador filtra por nombre de categoría.
2. Entra en una categoría para ver sus productos con oferta activa.
3. Elige un producto para abrir la comparativa: las ofertas aparecen agrupadas por tienda y la primera lleva la etiqueta "Mejor opción calidad-precio".
4. Pulsa "Ver detalles" para ver la oferta completa y los datos de la tienda. "Volver" regresa a la pantalla anterior.
5. Pulsa "Guardar" para añadir la oferta a tu lista. Desde "Mi lista", en la cabecera, puedes abrir el detalle, eliminar ofertas una a una o vaciar la lista.

### Rutas del frontend

| Ruta | Pantalla |
|------|----------|
| `/home` | Portada con las categorías |
| `/category/:name` | Productos de una categoría con oferta activa |
| `/offers/:id` | Comparativa de ofertas de un producto (id de producto) |
| `/offer-detail/:id` | Detalle de una oferta (id de oferta) |
| `/my-list` | Lista personal |
| `/results`, `/product/:id` | Existen, pero no forman parte del flujo principal |
| `**` | Redirige a `/home` (incluida la raíz `/`) |

## API REST

Todas las rutas cuelgan de `/api`.

| Recurso | Endpoints | Filtros en `GET /` |
|---------|-----------|--------------------|
| Productos | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | `search`, `category`, `minPrice`, `maxPrice`, `latitude` + `longitude` + `radius` (en km) |
| Ofertas | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | `productId`, `storeId`, `isActive` (por defecto solo las activas) |
| Tiendas | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | `city`, `minRating` |

Además, `GET /api/health` devuelve el estado del servidor. Las ofertas se devuelven con `productId` y `storeId` como identificadores simples, sin datos anidados: el frontend pide el producto y la tienda por separado.

## Modelo de datos

| Colección | Campos principales |
|-----------|--------------------|
| Category | `id` (numérico), `name` |
| Store | `name`, `address`, `city`, `state`, `zipCode`, `phone`, `email`, `website`, `location` (latitud y longitud), `openingHours` (`monday` a `sunday`), `rating`, `reviews`, `image` |
| Product | `name`, `description`, `price`, `originalPrice`, `discount`, `image`, `category`, `storeId`, `storeName`, `location`, `rating`, `reviews`, `inStock` |
| Offer | `productId`, `storeId`, `discount` (0-100), `originalPrice`, `finalPrice`, `startDate`, `endDate`, `description`, `isActive` |

Todas incluyen `createdAt` y `updatedAt` (salvo Category). Las ofertas reales viven en la colección Offer; el campo `discount` de Product no se usa para decidir qué productos tienen oferta.

Los datos de `db.json` son de ejemplo. Los nombres de las cadenas (Mercadona, Carrefour, Lidl, DIA, Consum y Aldi) van acompañados de direcciones, teléfonos, correos, horarios y valoraciones ilustrativos, que no corresponden a sucursales reales verificadas.

## Guardado de la lista personal

La lista personal se guarda en el `localStorage` del navegador con dos claves:

- `favoriteOffers`: identificadores de las ofertas guardadas.
- `cachedOffersWithDetails`: copia de los detalles para pintar la lista al instante; se refresca desde la API al abrir "Mi lista".

Al vivir en el navegador, la lista no se comparte entre dispositivos ni entre navegadores.

## Créditos

Proyecto desarrollado por Santiago Joaquin Cotignola Rodriguez como MVP de comparador de ofertas, con enfoque de aprendizaje en Angular, API REST con Express y modelado de datos con MongoDB.

Licencia: ISC.