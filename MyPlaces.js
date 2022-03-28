import React from 'react';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList } from 'react-native';
import { Input, Button, ListItem } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

export default function MyPlaces({ navigation }) {

const database = SQLite.openDatabase('osoitekirjadb.db');
const [address, setAddress] = useState('');
const [addresses, setAddresses] = useState([]);

useEffect(() => {
  database.transaction(tx => {
    tx.executeSql('create table if not exists addresses (id integer primary key not null, address text);');
  }, null, updateList);
}, [])

const save = () => {
  database.transaction(tx => {
    tx.executeSql('insert into addresses (address) values (?);',
      [address]);
  }, null, updateList)
}

const updateList = () => {
  database.transaction(tx => {
    tx.executeSql('select * from addresses;', [], (_, { rows })=>
    setAddresses(rows._array)
    );
  }, null, null);
}

const deleteAddress = (id) => {
  database.transaction(tx => {
    tx.executeSql('delete from addresses where id = ?;', [id]
    );
  }, null, updateList)
}

const renderItem = ({item}) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.address}</ListItem.Title>
        <ListItem.Subtitle>show on map</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron
        name="arrow-forward"
        color="blue"
        onPress={() => navigation.navigate('Map', {paramKey: address})}
      />
      <ListItem.Chevron 
        name="delete"
        color="red"
        onPress={() => deleteAddress(item.id)}
      />
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <Input placeholder='Type in address' label='PLACEFINDER' onChangeText={address => setAddress(address)} />
      <Button onPress={save} title="SAVE" iconPosition='left' backgroundColor='grey' style={{ height: 100, marginTop: 10 }} icon={{
        type: 'ionicon',
        name: 'save',
        size: 18,
        color: 'white',
        }}>
      </Button>
      <FlatList style={{marginLeft: "5%", marginTop: "5%", width: "100%"}}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        data={addresses}
        />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
   },
});
