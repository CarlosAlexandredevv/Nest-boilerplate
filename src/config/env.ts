export function resolveEnv(
  jwtSecret = process.env.JWT_SECRET,
  corsOrigin = process.env.CORS_ORIGIN,
  nodeEnv = process.env.NODE_ENV,
): { jwtSecret: string; corsOrigins: string[] } {
  const env = nodeEnv || 'development';
  const secret = jwtSecret && jwtSecret !== 'secret' ? jwtSecret : undefined;
  const corsOrigins = (corsOrigin ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (env !== 'development') {
    const missing = [
      !secret && 'JWT_SECRET',
      !corsOrigins.length && 'CORS_ORIGIN',
    ].filter(Boolean);
    if (missing.length) throw new Error(`${missing.join(', ')} is required`);
    return { jwtSecret: secret!, corsOrigins };
  }

  return {
    jwtSecret: secret || 'secret',
    corsOrigins: corsOrigins.length ? corsOrigins : ['http://localhost:3000'],
  };
}

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
