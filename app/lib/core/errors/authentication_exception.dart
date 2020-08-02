class AuthenticationException implements Exception {
  final String message;

  AuthenticationException([this.message = 'Authentication Error']);
  AuthenticationException.login() : this('Wrong username or password');
  AuthenticationException.signup() : this('Username already exists');
  String toString() => "AuthenticationException: $message";
}
