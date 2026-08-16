# Pulse

AI exercise-form coach. Record a set — or pick one from your camera roll — and get scored feedback on posture, grip, form, and focus.

React Native + Expo prototype. Frames are pulled from the clip and sent to GPT-4 Vision.

## What it does

- Capture a set or import a clip
- Sample key frames from the video
- Score four categories from 1–10: posture, grip, form, concentration
- Return notes you can use on the next set

## Stack

| Layer | Choice |
| --- | --- |
| App | Expo ~50, React Native 0.73 |
| Analysis | OpenAI GPT-4 Vision |
| Frames | `expo-av`, `expo-video-thumbnails`, `expo-image-manipulator` |

## Run

```bash
git clone https://github.com/mihiranan/Pulse.git
cd Pulse
npm install
```

Add an `.env` with:

```
OPENAI_API_KEY=your_key
```

Then:

```bash
npx expo start
```

Press `i` / `a`, or scan the QR code with Expo Go.

## Status

Portfolio prototype. Analysis depends on an OpenAI key and a network connection. Feedback quality varies by exercise and camera angle.
