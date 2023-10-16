import matplotlib.pyplot as plt
import json

# Your JSON data
data = {
    "shapes": [
        {
            "name": "Rectangle 1",
            "description": "default description",
            "type": 3,
            "color": 4,
            "lineStyle": 1,
            "shapeType": 18,
            "userDrawnShapeIsClosed": "true",
            "uniqueShapeID": "61b5b32e-7e61-448c-9436-a9754822cc40Rectangle 1 outer",
            "isACircle": "false",
            "radiusInNM": 0,
            "taoiPoints": [
                {
                    "latitudeDegrees": 26.40996594729837,
                    "longitudeDegrees": -81.41896665041044,
                    "pointConnected": 0
                },
                {
                    "latitudeDegrees": 25.742579507324663,
                    "longitudeDegrees": -80.48699079992909,
                    "pointConnected": 1
                },
                {
                    "latitudeDegrees": 26.491594976349635,
                    "longitudeDegrees": -79.82069889811231,
                    "pointConnected": 1
                },
                {
                    "latitudeDegrees": 27.163253400291833,
                    "longitudeDegrees": -80.75488308666743,
                    "pointConnected": 1
                }
            ]
        },
        {
            "name": "Rectangle 2",
            "description": "default description",
            "type": 3,
            "color": 4,
            "lineStyle": 1,
            "shapeType": 18,
            "userDrawnShapeIsClosed": "true",
            "uniqueShapeID": "634c0054-f1d8-4aff-a121-e6ea50db55a3Rectangle 2 outer",
            "isACircle": "false",
            "radiusInNM": 0,
            "taoiPoints": [
                {
                    "latitudeDegrees": 25.47556815279694,
                    "longitudeDegrees": -83.32072210613445,
                    "pointConnected": 0
                },
                {
                    "latitudeDegrees": 26.121699248019638,
                    "longitudeDegrees": -84.4388533046993,
                    "pointConnected": 1
                },
                {
                    "latitudeDegrees": 26.78762833580984,
                    "longitudeDegrees": -83.96920387976246,
                    "pointConnected": 1
                },
                {
                    "latitudeDegrees": 26.137894750333306,
                    "longitudeDegrees": -82.84733826037225,
                    "pointConnected": 1
                }
            ]
        },
        {
            "name": "Shape 1",
            "description": "default description",
            "type": 3,
            "color": 4,
            "lineStyle": 1,
            "shapeType": 18,
            "userDrawnShapeIsClosed": "true",
            "uniqueShapeID": "a7157add-2b06-48e5-91fe-c3bd8bc15f00Shape 1 outer",
            "isACircle": "false",
            "radiusInNM": 0,
            "taoiPoints": [
                {
                    "latitudeDegrees": 23.77259542199768,
                    "longitudeDegrees": -84.98961216509127,
                    "pointConnected": 0
                },
                {
                    "latitudeDegrees": 23.62128547947202,
                    "longitudeDegrees": -83.39631203995975,
                    "pointConnected": 1
                },
                {
                    "latitudeDegrees": 22.66867638716698,
                    "longitudeDegrees": -83.05710836677649,
                    "pointConnected": 1
                },
                {
                    "latitudeDegrees": 23.527545603716312,
                    "longitudeDegrees": -82.3341833054333,
                    "pointConnected": 1
                },
                {
                    "latitudeDegrees": 23.613087667190452,
                    "longitudeDegrees": -80.58500647109797,
                    "pointConnected": 1
                },
                {
                    "latitudeDegrees": 22.786814695531476,
                    "longitudeDegrees": -80.03796175788138,
                    "pointConnected": 1
                },
                {
                    "latitudeDegrees": 23.644967534780267,
                    "longitudeDegrees": -79.53405374851363,
                    "pointConnected": 1
                },
                {
                    "latitudeDegrees": 23.819646019906486,
                    "longitudeDegrees": -77.942106629235,
                    "pointConnected": 1
                },
                {
                    "latitudeDegrees": 22.580259542182084,
                    "longitudeDegrees": -77.86947522358165,
                    "pointConnected": 1
                },
                {
                    "latitudeDegrees": 21.799328207209758,
                    "longitudeDegrees": -81.05444015465325,
                    "pointConnected": 1
                },
                {
                    "latitudeDegrees": 22.437627837513737,
                    "longitudeDegrees": -85.20941351893575,
                    "pointConnected": 1
                }
            ]
        }
    ]
}

# Create a Matplotlib figure and axis
fig, ax = plt.subplots()

# Loop through the shapes and plot them
for shape in data["shapes"]:
    points = shape["taoiPoints"]
    lats = [point["latitudeDegrees"] for point in points]
    lons = [point["longitudeDegrees"] for point in points]
    ax.plot(lons, lats)

# Set the aspect ratio to 'equal' for correct geospatial visualization
ax.set_aspect('equal')

# Show the plot
plt.show()