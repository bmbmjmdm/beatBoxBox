
import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  StyleSheet
} from 'react-native';
import type {FC} from 'react';
import { Pad } from './Pad'
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

type AudioPadProps = {
  isSelectingBankToRecord: boolean,
  isRecordingSomewhere: boolean,
  onBankSelected: () => void,
  onDoneRecording: () => void,
  broadcastCutAudio: () => void,
  isCuttingOn: boolean,
  isHangingOn: boolean,
}

/*
  default behavior is to hold a pad to play it. when released, it will cut itself off. pressing another tab will not cause current ones to stop.
  hanging function can change this. when hanging is enabled, releasing a pad will not cut itself off.
  cutting function can change this as well. when cutting, pressing a pad will cut all other pads off. 
*/

const AudioPadInternal: FC = ({
  isSelectingBankToRecord,
  // TODO do we need to disable playback/etc while recording is happening?
  isRecordingSomewhere,
  onBankSelected,
  onDoneRecording,
  broadcastCutAudio,
  isCuttingOn,
  isHangingOn,
}: AudioPadProps, ref) => {
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const [recording, setRecording] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [hasAudio, setHasAudio] = useState(false)

  // audio recording and playback functions
  const recordAudio = async () => {
    setRecording(true)
    await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener((e) => {
    });
  }

  const stopRecordingAudio = async () => {
    audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecording(false)
    setHasAudio(true)
  }

  const playAudio = async () => {
    setPlaying(true)
    await audioRecorderPlayer.startPlayer();
    audioRecorderPlayer.addPlayBackListener((e) => {
    });
  }

  const stopPlayingAudio = () => {
    audioRecorderPlayer.removePlayBackListener();
    audioRecorderPlayer.stopPlayer();
    setPlaying(false)
  }

  // pad press handlers
  const onPressStart = () => {
    if (isSelectingBankToRecord) {
      onBankSelected()
      recordAudio()
    }
    else if (hasAudio) {
      if (isCuttingOn) {
        // TODO may need to be awaited
        broadcastCutAudio()
      }
      playAudio()
    }
    else if (isCuttingOn) {
      // TODO may need to be awaited
      broadcastCutAudio()
    }
  }

  const onPressEnd = () => {
    if (recording) {
      onDoneRecording()
      stopRecordingAudio()
    }
    else if (playing && !isHangingOn) {
      stopPlayingAudio()
    }
  }

  // expose our stopPlayingAudio function to our parent so broadcastCutAudio can call it from siblings
  useImperativeHandle(ref, () => ({
    cutAudio: stopPlayingAudio
  }));

  const currentBackgroundColor = recording || isSelectingBankToRecord ? "red"
                                : playing ? "green"
                                : hasAudio ? "yellow"
                                : "white"

  return (
    <Pad
      onPressStart={onPressStart}
      onPressEnd={onPressEnd}
      style={{
        ...styles.bigButton,
        backgroundColor: currentBackgroundColor,
      }}
    />
  )
}

const styles = StyleSheet.create({
  bigButton: {
    height: 150,
    width: 110,
    borderRadius: 10,
    borderColor: "#222222",
    borderWidth: 3,
  },
});

export const AudioPad = forwardRef(AudioPadInternal);