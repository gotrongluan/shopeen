import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/cupertino.dart';
import 'package:meta/meta.dart';
import 'package:shopeen/core/errors/errors.dart';
import 'package:shopeen/core/repositories/authentication/authentication.dart';

import '../../../service_locator.dart';

part 'auth_form_event.dart';
part 'auth_form_state.dart';

class AuthFormBloc extends Bloc<AuthFormEvent, AuthFormState> {
  final RegExp _usernameRegExp = RegExp(
    r'^([a-zA-Z][a-zA-Z\d_]*){4,}$',
  );

  final RegExp _passwordRegExp = RegExp(
    r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$',
  ); //password must contains at least one character and one number and must be at least 8 character longs.

  final AuthenticationRepository _authenticationRepository =
      locator<AuthenticationRepository>();
  AuthFormBloc() : super(const AuthFormInitial.reset(isLogin: true));

  @override
  Stream<AuthFormState> mapEventToState(
    AuthFormEvent event,
  ) async* {
    if (event is AuthFormSwitched) {
      yield* _mapAuthFormSwitchedToState(event);
    } else if (event is AuthFormUsernameChanged) {
      yield* _mapAuthFormUsernameChangedToState(event);
    } else if (event is AuthFormPasswordChanged) {
      yield* _mapAuthFormPasswordChangedToState(event);
    } else if (event is AuthFormConfirmPasswordChanged) {
      yield* _mapAuthFormConfirmPasswordChangedToState(event);
    } else if (event is AuthFormSubmitted) {
      yield* _mapAuthFormSubmittedToState(event);
    } else if (event is AuthFormResetted) {
      yield* _mapAuthFormResettedToState(event);
    }
  }

  Stream<AuthFormState> _mapAuthFormSwitchedToState(
      AuthFormSwitched formSwitched) async* {
    final currentState = state;
    if (currentState is AuthFormInitial) {
      yield AuthFormInitial.reset(isLogin: !currentState.isLogin);
    }
  }

  Stream<AuthFormState> _mapAuthFormUsernameChangedToState(
      AuthFormUsernameChanged usernameChanged) async* {
    final currentState = state;
    if (currentState is AuthFormInitial) {
      final username = usernameChanged.username;
      if (_isUsernameValid(username) || username == '') {
        yield currentState.copyWith(username: username, isUsernameValid: true);
      } else {
        yield currentState.copyWith(isUsernameValid: false);
      }
    }
  }

  Stream<AuthFormState> _mapAuthFormPasswordChangedToState(
      AuthFormPasswordChanged passwordChanged) async* {
    final currentState = state;
    if (currentState is AuthFormInitial) {
      final password = passwordChanged.password;
      if (_isPasswordValid(password) || password == '') {
        yield currentState.copyWith(password: password, isPasswordValid: true);
      } else {
        yield currentState.copyWith(isPasswordValid: false);
      }
    }
  }

  Stream<AuthFormState> _mapAuthFormConfirmPasswordChangedToState(
      AuthFormConfirmPasswordChanged confirmPasswordChanged) async* {
    final currentState = state;
    if (currentState is AuthFormInitial) {
      final confirmPassword = confirmPasswordChanged.confirmPassword;
      if (confirmPassword == currentState.password || confirmPassword == '') {
        yield currentState.copyWith(isConfirmPasswordMatched: true);
      } else {
        yield currentState.copyWith(isConfirmPasswordMatched: false);
      }
    }
  }

  Stream<AuthFormState> _mapAuthFormSubmittedToState(
      AuthFormSubmitted submitted) async* {
    final currentState = state;
    if (currentState is AuthFormInitial) {
      if (_isValid(currentState)) {
        yield AuthFormSubmitInProgress(isLogin: currentState.isLogin);
        try {
          if (currentState.isLogin) {
            await _authenticationRepository.login(
                username: currentState.username,
                password: currentState.password);
          } else {
            await _authenticationRepository.signup(
                username: currentState.username,
                password: currentState.password);
          }
        } on AuthenticationException catch (ex) {
          yield AuthFormSubmitFailure(
            message: ex.message,
            isLogin: currentState.isLogin,
          );
        }
      }
    }
  }

  Stream<AuthFormState> _mapAuthFormResettedToState(
      AuthFormResetted resetted) async* {
    final currentState = state;
    if (currentState is! AuthFormSubmitInProgress) {
      yield AuthFormInitial.reset(isLogin: currentState.isLogin);
    }
  }

  bool _isUsernameValid(String username) {
    return _usernameRegExp.hasMatch(username);
  }

  bool _isPasswordValid(String password) {
    return _passwordRegExp.hasMatch(password);
  }

  bool _isValid(AuthFormInitial state) {
    return state.isLogin
        ? state.isPasswordValid && state.isUsernameValid
        : state.isPasswordValid &&
            state.isUsernameValid &&
            state.isConfirmPasswordMatched;
  }
}
