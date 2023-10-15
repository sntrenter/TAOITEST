import * as DocumentPicker from 'expo-document-picker';

import { Button, StyleSheet, Text, View } from 'react-native';
import { PermissionsAndroid, Platform } from 'react-native';

import FileSystem from "expo-file-system"
import { StatusBar } from 'expo-status-bar';
import xml2js from 'xml2js';

let kmlJSON = {};
//let shapes = {
//  shapes: [
//    {name: "", coordinates: [],id:""},
//  ]
//}

async function importKML() {
  console.log('Importing KML file.')
  try {
    const result = await DocumentPicker.getDocumentAsync();
    console.log('DocumentPicker result:', result);
    if (result.canceled === false && result.assets.length !== 0) {
      return result.assets[0].uri;
    } else {
      console.log('Document picking canceled or failed.');
    }
  } catch (error) {
    console.error('Error picking document:', error);
  }
}

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
        const shapes = {
          shapes: []
        };
        console.log("TESTING:::",result.kml.Document[0].Folder[0].Placemark)
        //check if there is a folder in the kml file
        //if(result.kml.Document[0].Folder){
          const placemarks = result.kml.Document[0].Folder[0].Placemark;
        //}else{
        //  const placemarks = result.kml.Document[0].Placemark;
        //}
        
        placemarks.forEach(placemark => {
          const name = placemark.name[0];
          const coordinates = placemark.Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0];
          const id = placemark.$.id; // Get the 'id' attribute
      
          shapes.shapes.push({ name, coordinates, id });
        });
        console.log(shapes)
        return shapes;
      }
    });
  } catch (error) {
    console.error('Error reading KML file:', error);
  }
}


async function ingestKML(){
  let kmluri = await importKML();
  let kmlJSON = await parseKMLFile(kmluri);
}

export default function App() {
  return (
    <View style={styles.container}>
      <Button title="Import KML" onPress={() => ingestKML()} />
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
