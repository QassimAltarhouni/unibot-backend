import { NextFunction, Request, Response } from 'express';

/** Minimal Express response double that records status/send calls. */
export const createMockResponse = (locals: Record<string, unknown> = {}) => {
  const res = {
    locals,
    status: jest.fn(),
    send: jest.fn(),
    json: jest.fn(),
  };
  res.status.mockReturnValue(res);
  res.send.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res as typeof res & Response;
};

export const createMockRequest = (overrides: Partial<Request> = {}) =>
  ({ headers: {}, body: {}, query: {}, params: {}, ...overrides }) as Request;

export const createNext = () => jest.fn() as jest.Mock & NextFunction;
