const fs = require('fs');
const xml2js = require('xml2js');
const util = require('util');

// Read the XML content from a file or variable
const xml = fs.readFileSync('ATAK.one sqaure.kml', 'utf-8'); // Replace with your XML content

const shapes = {
  shapes: []
};

// Create a custom parser with options to handle namespaces
const parser = new xml2js.Parser({
  explicitArray: false,
  mergeAttrs: true,
  explicitRoot: false,
  xmlns: true,
});

// Parse the XML
parser.parseString(xml, (err, result) => {
  if (err) {
    console.error(err);
    return;
  }

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
  console.log(extractedData);
  console.log(util.inspect(extractedData, { showHidden: false, depth: null }));
});

