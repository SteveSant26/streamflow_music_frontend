export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: any
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class ValidationError extends AuthError {
  constructor(message: string, originalError?: any) {
    super(message, 'VALIDATION_ERROR', originalError);
    this.name = 'ValidationError';
  }
}

export class LoginError extends AuthError {
  constructor(message: string, originalError?: any) {
    super(message, 'LOGIN_ERROR', originalError);
    this.name = 'LoginError';
  }
}

export class RegisterError extends AuthError {
  constructor(message: string, originalError?: any) {
    super(message, 'REGISTER_ERROR', originalError);
    this.name = 'RegisterError';
  }
}

export class SessionError extends AuthError {
  constructor(message: string, originalError?: any) {
    super(message, 'SESSION_ERROR', originalError);
    this.name = 'SessionError';
  }
}

export class NetworkError extends AuthError {
  constructor(message: string, originalError?: any) {
    super(message, 'NETWORK_ERROR', originalError);
    this.name = 'NetworkError';
  }
}
