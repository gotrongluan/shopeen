part of 'auth_form_bloc.dart';

@immutable
abstract class AuthFormEvent extends Equatable {
  const AuthFormEvent();

  @override
  List<Object> get props => [];
}

class AuthFormSwitched extends AuthFormEvent {}

class AuthFormUsernameChanged extends AuthFormEvent {
  const AuthFormUsernameChanged(this.username);

  final String username;

  @override
  List<Object> get props => [username];
}

class AuthFormPasswordChanged extends AuthFormEvent {
  const AuthFormPasswordChanged(this.password);

  final String password;

  @override
  List<Object> get props => [password];
}

class AuthFormConfirmPasswordChanged extends AuthFormEvent {
  const AuthFormConfirmPasswordChanged(this.confirmPassword);

  final String confirmPassword;

  @override
  List<Object> get props => [confirmPassword];
}

class AuthFormSubmitted extends AuthFormEvent {}

class AuthFormResetted extends AuthFormEvent {}
