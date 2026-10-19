/**
 * Test replacement for the `config` package (mapped in jest.config.js).
 * Provides deterministic values so tests never read a real .env file.
 */
const toBase64 = (value: string) => Buffer.from(value).toString('base64');

export const TEST_SECRETS = {
  access: 'test-access-token-secret',
  refresh: 'test-refresh-token-secret',
  forget: 'test-forget-password-secret',
};

const values: Record<string, unknown> = {
  mongo: { url: 'mongodb://127.0.0.1:27017/unibot-test' },
  server: { port: 0 },
  jwt: {
    accessTokenPrivateKey: toBase64(TEST_SECRETS.access),
    refreshTokenPrivateKey: toBase64(TEST_SECRETS.refresh),
    forgetTokenPrivateKey: toBase64(TEST_SECRETS.forget),
  },
  logLevel: 'silent',
  smtp: {
    user: 'test@example.com',
    pass: 'test',
    host: 'localhost',
    port: 465,
    secure: true,
  },
};

const config = {
  get<T>(key: string): T {
    if (!(key in values)) {
      throw new Error(`Configuration property "${key}" is not defined`);
    }
    return values[key] as T;
  },
  has(key: string): boolean {
    return key in values;
  },
};

export default config;
