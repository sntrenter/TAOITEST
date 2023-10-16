const fs = require('fs');

// Specify the path to your JSON file
const jsonFilePath = 'kmlJSON (2).json';
let jsonData = null;
fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  Valid_TAOIs = []
  // Parse the JSON data
  jsonData = JSON.parse(data);
  console.log(jsonData);
  Valid_TAOIs = []
  for (let i = 0; i < jsonData.length; i++) {
    //if TAOI[i].points first and last point are the same, remove the last point
    if (jsonData[i].points[0].latitude === jsonData[i].points[jsonData[i].points.length - 1].latitude && jsonData[i].points[0].longitude === jsonData[i].points[jsonData[i].points.length - 1].longitude) {
      jsonData[i].points.pop();
    }
    if (jsonData[i].points.length >= 2 && jsonData[i].points.length <= 20) {
      Valid_TAOIs.push(jsonData[i]);
      console.log(`TAOI  ${i}`);
      console.log("adding to valid TAOIs")
      console.log(jsonData[i]);
      console.log(jsonData[i].points.length)
    }else{
      console.log(`TAOI  ${i}`);
      console.log("not adding to valid TAOIs")
      console.log(jsonData[i]);
      console.log(jsonData[i].points.length)
    }

  }

});


