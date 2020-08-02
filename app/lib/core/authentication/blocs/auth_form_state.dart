part of 'auth_form_bloc.dart';

@immutable
abstract class AuthFormState extends Equatable {
  final bool isLogin;

  const AuthFormState({
    this.isLogin = true,
  });

  @override
  List<Object> get props => [isLogin];
}

class AuthFormInitial extends AuthFormState {
  final String username;
  final String password;
  final bool isResetted;
  final bool isUsernameValid;
  final bool isPasswordValid;
  final bool isConfirmPasswordMatched;

  const AuthFormInitial({
    @required this.username,
    @required this.password,
    bool isLogin,
    this.isResetted = false,
    this.isUsernameValid = true,
    this.isPasswordValid = true,
    this.isConfirmPasswordMatched = true,
  })  : assert(username != null),
        assert(password != null),
        super(isLogin: isLogin);

  const AuthFormInitial.reset({bool isLogin})
      : this(username: "", password: "", isLogin: isLogin, isResetted: true);
  AuthFormInitial copyWith({
    username,
    password,
    isLogin,
    isUsernameValid,
    isPasswordValid,
    isConfirmPasswordMatched,
  }) =>
      AuthFormInitial(
        username: username ?? this.username,
        password: password ?? this.password,
        isLogin: isLogin ?? this.isLogin,
        isPasswordValid: isPasswordValid ?? this.isPasswordValid,
        isUsernameValid: isUsernameValid ?? this.isUsernameValid,
        isConfirmPasswordMatched:
            isConfirmPasswordMatched ?? this.isConfirmPasswordMatched,
      );

  @override
  List<Object> get props =>
      super.props +
      [
        username,
        password,
        isResetted,
        isUsernameValid,
        isPasswordValid,
        isConfirmPasswordMatched
      ];

  @override
  String toString() {
    return "AuthFormInital($isUsernameValid, $isPasswordValid)";
  }
}

class AuthFormSubmitInProgress extends AuthFormState {
  const AuthFormSubmitInProgress({
    bool isLogin,
  }) : super(isLogin: isLogin);
}

class AuthFormSubmitSuccess extends AuthFormState {
  const AuthFormSubmitSuccess();
}

class AuthFormSubmitFailure extends AuthFormState {
  final String message;
  const AuthFormSubmitFailure({
    @required this.message,
    bool isLogin,
  })  : assert(message != null),
        super(isLogin: isLogin);
}
