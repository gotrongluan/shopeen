import 'package:get_it/get_it.dart';
import 'package:shopeen/core/repositories/repositories.dart';

//Dependency injection for repository
GetIt locator = GetIt.instance;

void setupLocator() {
  locator.registerSingleton<AuthenticationRepository>(
      FakeAuthenticationRepository());
  locator.registerSingleton<UserRepository>(FakeUserRepository());
}
