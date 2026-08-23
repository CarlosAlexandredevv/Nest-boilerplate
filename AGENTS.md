# Nest boilerplate — contexto do agente

Não reexplore o repo para “entender o projeto”. Este arquivo é o mapa. Abra código só do que a tarefa altera.

API Nest 11 + TypeORM + Postgres, multi-tenant por header `X-Subdomain` (slug). Porta `3001`. `synchronize: false` — schema só via migration.

## Dados

- `User` — conta global (email único), `isSuperAdmin`
- `Tenant` — `slug` único
- `Membership` — user↔tenant, role `ADMIN` | `USER`, unique `(userId, tenantId)`

## Request

1. `TenantMiddleware` exige `X-Subdomain`. `POST /auth/register` só guarda o slug (tenant ainda não existe).
2. Demais rotas: resolve tenant ou 404.
3. `JwtAuthGuard` global; `@Public()` libera. JWT `tenantId` deve bater com o header (`canAccessTenant`); super admin passa em qualquer tenant.
4. `RoleGuard`: `@Roles(...)`; super admin ignora a lista.

## Rotas

- `POST /auth/register`, `POST /auth/login` — públicos
- `/tenants` CRUD — `@Roles(SUPER_ADMIN)`

Seed no boot: user `SUPER_ADMIN_EMAIL` + tenant slug `platform`.

## Onde mexer

| Tarefa | Pasta |
|---|---|
| Auth / JWT | `src/modules/auth`, `src/guards` |
| Tenants | `src/modules/tenants` |
| Persistência | `src/infra/entities`, `repositories`, `migration` |
| Tipos de auth | `src/models/user.ts` |
| Env | `src/config/env.ts` |

Módulo novo: siga a skill `add-nest-module`. Reuse repos/decorators existentes. Não invente `AppController` nem `synchronize: true`.
