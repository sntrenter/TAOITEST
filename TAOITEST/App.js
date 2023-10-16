import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from "expo-file-system"
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import * as Sharing from 'expo-sharing';

import { Alert, Button, Platform, StyleSheet, Text, View } from 'react-native';

import { PermissionsAndroid } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { shareAsync } from 'expo-sharing';
import xml2js from 'xml2js';

let kmlJSON = {};  


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
  console.log('Exporting JSON file.');

  // Convert the kmlJSON object to a JSON string
  const json = JSON.stringify(kmlJSON);
  console.log("json written");

  // Define the file path in the downloads folder
  const downloadFolder = FileSystem.documentDirectory;
  const path = downloadFolder + 'kmlJSON.json';

    console.log("path",path);
    await FileSystem.writeAsStringAsync(path, json);
    console.log("file written");
    await saveFile(path, 'kmlJSON.json','application/json');
}

async function saveFile(uri, filename, mimetype) {
  console.log("save", uri, filename, mimetype);

  async function saveAndWriteFile(directoryUri) {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    const savedFileUri = await FileSystem.StorageAccessFramework.createFileAsync(directoryUri, filename, mimetype);
    
    await FileSystem.writeAsStringAsync(savedFileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
  }

  if (Platform.OS === 'android') {
    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (permissions.granted) {
      await saveAndWriteFile(permissions.directoryUri);
    } else {
      shareAsync(uri);
    }
  } else {
    shareAsync(uri);
  }
}

async function clearJSON(){
  kmlJSON = {};
  Alert.alert("KML JSON object cleared");
  console.log("cleared!",kmlJSON)
}

async function CleanKMLJSON(){
  Valid_TAOIs = []
  for (let i = 0; i < kmlJSON.length; i++) {
    //if TAOI[i].points first and last point are the same, remove the last point
    if (kmlJSON[i].points[0].latitude === kmlJSON[i].points[kmlJSON[i].points.length - 1].latitude && kmlJSON[i].points[0].longitude === kmlJSON[i].points[kmlJSON[i].points.length - 1].longitude) {
      kmlJSON[i].points.pop();
    }
    if (kmlJSON[i].points.length >= 2 && kmlJSON[i].points.length <= 20) {
      Valid_TAOIs.push(kmlJSON[i]);
      console.log(`TAOI  ${i}`);
      console.log("adding to valid TAOIs")
      console.log(kmlJSON[i]);
      console.log(kmlJSON[i].points.length)
    }else{
      console.log(`TAOI  ${i}`);
      console.log("not adding to valid TAOIs")
      console.log(kmlJSON[i]);
      console.log(kmlJSON[i].points.length)
    }

  }
  kmlJSON = Valid_TAOIs;
}

async function ConjureFormatting(){
  const inputJSON = kmlJSON;
  
  const outputJSON = {
    shapes: []
  };
  
  inputJSON.forEach(item => {
    const shape = {
      name: `${item.name}`,
      description: "default description",
      type: 3,
      color: 4,
      lineStyle: 1,
      shapeType: 18,
      userDrawnShapeIsClosed: "true",
      uniqueShapeID: `${item.id}`,
      isACircle: "false",
      radiusInNM: 0,
      taoiPoints: []
    };
  
    item.points.forEach((point, index) => {
        const taoiPoint = {
          latitudeDegrees: point.latitude,
          longitudeDegrees: point.longitude,
          pointConnected: index === 0 ? 0 : 1 // Set pointConnected to 1 for the first point, 0 for others
        };
        shape.taoiPoints.push(taoiPoint);
      });
  
    outputJSON.shapes.push(shape);
  });
  kmlJSON = outputJSON;
}

export default function App() {
  return (
    <View style={styles.container}>
      <Button title="Import KML" onPress={() => ingestKML()} />
      <Button title="Clean KML Data" onPress={() => CleanKMLJSON()} />
      <Button title="Conjure Formatting" onPress={() => ConjureFormatting()} />
      <Button title="clear KML object" onPress={()=>clearJSON()} />
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
