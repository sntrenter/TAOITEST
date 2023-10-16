const inputJSON = [
    {
        "name": "Rectangle 1",
        "id": "43347da7-42c7-4206-8df5-6dae743f2fc8Rectangle 1 outer",
        "points": [
            {
                "latitude": 38.17584821917435,
                "longitude": -76.61939921037313
            },
            {
                "latitude": 38.029050893946064,
                "longitude": -71.96983082135502
            },
            {
                "latitude": 39.91045941333189,
                "longitude": -71.8096645242256
            },
            {
                "latitude": 40.06115579443685,
                "longitude": -76.5842265973847
            },
            {
                "latitude": 38.17584821917435,
                "longitude": -76.61939921037313
            }
        ]
    },
    {
        "name": "Rectangle 1",
        "id": "43347da7-42c7-4206-8df5-6dae743f2fc8Rectangle 1 center",
        "points": [
            {
                "latitude": 39.050101223885214,
                "longitude": -74.24532311817119
            }
        ]
    },
    {
        "name": "Polygon 1",
        "id": "87a36b8d-7e8f-4a19-9832-26154ee0c8d9",
        "points": [
            {
                "latitude": 38.17584821917435,
                "longitude": -76.61939921037313
            },
            {
                "latitude": 38.029050893946064,
                "longitude": -71.96983082135502
            },
            {
                "latitude": 39.91045941333189,
                "longitude": -71.8096645242256
            },
            {
                "latitude": 40.06115579443685,
                "longitude": -76.5842265973847
            },
            {
                "latitude": 38.17584821917435,
                "longitude": -76.61939921037313
            },
            {
                "latitude": 37.84272662838921,
                "longitude": -76.55235481975643
            },
            {
                "latitude": 37.68700930486498,
                "longitude": -76.38567712956457
            },
            {
                "latitude": 38.12937657325528,
                "longitude": -75.99074745130164
            },
            {
                "latitude": 38.17584821917435,
                "longitude": -76.61939921037313
            },
            {
                "latitude": 38.029050893946064,
                "longitude": -71.96983082135502
            },
            {
                "latitude": 39.91045941333189,
                "longitude": -71.8096645242256
            },
            {
                "latitude": 40.06115579443685,
                "longitude": -76.5842265973847
            },
            {
                "latitude": 38.17584821917435,
                "longitude": -76.61939921037313
            },
            {
                "latitude": 37.84272662838921,
                "longitude": -76.55235481975643
            },
            {
                "latitude": 37.68700930486498,
                "longitude": -76.38567712956457
            },
            {
                "latitude": 38.12937657325528,
                "longitude": -75.99074745130164
            },
            {
                "latitude": 37.84272662838921,
                "longitude": -76.55235481975643
            },
            {
                "latitude": 37.68700930486498,
                "longitude": -76.38567712956457
            },
            {
                "latitude": 37.68700930486498,
                "longitude": -76.38567712956457
            },
            {
                "latitude": 37.68700930486498,
                "longitude": -76.38567712956457
            }
        ]
    }
  ];
  
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
  

  
  // You can now use or log the outputJSON
  console.log(JSON.stringify(outputJSON, null, 2));