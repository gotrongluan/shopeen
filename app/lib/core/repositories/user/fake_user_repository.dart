import 'dart:async';
import 'package:shopeen/core/models/models.dart';
import 'package:shopeen/core/repositories/repositories.dart';
import '../../../fake_database.dart';

class FakeUserRepository extends UserRepository {
  User _user;

  Future<User> getUser() async {
    if (_user != null) return _user;
    return Future.delayed(
      const Duration(milliseconds: 300),
      () => _user = FakeDatabase.currentUser,
    );
  }
}
