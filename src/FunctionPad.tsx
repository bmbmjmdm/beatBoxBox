
import React, {
  useState,
  useRef,
} from 'react';
import {
  StyleSheet
} from 'react-native';
import type {FC} from 'react';
import { Pad } from './Pad'

type FunctionPadProps = {
  onPress: () => void,
  color: string,
}

/*
  3-4 functions:
  1st- record. When pressed, ALL pads will light up red (as will as this function button). When one pad is pressed, the rest will return to normal while that one remains red. It will begin recording. When released, the recording finishes and the colors return to normal
  2nd- hang. when pressed, it will change its color to indicate hanging. now all pads do not need to be held in order to play their audio fully
  3rd- cut. when pressed, it will change its color to indicate cutting. now all pads will cut off all other pads when pressed
  4th- save/load banks
*/


export const FunctionPad: FC = ({
  onPress,
  color
}: FunctionPadProps) => {
  const time = useRef(0)

  const onPressStart = () => {
    time.current = Date.now()
    onPress()
  }

  // if the user does a long press, we call the onPress function a second time.
  // This allows the user to "temporarily" enable a function by holding it vs flipping it like a switch by tapping it
  const onPressEnd = () => {
    if (Date.now() - time.current > 250) {
      onPress()
    }
  }

  return (
    <Pad
      onPressStart={onPressStart}
      onPressEnd={onPressEnd}
      style={{
        ...styles.smallButton,
        backgroundColor: color
      }}
    />
  )
}

const styles = StyleSheet.create({
  smallButton: {
    height: 100,
    width: 75,
    borderRadius: 10,
    borderColor: "#222222",
    borderWidth: 3,
  },
});