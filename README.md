# Nest boilerplate

API NestJS 11 multi-tenant (Postgres + JWT). O tenant da request é o header `X-Subdomain` (slug), não o path.

## Stack

- Nest 11, TypeORM 0.3, PostgreSQL 16
- Passport JWT, bcrypt, class-validator
- Schema só por migration (`synchronize` desligado)

## Subir

```bash
docker compose up -d
cp .env.example .env
npm install
npm run migration:run
npm run start:dev
```

API em `http://localhost:3001`.

Variáveis: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN` (lista separada por vírgula), `JWT_EXPIRES_IN`, `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`, `PORT`. Fora de `development`, `JWT_SECRET` (não o valor `secret`) e `CORS_ORIGIN` são obrigatórios.

O boot cria o super admin e o tenant `platform` se ainda não existirem.

## Uso

Toda rota (exceto `OPTIONS`) precisa de `X-Subdomain`.

| Método | Rota | Auth |
|---|---|---|
| `POST` | `/auth/register` | público; slug do body = header |
| `POST` | `/auth/login` | público; tenant do header tem que existir |
| `*` | `/tenants` | Bearer + role `SUPER_ADMIN` |

Register cria tenant + usuário (ou reusa o user se email/senha baterem) + membership `ADMIN`. Login devolve `access_token`, `user` e `tenant`. Super admin loga em qualquer slug sem membership.

Login no tenant da plataforma:

```bash
curl -s http://localhost:3001/auth/login \
  -H 'Content-Type: application/json' \
  -H 'X-Subdomain: platform' \
  -d '{"email":"<SUPER_ADMIN_EMAIL>","password":"<SUPER_ADMIN_PASSWORD>"}'
```

## Layout

```
src/modules/auth      login, register, JWT
src/modules/tenants   CRUD (super admin)
src/infra             entities, repos, middleware, seed, migrations
src/guards            JWT + roles (globais)
```

Migrations: `npm run migration:generate -- src/infra/migration/Nome` e `npm run migration:run`.

## Agente

Mapa do projeto para o Cursor: `AGENTS.md` e `.cursor/rules`. Módulo novo: skill `.cursor/skills/add-nest-module`.
