# RN Liveness

A React Native app for face-based identity checks. A user registers with their ID number and a selfie or ID card photo. Later they verify themselves with a guided liveness check followed by a face match.

## How it works

1. **Enter an ID number** on the home screen
2. **Register** with a selfie or with a photo of the ID card
3. **Liveness check:** on-device face detection guides the user through five prompts (look right, look left, look up, smile, full face) with a progress indicator
4. **Verify:** the captured face is sent to the verification service and matched against the registered one

## Tech stack

React Native 0.79 (CLI) · React 19 · TypeScript · Vision Camera with face detection · React Navigation · Axios · Jest

## Getting started

Requires Node.js 18 or newer and a working [React Native environment](https://reactnative.dev/docs/set-up-your-environment) (Android Studio, and Xcode for iOS).

```bash
npm install

# iOS only
cd ios && bundle install && bundle exec pod install && cd ..

npm start          # start Metro
npm run android    # or: npm run ios
```

The app needs camera permission. Set the verification service URL in `src/constants/Constants.ts` (`BackendService.REGISTRATION_SERVICE`).

## Project structure

```
src/
  screens/      Home, registration (selfie or ID card), liveness and verification
  api/          Registration and verification requests
  components/   Header, ID number input, buttons and toasts
  constants/    Colours, service URL and route names
```
