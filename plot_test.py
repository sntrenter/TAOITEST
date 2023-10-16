import matplotlib.pyplot as plt

# Coordinates of the points
latitude = [38.17584821917435, 38.029050893946064, 39.91045941333189, 40.06115579443685, 38.17584821917435]
longitude = [-76.61939921037313, -71.96983082135502, -71.8096645242256, -76.5842265973847, -76.61939921037313]

# Plot the polygon
plt.figure()
plt.plot(longitude, latitude, marker='o', linestyle='-')
plt.fill(longitude, latitude, 'b', alpha=0.3)

plt.xlabel("Longitude")
plt.ylabel("Latitude")
plt.title("Polygon Visualization")
plt.grid(True)

plt.show()