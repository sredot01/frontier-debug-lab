// Errors that map to HTTP responses. Anything else is an unexpected 500.
export class ValidationError extends Error {
  constructor(message) { super(message); this.name = 'ValidationError'; this.status = 400; }
}
export class UpstreamError extends Error {
  constructor(message, status) { super(message); this.name = 'UpstreamError'; this.status = status; }
}
