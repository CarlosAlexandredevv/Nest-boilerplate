---
name: add-nest-module
description: Adds a Nest feature module in this boilerplate (entity, repository, module, DTOs, controller with tenant JWT and roles). Use when the user asks to create a module, resource, CRUD, or new domain entity.
---

# Add Nest module

Do not rediscover architecture. Follow this checklist. Copy patterns from `tenants` (HTTP) and `UserRepository` (persistência).

## Checklist

1. **Entity** `src/infra/entities/<name>.entity.ts` — uuid PK, timestamps. Tenant-scoped data: coluna `tenantId` + `ManyToOne` Tenant `onDelete: 'CASCADE'`. Never trust tenantId do body; use `req.tenant.id`.
2. **Registrar entity** em `entities` (`src/config/typeorm.config.ts`) e no `DataSource` (`src/config/data-source.ts`).
3. **Migration** — `npm run migration:generate -- src/infra/migration/Create<Name>`. Do not enable `synchronize`.
4. **Repository** `src/infra/repositories/<name>.repository.ts` — `@Injectable()`, `InjectRepository`, queries no repo injetado. Dado do tenant: filtrar `tenantId`. Transação no service (`em.getRepository`), não no repo.
5. **DTOs** em `src/modules/<name>/dto/` — class-validator, alinhado ao ValidationPipe global.
6. **Service + controller** em `src/modules/<name>/`. Guard já é global. Use `@Roles(...)` se não for qualquer user autenticado. `@CurrentUser()` se precisar do JWT. `@Public()` só se for realmente público (e ainda assim o middleware exige `X-Subdomain`, exceto o caso especial de register).
7. **Module** — `providers: [XxxService, XxxRepository]`. `TypeOrmModule.forFeature` já está no `DatabaseModule` global **depois** da entity estar em `entities`. Importar `AuthModule` só se precisar de `TenantRepository`.
8. **AppModule** — `imports: [..., XxxModule]`.
9. Listagens/mutations: filtrar por `request.tenant.id` (super admin no tenant do header ainda é aquele tenant, a menos que a tarefa peça visão global — aí `@Roles(SUPER_ADMIN)` e sem filtro).

## Não fazer

- Novo guard JWT (já existe).
- Role no `User`.
- `Repository<T>` injetado no service pulando o repo do projeto.
- Segunda forma de identificar tenant (subdomínio na URL, query param) sem o usuário pedir.

## Exemplo mínimo de query

```typescript
findAll(tenantId: string) {
  return this.repo().find({ where: { tenantId } });
}
```

Controller: `findAll(@Req() req: RequestWithUser)` → `this.service.findAll(req.tenant!.id)`.
