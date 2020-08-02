import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shopeen/core/authentication/blocs/blocs.dart';

class AuthForm extends StatefulWidget {
  @override
  _AuthFormState createState() => _AuthFormState();
}

class _AuthFormState extends State<AuthForm> {
  final _usernameController = TextEditingController();

  final _passwordController = TextEditingController();

  final _confirmPasswordController = TextEditingController();
  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<AuthFormBloc, AuthFormState>(
      builder: (context, state) => Form(
        child: Container(
          decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16.0), color: Colors.white),
          margin: EdgeInsets.symmetric(horizontal: 20),
          padding: EdgeInsets.only(top: 20, bottom: 5, right: 20, left: 20),
          child: Column(
            children: <Widget>[
              Image.asset('assets/images/logo.png'),
              SizedBox(
                height: 20,
              ),
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'Username',
                  errorText: state is AuthFormInitial && !state.isUsernameValid
                      ? 'Invalid Username'
                      : null,
                ),
                keyboardType: TextInputType.text,
                controller: _usernameController,
                onChanged: (value) => context
                    .bloc<AuthFormBloc>()
                    .add(AuthFormUsernameChanged(value)),
              ),
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'Password',
                  errorText: state is AuthFormInitial && !state.isPasswordValid
                      ? 'Invalid Password'
                      : null,
                ),
                obscureText: true,
                keyboardType: TextInputType.text,
                controller: _passwordController,
                onChanged: (value) => context
                    .bloc<AuthFormBloc>()
                    .add(AuthFormPasswordChanged(value)),
              ),
              if (!state.isLogin)
                TextFormField(
                  enabled: !state.isLogin,
                  decoration: InputDecoration(
                    labelText: 'Confirm Password',
                    errorText: state is AuthFormInitial &&
                            !state.isConfirmPasswordMatched
                        ? "Password does not matched"
                        : null,
                  ),
                  keyboardType: TextInputType.text,
                  obscureText: true,
                  controller: _confirmPasswordController,
                  onChanged: (value) => context
                      .bloc<AuthFormBloc>()
                      .add(AuthFormConfirmPasswordChanged(value)),
                ),
              SizedBox(
                height: 30,
              ),
              if (state is AuthFormSubmitInProgress)
                CircularProgressIndicator()
              else
                RaisedButton(
                  color: Colors.orange,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(5)),
                  child: Text(
                    state.isLogin ? 'LOGIN' : 'SIGNUP',
                    style: TextStyle(color: Colors.white, fontSize: 17),
                  ),
                  padding: EdgeInsets.symmetric(
                    horizontal: 25.0,
                    vertical: 12.0,
                  ),
                  onPressed: () =>
                      context.bloc<AuthFormBloc>().add(AuthFormSubmitted()),
                ),
              FlatButton(
                onPressed: () =>
                    context.bloc<AuthFormBloc>().add(AuthFormSwitched()),
                child: Text('${state.isLogin ? 'SIGNUP' : 'LOGIN'} INSTEAD!'),
              )
            ],
          ),
        ),
      ),
      listener: (BuildContext context, AuthFormState state) {
        if (state is AuthFormSubmitSuccess) {
          showDialog(
            context: context,
            builder: (_) => AlertDialog(
              title: Text("Success"),
              actions: <Widget>[
                FlatButton(
                  child: Text('Close me!'),
                  onPressed: () {
                    Navigator.of(context).pop();
                    context.bloc<AuthFormBloc>().add(AuthFormResetted());
                  },
                )
              ],
            ),
          );
        } else if (state is AuthFormSubmitFailure) {
          showDialog(
            context: context,
            builder: (_) => AlertDialog(
              title: Text("Failure"),
              actions: <Widget>[
                FlatButton(
                  child: Text('Close me!'),
                  onPressed: () {
                    Navigator.of(context).pop();
                    context.bloc<AuthFormBloc>().add(AuthFormResetted());
                  },
                )
              ],
            ),
          );
        } else if (state is AuthFormInitial && state.isResetted) {
          _usernameController.clear();
          _passwordController.clear();
          _confirmPasswordController.clear();
        }
      },
    );
  }
}
