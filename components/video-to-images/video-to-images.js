import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import * as VideoThumbnails from 'expo-video-thumbnails';
import SavedPage from '../Saved/DisplaySaved';

export default function VideoToText(props) {
  const videoRef = useRef(null);
  const [videoUri, setVideoUri] = useState(null);
  const [videoStatus, setVideoStatus] = useState('');
  const [showSavedPage, setShowSavedPage] = useState(false);

  const handleVideoSelection = async () => {
    try {
      setVideoStatus('Picking video...');
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });

      if (!result.cancelled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setVideoUri(uri);
        setVideoStatus('Video picked, loading...');
      } else {
        setVideoStatus('Video picking was cancelled.');
      }
    } catch (error) {
      console.error(`Error picking video: ${error}`);
      setVideoStatus('An error occurred while picking the video.');
    }
  };

  const handleCameraLaunch = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    
      if (cameraPermission.status === 'granted') {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        });
    
        if (!result.cancelled && result.assets && result.assets.length > 0) {
          const uri = result.assets[0].uri;
          setVideoUri(uri);
          setVideoStatus('Video recorded, loading...');
        } else {
          setVideoStatus('Video recording was cancelled.');
        }
      } else {
        setVideoStatus('Camera permission not granted.');
      }
    } catch (error) {
      console.error(`Error launching camera: ${error}`);
      setVideoStatus('An error occurred while launching the camera.');
    }
  };
  
  

  const generateThumbnails = async (uri, duration) => {
    try {
      setVideoStatus('Generating thumbnails...');
      let generatedThumbnails = [];
      for (let i = 0; i < duration; i += 1000) { // Every second
        const thumbnailResult = await VideoThumbnails.getThumbnailAsync(uri, { time: i });
        if (thumbnailResult.uri) {
          generatedThumbnails.push(thumbnailResult.uri);
        }
      }
      props.setThumbnails(generatedThumbnails);
      setVideoStatus('Thumbnails generated');
    } catch (e) {
      console.warn(`Error generating thumbnails: ${e}`);
      setVideoStatus('An error occurred while generating thumbnails.');
    }
  };

  const toggleSavedFeedback = () => {
    setShowSavedPage(!showSavedPage); // This function toggles the state for showing the saved feedback
  };

  if (showSavedPage) {
    return (
      <View style={{ flex: 1 }}>
        <SavedPage /> {/* Here is your saved feedback page being rendered */}
        <TouchableOpacity onPress={toggleSavedFeedback} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text> {/* Make sure text is wrapped in <Text> */}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.image} />
      <TouchableOpacity onPress={handleVideoSelection} style={styles.button}>
        <Text style={styles.buttonText}>Pick a Video</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleCameraLaunch} style={[styles.button, styles.buttonSecondary]}>
        <Text style={styles.buttonText}>Record a Video</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleSavedFeedback} style={styles.button}>
        <Text style={styles.buttonText}>View Saved Feedback</Text>
      </TouchableOpacity>
      <Text>{videoStatus}</Text>
      {videoUri && (
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: videoUri }}
          useNativeControls
          resizeMode="contain"
          onLoadStart={() => setVideoStatus('Video loading...')}
          onLoad={async (status) => {
            const duration = status.durationMillis;
            setVideoStatus('Video loaded, generating thumbnails...');
            await generateThumbnails(videoUri, duration);
          }}
          onError={(error) => {
            console.error(`Video loading error: ${error.message}`);
            setVideoStatus(`Error loading video: ${error.message}`);
          }}
        />
      )}
      <Text>{props.status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  video: {
    width: 300,
    height: 200,
    marginBottom: 20,
    backgroundColor: 'black'
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonSecondary: {
    backgroundColor: '#6c757d', // A secondary button color
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 350, // Adjusted width
    height: 70,
    marginBottom: 20,
    marginLeft: 80
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10, 
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
  },
});
