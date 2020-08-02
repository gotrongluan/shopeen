import 'dart:async';
import 'package:meta/meta.dart';
import 'package:shopeen/core/errors/errors.dart';
import '../../../core/models/models.dart';
import '../../enums/enums.dart';
import 'authentication_repository.dart';
import '../../../fake_database.dart';
import 'package:uuid/uuid.dart';

class FakeAuthenticationRepository extends AuthenticationRepository {
  final _controller = StreamController<AuthenticationStatus>();

  Stream<AuthenticationStatus> get status async* {
    await Future<void>.delayed(
        const Duration(seconds: 1)); //Mocking fetching jwt from secure storage
    yield AuthenticationStatus
        .unauthenticated; //currently fixed, in the future will be based on the presence of jwt in storage
    yield* _controller.stream; //on later calls, no longer check
  }

  @override
  Future<void> login({
    @required String username,
    @required String password,
  }) async {
    assert(username != null);
    assert(password != null);
    await Future.delayed(const Duration(milliseconds: 300), () {
      print(FakeDatabase.users[0].username +
          " " +
          FakeDatabase.users[0].password);
      User user = FakeDatabase.users.firstWhere(
        (element) =>
            element.username == username && element.password == password,
        orElse: () => null,
      );
      if (user != null) {
        FakeDatabase.currentUser = user;
        _controller.add(AuthenticationStatus.authenticated);
      } else {
        throw AuthenticationException.login();
      }
    });
  }

  @override
  Future<void> signup({
    @required String username,
    @required String password,
  }) async {
    assert(username != null);
    assert(password != null);
    await Future.delayed(const Duration(milliseconds: 300), () {
      if (FakeDatabase.users
              .indexWhere((element) => element.username == username) !=
          -1) {
        throw AuthenticationException.signup();
      }
      FakeDatabase.users.add(User(Uuid().v4(), username, password));
    });
  }

  @override
  void logout() {
    FakeDatabase.currentUser = null;
    _controller.add(AuthenticationStatus.unauthenticated);
  }

  void dispose() => _controller.close();
}
