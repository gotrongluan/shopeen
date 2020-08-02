import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:geolocator/geolocator.dart';
import 'package:shopeen/core/authentication/authentication.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class HomePage extends StatefulWidget {
  static Route route() {
    return MaterialPageRoute<void>(builder: (_) => HomePage());
  }

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  GoogleMapController _controller;
  final Geolocator _geolocator = Geolocator();
  Position _currentPosition;
  String _currentAddress;
  static const LatLng _center = const LatLng(10.762622, 106.660172);
  void _onMapCreated(GoogleMapController controller) {
    _controller = controller;
  }

  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
  }

  Future<void> _getCurrentLocation() async {
    await _geolocator
        .getCurrentPosition(desiredAccuracy: LocationAccuracy.high)
        .then((Position position) async {
      print(position);
      setState(() {
        _currentPosition = position;
        print('CURRENT POS: $_currentPosition');
        _controller.animateCamera(
          CameraUpdate.newCameraPosition(
            CameraPosition(
              target: LatLng(position.latitude, position.longitude),
              zoom: 18.0,
            ),
          ),
        );
      });
      // await _getAddress();
    }).catchError((e) {
      print(e);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: GoogleMap(
        onMapCreated: _onMapCreated,
        myLocationButtonEnabled: false,
        mapType: MapType.normal,
        zoomGesturesEnabled: true,
        zoomControlsEnabled: false,
        initialCameraPosition: CameraPosition(
          target: _center,
          zoom: 11.0,
        ),
      ),
      floatingActionButton: FloatingActionButton(
        foregroundColor: Colors.black,
        backgroundColor: Colors.orange[100],
        splashColor: Colors.orange,
        onPressed: () {
          _controller.animateCamera(
            CameraUpdate.newCameraPosition(
              CameraPosition(
                target: LatLng(
                  _currentPosition.latitude,
                  _currentPosition.longitude,
                ),
                zoom: 18.0,
              ),
            ),
          );
        },
        child: SizedBox(
          width: 56,
          height: 56,
          child: Icon(Icons.my_location),
        ),
      ),
      // Center(
      //   child: Column(
      //     mainAxisSize: MainAxisSize.min,
      //     children: <Widget>[
      //       Text(
      //         'UserID: ${context.bloc<AuthenticationBloc>().state.user.id}',
      //       ),
      //       RaisedButton(
      //         child: const Text('Logout'),
      //         onPressed: () {
      //           context
      //               .bloc<AuthenticationBloc>()
      //               .add(AuthenticationLogoutRequested());
      //         },
      //       ),
      //     ],
      //   ),
      // ),
    );
  }
}
