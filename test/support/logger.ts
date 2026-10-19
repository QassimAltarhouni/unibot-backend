/** Silent logger used in tests instead of pino (mapped in jest.config.js). */
const noop = () => undefined;

const Logger = {
  info: noop,
  warn: noop,
  error: noop,
  debug: noop,
  trace: noop,
  fatal: noop,
};

export default Logger;
