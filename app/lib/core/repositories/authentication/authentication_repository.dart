import 'package:meta/meta.dart';
import 'package:shopeen/core/enums/enums.dart';

abstract class AuthenticationRepository {
  Stream<AuthenticationStatus> get status;

  Future<void> login({
    @required String username,
    @required String password,
  });
  Future<void> signup({
    @required String username,
    @required String password,
  });

  void logout();

  void dispose() {}
}
