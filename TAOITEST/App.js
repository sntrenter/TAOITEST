import * as DocumentPicker from 'expo-document-picker';

import { Button, StyleSheet, Text, View } from 'react-native';
import { PermissionsAndroid, Platform } from 'react-native';

import FileSystem from "expo-file-system"
import { StatusBar } from 'expo-status-bar';
import xml2js from 'xml2js';

async function parseKMLFile(uri) {
  console.log('Parsing KML file:', uri);
  try {
    const response = await fetch(uri);
    const kmlData = await response.text();
    console.log('KML data:', kmlData);
    xml2js.parseString(kmlData, (error, result) => {
      if (error) {
        console.error('Error parsing KML:', error);
      } else {
        console.log('Parsed KML object:', result);
        // You can work with the parsed KML object here
      }
    });
  } catch (error) {
    console.error('Error reading KML file:', error);
  }
}




async function importKML() {
  console.log('Importing KML file.')
  try {
    const result = await DocumentPicker.getDocumentAsync();
    console.log('DocumentPicker result:', result);
    if (result.canceled === false && result.assets.length !== 0) {
      parseKMLFile(result.assets[0].uri);
    } else {
      console.log('Document picking canceled or failed.');
    }
  } catch (error) {
    console.error('Error picking document:', error);
  }
}


export default function App() {
  return (
    <View style={styles.container}>
      <Button title="Import KML" onPress={() => importKML()} />
      <Text>Open up App.js to start working on your app!</Text>
      <Text>Hello World</Text>
      <Text>Test</Text>
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
});
