import 'package:shopeen/core/models/models.dart';

abstract class UserRepository {
  Future<User> getUser();
}
