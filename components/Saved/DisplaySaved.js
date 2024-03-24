import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseMessage } from '../ChatUI/ChatUI';
 

/// NOT WORKING YET
const SavedPage = () => {
  const [savedChatHistory, setSavedChatHistory] = useState([]);

  useEffect(() => {
    const loadSavedChatHistory = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@chat_history');
        setSavedChatHistory(jsonValue != null ? JSON.parse(jsonValue) : []);
      } catch (e) {
        alert('Failed to load chat history.');
        console.error(e);
      }
    };

    loadSavedChatHistory();
  }, []);

  return (
    <FlatList
      data={savedChatHistory}
      renderItem={({ item }) => {
        const parsedMessage = parseMessage(item.content);
        return (
          <View style={styles.scoreContainer}>
            {Object.entries(parsedMessage).map(([category, details]) => (
              <View key={category} style={styles.categoryContainer}>
                <Text style={styles.scoreCategory}>{category}</Text>
                {category !== 'Tips' ? (
                  <>
                    <Text style={styles.scoreValue}>Score: {details.Score}</Text>
                    <Text style={styles.description}>{details.Text}</Text>
                  </>
                ) : (
                  <Text style={styles.description}>{details.Text}</Text>
                )}
              </View>
            ))}
          </View>
        );
      }}
      keyExtractor={(item, index) => String(index)}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#000',
  },
  scoreContainer: {
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10, // Adds spacing between items
  },
  categoryContainer: {
    marginBottom: 10, // Space between categories
  },
  scoreCategory: {
    color: '#90EE90', // Light green color
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    color: 'gray',
    fontSize: 18,
  },
  // Add other styles as needed to match ChatUI
});

export default SavedPage;
