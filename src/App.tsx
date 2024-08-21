/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import type {FC} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
  View,
  Platform,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AudioPad } from './AudioPad'
import { FunctionPad } from './FunctionPad'
import PermissionsRN from 'react-native-permissions'

const App: FC =() => {
  const [hasPermissions, setHasPermissions] = useState(false)
  const [isSelectingBankToRecord, setIsSelectingBankToRecord] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isCuttingOn, setIsCuttingOn] = useState(false)
  const [isHangingOn, setIsHangingOn] = useState(false)
  const allAudioPads = useRef([null, null, null, null, null, null]).current

  const toggleRecording = () => {
    // you cannot toggle recording while recording is in progress. user will have to lift their finger and let the AudioPad handle it
    if (isRecording) return
    setIsSelectingBankToRecord(selecting => !selecting)
  }

  const toggleCutting = () => {
    setIsCuttingOn(cutting => !cutting)
  }

  const toggleHanging = () => {
    setIsHangingOn(hanging => !hanging)
  }

  // all audio pads share the same basic structure, so we can generate them in a factory here
  const onBankSelected = () => {
    setIsSelectingBankToRecord(false)
    setIsRecording(true)
  }
  const onDoneRecording = () => {
    setIsRecording(false)
  }
  // TODO make this await all the cutting?
  const broadcastCutAudio = () => {
    for (const pad of allAudioPads) {
      pad.cutAudio()
    }
  }
  const audiPadProps = {
    isSelectingBankToRecord,
    isRecordingSomewhere: isRecording,
    onBankSelected,
    onDoneRecording,
    broadcastCutAudio,
    isCuttingOn,
    isHangingOn,
  }

  const audioPadFactory = (num) => {
    return (
      <AudioPad
        ref={(ref) => allAudioPads[num] = ref}
        {...audiPadProps}
      />
    )
  }

  // When the app starts, check permissions
  // TODO handle ios
  useEffect(() => {
    const asyncFun = async () => {
      if (Platform.OS === 'android') {
        try {
          const grants = await PermissionsRN.requestMultiple([
            PermissionsRN.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            PermissionsRN.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            PermissionsRN.PERMISSIONS.ANDROID.RECORD_AUDIO,
          ]);
      
          if (
            grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsRN.RESULTS.GRANTED &&
            grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsRN.RESULTS.GRANTED &&
            grants['android.permission.RECORD_AUDIO'] ===
            PermissionsRN.RESULTS.GRANTED
          ) {
            setHasPermissions(true);
          } else {
            Alert.alert("Permissions required, please enable")
            setTimeout(asyncFun, 3000)
            return;
          }
        } catch (err) {
          return;
        }
      }
    }
    asyncFun()
  }, [])
  
  // dont display the app until permissions are granted
  if (!hasPermissions) {
    return (
      <SafeAreaView style={styles.backgroundStyle}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar
            barStyle={'light-content'}
            backgroundColor={styles.backgroundStyle.backgroundColor}
          />
        </GestureHandlerRootView>
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={styles.backgroundStyle.backgroundColor}
        />
        <View style={styles.buttonRow}>
          <FunctionPad onPress={toggleRecording} color={isRecording || isSelectingBankToRecord ? "red" : "white"} />
          <FunctionPad onPress={toggleHanging} color={isHangingOn ? "blue" : "white"} />
          <FunctionPad onPress={toggleCutting} color={isCuttingOn ? "purple" : "white"} />
        </View>
        <View style={styles.buttonRow}>
          { audioPadFactory(0) }
          { audioPadFactory(1) }
        </View>
        <View style={styles.buttonRow}>
          { audioPadFactory(2) }
          { audioPadFactory(3) }     
        </View>
        <View style={styles.buttonRow}>
          { audioPadFactory(4) }
          { audioPadFactory(5) }
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: "#555555",
    flex: 1,
  },
  buttonRow: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-around"
  },
});

export default App;
