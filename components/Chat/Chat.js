import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, ScrollView, StyleSheet, Image } from 'react-native';
import { OPENAI_API_KEY } from '@env';
import OpenAI from "openai";
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator'
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

const MODEL = "gpt-4-vision-preview"

const OpenAIChatCompletion = (props) => {
    const [userInput, setUserInput] = useState('');
    // const resizedUris = useResizedImages('../../examples/goodPushUp/');
    const [chainOfThought, setChainOfThought] = useState([]); // Store chat history
    // const [imageBase64, setImageBase64] = useState(null);
    const examplePushupFrames = [
        "../../examples/goodPushUp/pushup-frame-001.jpg",
        "../../examples/goodPushUp/pushup-frame-006.jpg",
        "../../examples/goodPushUp/pushup-frame-011.jpg",
        "../../examples/goodPushUp/pushup-frame-016.jpg",
        "../../examples/goodPushUp/pushup-frame-021.jpg",
        "../../examples/goodPushUp/pushup-frame-026.jpg",
        "../../examples/goodPushUp/pushup-frame-031.jpg"
    ]
    let examplePushupFramesBase64 = [];
    const systemPrompt =
    `You are an excersicing assistant who is looking to give tips and explainations for
    different regiments, exercises and workouts. The feedback should be given in 4 different categories, posture, grip, form and concentration.
    Each of the 4 categories should have a score from 1 to 10, with 10 being the best and 1 being the worst.
    Along with each score should also be feedback in a clear and concise member. Here is an example of a feedback:
    You are an excersicing assistant who is looking to give tips and explainations for
    different regiments, exercises and workouts. The feedback should be given in 4 different categories, posture, grip, form and concentration.
    Each of the 4 categories should have a score from 1 to 10, with 10 being the best and 1 being the worst.
    Along with each score should also be feedback in a clear and concise member. Here is an example format you can use in the response, only 1
    set of these is needed:
    Posture: {number less than or equal to 10}/10
    {feedback}
    Grip:{number less than or equal to 10}/10
    {feedback}
    Form:{number less than or equal to 10}/10
    {feedback}
    Concentration:{number less than or equal to 10}/10
    {feedback}
   
    Tips:
        - {feedback}
        - {feedback}
    The following assistant message is an example of a response to a user message
    `

    const openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
    });
    useEffect(() => {
        (async () => {
          
            const frame1 = Asset.fromModule(require("../../examples/goodPushUp/pushup-frame-001.jpg"));
            const frame2 = Asset.fromModule(require("../../examples/goodPushUp/pushup-frame-006.jpg"));
            const frame3 = Asset.fromModule(require("../../examples/goodPushUp/pushup-frame-011.jpg"));
            const frame4 = Asset.fromModule(require("../../examples/goodPushUp/pushup-frame-016.jpg"));
            const frame5 = Asset.fromModule(require("../../examples/goodPushUp/pushup-frame-021.jpg"));
            const frame6 = Asset.fromModule(require("../../examples/goodPushUp/pushup-frame-026.jpg"));
            const frame7 = Asset.fromModule(require("../../examples/goodPushUp/pushup-frame-031.jpg"));
            let frames = [frame1, frame2, frame3, frame4, frame5, frame6, frame7];
            for (const frame of frames) {
                const manipResult = await manipulateAsync(
                    frame.uri,
                    [{ resize: { height: 512, width: 512 } }],
                    { compress: 1, base64: true }
                );
                examplePushupFramesBase64.push(manipResult.base64);
            }
            let exampleMessage = [
                
                {
                    "role": "user", "content": [
                        { type: "text", text: "These are frames from a video. Assess the push-up form and give feedback" },
                        { type: "image_url", image_url: { "url": `data:image/jpeg;base64,${examplePushupFramesBase64[0]}`, "detail": "low" } },
                        { type: "image_url", image_url: { "url": `data:image/jpeg;base64,${examplePushupFramesBase64[1]}`, "detail": "low" } },
                        { type: "image_url", image_url: { "url": `data:image/jpeg;base64,${examplePushupFramesBase64[2]}`, "detail": "low" } },
                        { type: "image_url", image_url: { "url": `data:image/jpeg;base64,${examplePushupFramesBase64[3]}`, "detail": "low" } },
                        { type: "image_url", image_url: { "url": `data:image/jpeg;base64,${examplePushupFramesBase64[4]}`, "detail": "low" } },
                        { type: "image_url", image_url: { "url": `data:image/jpeg;base64,${examplePushupFramesBase64[5]}`, "detail": "low" } },
                        { type: "image_url", image_url: { "url": `data:image/jpeg;base64,${examplePushupFramesBase64[6]}`, "detail": "low" } }
                    ]
                },
                {
                    "role": "assistant", "content": `
                    Sure, I can help guide you through what an ideal assessment might look like for someone's push-up form based on common criteria, despite not being able to see actual frames.

                    Posture: 9/10
                    Your body is almost perfectly straight from your head to your heels, which is excellent. Ensure your head is in a neutral position. The head should be positioned so the ears are in line with the shoulders

                    Grip: 8/10
                    Your hands are placed slightly wider than shoulder-width apart, which is good for a standard push-up. However, make sure your wrists are directly under your shoulders to fully engage your chest and reduce the strain on your wrists.

                    Form: 10/10
                    You're doing a great job keeping your body straight and engaging your core. You are going until your chest almost touches the ground for the full range of motion, and then fully extend your arms on the way up. Your movement in thi.

                    Concentration: 10/10
                    It seems like you're fully focused on your exercise, maintaining good form throughout the push-ups without letting your mind wander. This level of concentration helps in executing the exercise correctly and safely.
                    
                    Tips:
                    - Overall you are doing amazing! The only thing I would suggest is looking into different push-up forms to target different muscle groups
                    `
                }

            ]
            setChainOfThought(exampleMessage);
            // console.log("examplePushupFramesBase64 length", examplePushupFramesBase64.length);

        })();


    })
    const getOpenAIResponse = async () => {
        props.setStatus('Generating response...');
        let messages = [
            { "role": "system", "content": systemPrompt },
            // ...chainOfThought,
            ...props.chatHistory,

        ];

        let userMessage = {"role": "user","content":  [{ type: "text", text: "These are frames from a video. Assess the push-up form and give feedback" }] };
        for (const thumbnail of props.thumbnails) {

            const manipResult = await manipulateAsync(
                thumbnail,
                [{resize: {height: 512, width: 512}}],
                { compress: 1, base64: true }
            );

            let resizedImgBase64 = manipResult.base64;
            let resizedUri = `data:image/jpeg;base64,${resizedImgBase64}`;

            userMessage.content.push(
                {
                    type: "image_url",
                    image_url: {
                        "url": resizedUri,
                        "detail": "low"
                    },
                }
            );
        }
        messages.push(userMessage);
        // console.log("messages length", messages.length)
        // console.log(messages);
        // console.log("thumbnails lengths", props.thumbnails.length)

        console.log("API Call...")
        const completion = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: messages,
            "max_tokens": 500

        });
        console.log("API Call Done")
        

        const newMessage = {
            role: "assistant",
            content: completion.choices[0].message.content,
        };
        console.log("newMessage")
        console.log(newMessage)
        props.setChatHistory([...props.chatHistory, newMessage]);
        setUserInput('');
        // console.log(messages);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.chatContainer}>
                {props.chatHistory.map((msg, index) => (
                    <Text key={index} style={msg.role === "user" ? styles.userMsg : styles.aiMsg}>
                        {msg.content}
                    </Text>
                ))}
            </ScrollView>
            {/* <TextInput
                style={styles.input}
                onChangeText={text => setUserInput(text)}
                value={userInput}
                placeholder="Type your message here"
                onSubmitEditing={getOpenAIResponse} // Allow sending by keyboard return key
            /> */}
            <Button title="Generate" onPress={getOpenAIResponse} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    chatContainer: {
        flex: 1,
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
    userMsg: {
        textAlign: 'right',
        marginVertical: 2,
    },
    aiMsg: {
        textAlign: 'left',
        marginVertical: 2,
    },
});
// Give tips on this push up form
export default OpenAIChatCompletion;