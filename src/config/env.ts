export const env = {
  port: Number(process.env.PORT) || 3001,
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/ulearn',
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  superAdminEmail: process.env.SUPER_ADMIN_EMAIL || 'admin@localhost',
  superAdminPassword: process.env.SUPER_ADMIN_PASSWORD || 'changeme123',
};
