import React, { useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import * as Location from "expo-location";
import VideoToImages from '../video-to-images/video-to-images';
import OpenAIChatCompletion from '../Chat/Chat';
import ChatUI from '../ChatUI/ChatUI';

export default function Home() {
    const [thumbnails, setThumbnails] = useState([]);
    const [chatHistory, setChatHistory] = useState([]);
    const [status, setStatus] = useState('');

    const ResetChatHistory = () => {
        setChatHistory([]); // Resets chatHistory to an empty array
      };

    return (
        <View style={styles.container}>
            {chatHistory.length > 0 ? (
                <ChatUI  status={status} setStatus={setStatus}  chatHistory={chatHistory} setChatHistory={setChatHistory} ResetChatHistory={ResetChatHistory} />
            ) : (
                <View>
                    <VideoToImages status={status} setStatus={setStatus} thumbnails={thumbnails} setThumbnails={setThumbnails} />
                    <OpenAIChatCompletion  status={status} setStatus={setStatus} chatHistory={chatHistory} setChatHistory={setChatHistory} thumbnails={thumbnails} setThumbnails={setThumbnails} />
                </View>
            )}
    
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'black',
    },
});
