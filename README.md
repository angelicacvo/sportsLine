# SportsLine API

## About
This repository contains the backend implementation for SportsLine: an API to manage users, clients, products and sales orders. The implementation focuses on data integrity, role-based access, transactional order creation (with stock decrement), and clear documentation so that the reviewer can deploy and validate the solution quickly.

The stack is Node.js (TypeScript), Express, Sequelize (Postgres) and JWT. The code is organized by concern: models, services, controllers, routes, middlewares and utilities.

## Objective
# SportsLine API

## About
This repository contains the backend implementation for SportsLine: an API to manage users, clients, products, and sales orders. The implementation focuses on data integrity, role-based access, transactional order creation (with stock decrement), and clear documentation so that the reviewer can deploy and validate the solution quickly.

The stack is Node.js (TypeScript), Express, Sequelize (Postgres), and JWT. The code is organized by concern: models, services, controllers, routes, middlewares, and utilities.

## Objective
Provide a RESTful API that allows SportsLine to:

- register and manage clients and products
- create sales orders composed of products (many-to-many with quantities and unit prices)
- validate and decrement stock automatically during order creation
- query order history and filter by client or product name
- secure endpoints with jwt-based authentication and role-based authorization (admin/seller)

## Requirements Implemented

1. authentication (hu2)
   - user registration and login
   - jwt access + refresh tokens and refresh endpoint
   - route protection via jwt middleware and role checks (admin/seller)

2. persistence
   - postgresql as the relational database
   - sequelize orm for models, associations, and queries
   - migrations and seeders (with bcrypt-hashed passwords and sample orders) using sequelize-cli

3. validations and business rules (hu3/hu4)
   - prevent creating an order if requested quantity exceeds available stock; decrement stock on success
   - unique validations: product code, client email
   - zod validation for request bodies/params

4. documentation (swagger)
   - swagger ui available at `/docs`; openapi spec in `src/docs/openapi.yaml`
  - link: http://localhost:3001/docs

5. git & workflow (hu5)
   - recommended branching strategy: `main`, `feature/*`
   - ci on github actions: typecheck + tests with coverage on pr/push

## Technologies

- node.js (v22 recommended)
- typescript (esm)
- express 5
- sequelize v6 + postgresql
- zod (schemas/validation)
- bcrypt / jsonwebtoken
- swagger ui (openapi in `src/docs/openapi.yaml`)
- jest (unit tests with ts-jest esm)

## Project Structure (Key Files and Folders)

- `app.ts` — application entry, express setup, and middleware registration
- `src/config/database.config.ts` — sequelize initialization (ssl-ready) using env vars
- `src/config/swagger.config.ts` — loads yaml openapi and mounts swagger ui at `/docs`
- `src/models/` — sequelize models (and dto types in-file)
  - `users.model.ts` — users (id, name, email, password, role)
  - `clients.model.ts` — clients (name, email?, phone?)
  - `products.model.ts` — products (code unique, name, price, stock)
  - `orders.model.ts` — orders (clientId, createdByUserId, total, status)
  - `orderProducts.model.ts` — pivot with quantity and unitPrice
  - `associations.model.ts` — associations wiring
- `src/services/` — business logic (transactional order creation, validations, queries)
- `src/controllers/` — http handlers calling services, consistent responses
- `src/routes/` — maps endpoints and middlewares to controllers
- `src/middlewares/` — jwt auth, role checks, and zod validation helpers
- `src/utils/` — jwt/bcrypt wrappers and centralized error handler
- `src/docs/openapi.yaml` — openapi spec for swagger ui at `/docs`
- `migrations/` — sequelize-cli migrations (postgres enums, foreign keys, indices)
- `seeders/` — js seeders (users/clients/products + orders and stock adjustments)

## Setup

1) clone the repository

```bash
git clone <repo-url>
cd sportsLine
```

2) install dependencies

```bash
npm install
```

3) environment variables

create a `.env` file in the project root (example):

```env
PORT=3001
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=sportsline_development
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false
JWT_SECRET=replace_with_a_secure_secret
JWT_REFRESH_SECRET=replace_with_a_refresh_secret
```

4) database migrations and seeders (sequelize-cli)

```bash
npm run db:migrate
npm run db:seed
```

5) start the server (development)

```bash
npm run dev
```

6) open swagger ui

```
http://localhost:3001/docs
```

### Docker Compose (Optional)

1) start services

```bash
docker-compose up -d
```

2) apply migrations and seeders (from your host connected to the compose postgres)

```bash
npm run db:migrate
npm run db:seed
```

## Authentication Flow

- register: `POST /api/auth/register` — body: `{ name, email, password }`
- login: `POST /api/auth/login` — body: `{ email, password }` → `{ token, refreshToken, user }`
- refresh: `POST /api/auth/refresh` — body: `{ refreshToken }` → new tokens
- protected routes: header `authorization: bearer <token>`
- roles: `admin`, `seller`

## Key Implementation Details

- models: sequelize classes with typescript types; relationships via `associations.model.ts`
- orders: many-to-many using `order_products` (quantity, unitPrice) and statuses `pending | confirmed | cancelled`
- order creation: single transaction that validates stock, computes total, decrements inventory, and creates line items
- thin controllers + centralized `errorHandler`; request validation using zod middlewares

## Endpoints Overview

- auth
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`

- client
  - `GET /api/client`
  - `GET /api/client/{id}`
  - `POST /api/client`
  - `PUT /api/client/{id}`
  - `DELETE /api/client/{id}`

- product
  - `GET /api/product`
  - `GET /api/product/{id}`
  - `POST /api/product`
  - `PUT /api/product/{id}`
  - `DELETE /api/product/{id}`

- order
  - `GET /api/order`
  - `POST /api/order`
  - `GET /api/order/{id}`
  - `PUT /api/order/{id}` (update status)
  - `DELETE /api/order/{id}`

- user (admin only)
  - `GET /api/user`
  - `GET /api/user/{id}`
  - `POST /api/user`
  - `PUT /api/user/{id}`
  - `DELETE /api/user/{id}`

for exact request/response schemas see `src/docs/openapi.yaml` (swagger).

## Acceptance Criteria (HU5)

1. unit tests with jest: ≥ 40% coverage (current ≈ 65%)
2. clean code principles: thin controllers, centralized validation, removal of unused code
3. swagger updated with all endpoints and examples
4. complete readme (this document)
5. feature control on github + ci (github actions)

## Git Flow and Commits

- branch strategy: `main` (stable), `feature/*` (work in progress). merge via pr
- commits: conventional commits are recommended (e.g., `feat: add order creation transaction`)

## CI (GitHub Actions)

- file: `.github/workflows/ci.yml`
- runs on push/pr to `main` and `feature/*`:
  - install dependencies (`npm ci`)
  - typecheck (`npx tsc -p .`)
  - tests with coverage (`npm run test:coverage`)
  - publish coverage artifact

## Troubleshooting

- db connection refused: verify `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and postgres access
- jwt secret missing: set `JWT_SECRET` and `JWT_REFRESH_SECRET` in `.env`
- seeders fail due to duplicates: `npm run db:seed:undo` then `npm run db:seed`
- jest esm: configuration uses `--experimental-vm-modules` and `ts-jest` (esm preset)

## Deliverables

1. source code (this repository)
2. migrations and seeders to initialize the database
3. swagger ui at `/docs` for manual testing
4. ci pipeline on github actions

## Developer

- name: angélica cuervo
- clan: node.js/linus
- email: angiemarin0707@gmail.com
