module.exports = {
    assets: ['./assets'],
    //link react-native-fs
    dependencies: {
        'react-native-fs': {
            platforms: {
                android: null, // disable Android platform, other platforms will still autolink if provided
            },
        },
    },
  };