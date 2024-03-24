import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const saveChatHistory = async (chatHistory) => {
  try {
    const jsonValue = JSON.stringify(chatHistory);
    await AsyncStorage.setItem('@chat_history', jsonValue);
    alert('Chat history saved!');
  } catch (e) {
    alert('Failed to save chat history.');
    console.error(e);
  }
};


// This function parses the static message to extract categories, ratings, and descriptions.
const parseMessage = (message) => {
  const parsedData = {
    Posture: { Score: '', Text: '' },
    Grip: { Score: '', Text: '' },
    Form: { Score: '', Text: '' },
    Concentration: { Score: '', Text: '' },
    Tips: { Text: '' }
  };

  let dataFound = false;
  const regex = /(Posture|Grip|Form|Concentration|Tips): ?(\d+\/\d+)?\s*([\s\S]*?)(?=\n\n|\n(?:Posture|Grip|Form|Concentration|Tips):|$)/gm


  let match;
  while ((match = regex.exec(message)) !== null) {
    dataFound = true;
    const keyword = match[1];
    const score = match[2] ? match[2].trim() : ''; // Check if score is defined before calling trim
    const content = match[3] ? match[3].trim() : ''; // Check if content is defined before calling trim

    if (keyword === 'Tips') {
      parsedData[keyword].Text = content;
    } else {
      parsedData[keyword].Score = score;
      parsedData[keyword].Text = content;
    }
  }

  if (!dataFound) {
    return { error: true };
  }

  return parsedData;
};




const ChatUI = (props) => {
  // Call parseMessage to get the structured data
  
  const lastMessage = props.chatHistory[props.chatHistory.length - 1].content
  console.log("last message")
  console.log(lastMessage)
  const parsedMessage = parseMessage(lastMessage);
  console.log("====================================")
  console.log("parsed message")
  console.log(parsedMessage)

  if (parsedMessage.error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>Sorry, I can't help you with this video. Please try again with another one.</Text>
        <TouchableOpacity style={styles.saveButton} onPress={() => {
          props.ResetChatHistory()
          props.setStatus('')
        }
        }>
          <Text style={styles.saveButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => saveChatHistory(props.chatHistory)}
        >
          <Text style={styles.saveButtonText}>Save Chat History</Text>
        </TouchableOpacity>

      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.HeaderContainer}>
      <Image source={require('../../assets/logo.png')} style={styles.image} />
        <TouchableOpacity style={styles.headerText} onPress={() => props.ResetChatHistory()}>
          <Text style={styles.headerText}></Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Pushups</Text>
      {Object.entries(parsedMessage).map(([category, details]) => (
        <View key={category} style={styles.scoreContainer}>
          <Text style={styles.scoreCategory}>{category}</Text>
          {category !== 'Tips' ? ( // Render score and description for categories with scores
            <>
              <Text style={styles.scoreValue}>Score: {details.Score}</Text>
              <Text style={styles.description}>{details.Text}</Text>
            </>
          ) : ( // Render only description for the "Tips" category
            <Text style={styles.description}>{details.Text}</Text>
          )}
        </View>
      ))}
      <TouchableOpacity style={styles.saveButton} onPress={() => {
        props.ResetChatHistory()
        props.setStatus('')
      }
      }>
        <Text style={styles.saveButtonText}>Reset</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.saveButton} // Ensure this uses the correct style
        onPress={() => saveChatHistory(props.chatHistory)}
      >
        <Text style={styles.saveButtonText}>Save Chat History</Text>
    </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'black',
    width: 'auto',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    color: 'white',
    padding: 10,
    fontSize: 18,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20
  },
  scoreContainer: {
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
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
    alignSelf: 'flex-end',
  },
  description: {
    color: 'gray',
    fontSize: 18,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: 'gray',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'flex-end', // Aligns the button to the right
    width: 'auto', // Makes the button only as wide as its content (plus padding)
    paddingHorizontal: 20, // Adjust padding as needed
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    alignItems: 'left'
  },
  errorContainer: {
    flex: 1,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  errorMessage: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
  image: {
    width: 250,
    height: 50, 
    marginTop: 30,
    marginLeft: 110

  }
});

export default ChatUI;
