import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { View, TextInput } from 'react-native';
import { Alert } from 'react-native';

export default function Map({ route }) {
    
    const { address } = route.params;
    const [region, setRegion] = useState({latitude: 0, longitude: 0, latitudeDelta: 0.0322, longitudeDelta: 0.0221});
    const [marker, setMarker] = useState({latitude: 0, longitude: 0});

    const find = () => {
        fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=GkEqJLn1cPA00uh3KiwTnq4L0DtqJuGS&location=${address}`)
        .then(res => res.json())
        .then(json => json.results[0].locations[0].latLng)
        .then(latLng => {
          setRegion({ ...region, latitude: latLng.lat, longitude: latLng.lng });
          setMarker({ latitude: latLng.lat, longitude: latLng.lng });
        })
        .catch(error => {
          Alert.alert('Error', error)
        })
      }

    return(
        <View styles={styles.container}>
            <MapView 
                style={styles.map}
                region={region}>
                <Marker 
                    coordinate={marker}
                />
            </MapView>
            <TextInput style={styles.textfield} onChangeText={ address => setAddress(address) } />
            <Button onPress={find} title='Show' />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    textfield: {
        borderBottomWidth: 1,
        width: "100%",
        marginBottom: 10
      }
  });