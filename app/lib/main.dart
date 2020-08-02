import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:shopeen/core/utils/bloc_observer.dart';
import 'package:shopeen/service_locator.dart';
import 'app.dart';

void main() {
  Bloc.observer = SimpleBlocObserver();
  setupLocator();
  runApp(ShopeenApp());
}
