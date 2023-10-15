import * as DocumentPicker from 'expo-document-picker';

import { Alert, Button, StyleSheet, Text, View } from 'react-native';
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

async function parseKMLFile_old(uri) {
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
        KMLJSON = JSON.stringify(result.Document.Folder.Placemark, null, 2);
        KMLparsed = JSON.parse(KMLJSON);
        const extractedData = [];
      
        KMLparsed.forEach(item => {
          const name = item.name._; // Get the 'name' property from the object
          const id = item.id.value; // Get the 'id' property from the object
          let points = [];
      
          // Check if the object contains 'Polygon' data
          if (item.Polygon) {
              const coordinates = item.Polygon.outerBoundaryIs.LinearRing.coordinates._;
              // Split the coordinates into an array and convert to an array of objects, removing undefined or NaN entries
              points = coordinates.split(' ')
                  .map(coord => {
                      const [longitude, latitude] = coord.split(',').map(parseFloat);
                      if (!isNaN(longitude) && !isNaN(latitude)) {
                          return { latitude, longitude };
                      }
                      return null;
                  })
                  .filter(point => point !== null);
          }
          // Check if the object contains 'Point' data
          else if (item.Point) {
              const coordinates = item.Point.coordinates._;
              // Split the coordinates into an array and convert to an array of objects, removing undefined or NaN entries
              points = coordinates.split(' ')
                  .map(coord => {
                      const [longitude, latitude] = coord.split(',').map(parseFloat);
                      if (!isNaN(longitude) && !isNaN(latitude)) {
                          return { latitude, longitude };
                      }
                      return null;
                  })
                  .filter(point => point !== null);
          }
      
          extractedData.push({ name, id, points });
      });
      return extractedData;
      }
    });
  } catch (error) {
    console.error('Error reading KML file:', error);
  }
}

async function parseKMLFile(uri) {
  try {
    // Fetch the KML data from the specified URI
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Failed to fetch KML data from ${uri}`);
    }
    const kmlData = await response.text();

    // Create a custom parser with options to handle namespaces
    const parser = new xml2js.Parser({
      explicitArray: false,
      mergeAttrs: true,
      explicitRoot: false,
      xmlns: true,
    });

    // Parse the XML
    let result;
    parser.parseString(kmlData, (err, parsedResult) => {
      if (err) {
        throw err;
      }
      result = parsedResult;
    });

    // Wait for parsing to complete
    //require('deasync').loopWhile(() => !result);

    if (!result.Document || !result.Document.Folder || !result.Document.Folder.Placemark) {
      throw new Error('Invalid KML format');
    }

    const KMLJSON = JSON.stringify(result.Document.Folder.Placemark, null, 2);
    const KMLparsed = JSON.parse(KMLJSON);
    const extractedData = [];

    KMLparsed.forEach(item => {
      const name = item.name._;
      const id = item.id.value;
      let points = [];

      if (item.Polygon) {
        const coordinates = item.Polygon.outerBoundaryIs.LinearRing.coordinates._;
        points = coordinates.split(' ')
          .map(coord => {
            const [longitude, latitude] = coord.split(',').map(parseFloat);
            if (!isNaN(longitude) && !isNaN(latitude)) {
              return { latitude, longitude };
            }
            return null;
          })
          .filter(point => point !== null);
      } else if (item.Point) {
        const coordinates = item.Point.coordinates._;
        points = coordinates.split(' ')
          .map(coord => {
            const [longitude, latitude] = coord.split(',').map(parseFloat);
            if (!isNaN(longitude) && !isNaN(latitude)) {
              return { latitude, longitude };
            }
            return null;
          })
          .filter(point => point !== null);
      }

      extractedData.push({ name, id, points });
    });
    console.log("extractedData",extractedData)
    return extractedData;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function ingestKML(){
  let kmluri = await importKML();
  kmlJSON = await parseKMLFile(kmluri);
  console.log(kmlJSON);
}

async function ExportJSON() {
  console.log('Exporting JSON file.')
}

async function clearJSON(){
  kmlJSON = {};
  Alert.alert("KML JSON object cleared");
}

export default function App() {
  return (
    <View style={styles.container}>
      <Button title="Import KML" onPress={() => ingestKML()} />
      <Button color = {(Object.keys(kmlJSON).length === 0)?"grey":""} title="clear KML object" onPress={()=>clearJSON()} />
      <Text>Open up App.js to start working on your app!</Text>
      <Text>Hello World</Text>
      <Text>Test</Text>
        <Button title="Export JSON" onPress={() => ExportJSON()} />
        <Button title="check JSON" onPress={() => console.log("CHECK",kmlJSON)} /> 
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
  disabledButton: {
    opacity: 0.5,
    backgroundColor: 'grey',
  },
  enabledButton: {
    opacity: 1,
    backgroundColor: 'green',
  },
});
