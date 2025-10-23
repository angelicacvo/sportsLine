# SportsLine API

## About
This repository contains the backend implementation for SportsLine: an API to manage users, clients, products and sales orders. The implementation focuses on data integrity, role-based access, transactional order creation (with stock decrement), and clear documentation so that the reviewer can deploy and validate the solution quickly.

The stack is Node.js (TypeScript), Express, Sequelize (Postgres) and JWT. The code is organized by concern: models, services, controllers, routes, middlewares and utilities.

## Objective
Provide a RESTful API that allows SportsLine to:

- Register and manage clients and products.
- Create sales orders composed of products (many-to-many with quantities and unit prices).
- Validate and decrement stock automatically during order creation.
- Query order history and filter by client or product name.
- Secure endpoints with JWT-based authentication and role-based authorization (admin/seller).

## Requirements Implemented

1. Authentication (HU2)
   - User registration and login.
   - JWT access + refresh tokens and refresh endpoint.
   - Route protection via JWT middleware and role checks (admin/seller).

2. Persistence
   - PostgreSQL as the relational database.
   - Sequelize ORM for models, associations and queries.
   - Migrations and seeders (with bcrypt-hashed passwords and sample orders) using sequelize-cli.

3. Validations and Business Rules (HU3/HU4)
   - Prevent creating an order if requested quantity exceeds available stock; decrement stock on success.
   - Unique validations: product code, client email.
   - Zod validation for request bodies/params.

4. Documentation (Swagger)
   - Swagger UI available at `/docs`; OpenAPI spec in `src/docs/openapi.yaml`.
   - LINK: http://localhost:3000/docs

5. Git & Workflow (HU5)
   - Recommended branching strategy: `main`, `feature/*`.
   - CI on GitHub Actions: typecheck + tests with coverage on PR/push.

## Technologies

- Node.js (v22 recommended)
- TypeScript (ESM)
- Express 5
- Sequelize v6 + PostgreSQL
- zod (schemas/validation)
- bcrypt / jsonwebtoken
- Swagger UI (OpenAPI in `src/docs/openapi.yaml`)
- Jest (unit tests with ts-jest ESM)

## Project Structure (key files and folders)

- `app.ts` — application entry, Express setup and middleware registration.
- `src/config/database.config.ts` — Sequelize initialization (SSL-ready) using env vars.
- `src/config/swagger.config.ts` — loads YAML OpenAPI and mounts Swagger UI at `/docs`.
- `src/models/` — Sequelize models (and DTO types in-file):
  - `users.model.ts` — users (id, name, email, password, role)
  - `clients.model.ts` — clients (name, email?, phone?)
  - `products.model.ts` — products (code unique, name, price, stock)
  - `orders.model.ts` — orders (clientId, createdByUserId, total, status)
  - `orderProducts.model.ts` — pivot with quantity and unitPrice
  - `associations.model.ts` — associations wiring
- `src/services/` — business logic (transactional order creation, validations, queries).
- `src/controllers/` — HTTP handlers calling services, consistent responses.
- `src/routes/` — maps endpoints and middlewares to controllers.
- `src/middlewares/` — JWT auth, role checks, and zod validation helpers.
- `src/utils/` — JWT/bcrypt wrappers and centralized error handler.
- `src/docs/openapi.yaml` — OpenAPI spec for Swagger UI at `/docs`.
- `migrations/` — sequelize-cli migrations (Postgres enum + foreign keys + indices).
- `seeders/` — JS seeders (users/clients/products + orders and stock adjustments).

## How To Initialize The Project (Detailed, Step-by-step)

1. Clone the repository

```bash
git clone <repo-url>
cd sportsLine
```

2. Install dependencies

```bash
npm install
```

3. Environment variables

Create a `.env` file in the project root (example):

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=sportsline_development
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false
JWT_SECRET=replace_with_a_secure_secret
JWT_EXPIRES=1h
REFRESH_SECRET=replace_with_a_refresh_secret
REFRESH_EXPIRES=7d
```

4. Create and populate the database (sequelize-cli)

```bash
npm run db:migrate
npm run db:seed
```

5. Start the server (development)

```bash
npm run dev
```

6. Open Swagger UI

```
http://localhost:3000/docs
```

### Docker Compose (optional)

1. Start services

```bash
docker-compose up -d
```

2. Apply migrations and seeders (from your host connected to the compose Postgres)

```bash
npm run db:migrate
npm run db:seed
```

## Authentication Flow

- Register: `POST /api/auth/register` — body: `{ name, email, password }`.
- Login: `POST /api/auth/login` — body: `{ email, password }` → `{ token, refreshToken, user }`.
- Refresh: `POST /api/auth/refresh` — body: `{ refreshToken }` → new tokens.
- Protecting routes: header `Authorization: Bearer <token>`.
- Roles implemented: `admin` y `seller`.

## Key Implementation Details

- Models: Sequelize classes con tipos TS; relaciones via `associations.model.ts`.
- Orders: many-to-many con `order_products` (quantity, unitPrice) y estados `pending | confirmed | cancelled`.
- Creación de pedido: transacción que valida stock, calcula total, descuenta inventario y crea líneas.
- Controladores delgados + `errorHandler` centralizado; validaciones Zod en middlewares.

## Endpoints Overview (Representative)

- Auth
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`

- Clients
  - `GET /api/clients`
  - `POST /api/clients`
  - `GET /api/clients/{id}` — `PUT`/`DELETE`

- Products
  - `GET /api/products`
  - `POST /api/products`
  - `GET /api/products/{id}` — `PUT`/`DELETE`

- Orders
  - `GET /api/order`
  - `POST /api/order`
  - `GET /api/order/{id}`
  - `GET /api/order/by-client-name/{name}`
  - `GET /api/order/by-product-name/{name}`

For exact request/response schemas see `src/docs/openapi.yaml` (Swagger).

## Acceptance Criteria Mapping (HU5)

1. Unit tests with Jest: ≥ 40% coverage (actual ≈ 48%).
2. Clean Code principles: controladores delgados, validación centralizada, eliminación de código no usado.
3. Swagger actualizado con todos los endpoints y ejemplos.
4. README completo (este documento).
5. Control de features en GitHub + CI (GitHub Actions).

## Gitflow And Commits

- Branch strategy: `main` (stable), `feature/*` (work in progress). Merge via PR.
- Commits: se sugiere Conventional Commits (e.g. `feat: add order creation transaction`).

## CI (GitHub Actions)

- Archivo: `.github/workflows/ci.yml`.
- Corre en push/PR a `main` y `feature/*`:
  - Instala dependencias (`npm ci`).
  - Typecheck (`npx tsc -p .`).
  - Tests con cobertura (`npm run test:coverage`).
  - Publica el artefacto de cobertura.

## Troubleshooting (Common Issues)

- DB connection refused: verifica `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y accesos en Postgres.
- JWT secret missing: define `JWT_SECRET` y `REFRESH_SECRET` en `.env`.
- Seeders fallan por duplicados: `npm run db:seed:undo` y luego `npm run db:seed`.
- ESM en Jest: la configuración usa `--experimental-vm-modules` y `ts-jest` (preset ESM).

## Deliverables

1. Source code (este repositorio).
2. Migrations y seeders para inicializar la base de datos.
3. Swagger UI en `/docs` para prueba manual.
4. Pipeline CI en GitHub Actions.

## Developer

- Name: Angélica Cuervo
- Clan: Node.js/Linus
- Email: angiemarin0707@gmail.com
