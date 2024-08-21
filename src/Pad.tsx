
import React, {
  useState,
  useRef,
} from 'react';
import type {FC} from 'react';
import {
  Animated
} from 'react-native';
import { LongPressGestureHandler, GestureEvent, State } from 'react-native-gesture-handler';
import { StyleProps } from 'react-native-reanimated';

type PadProps = {
  onPressStart: () => void,
  onPressEnd: () => void,
  style: StyleProps
}

export const Pad: FC = ({
  onPressStart,
  onPressEnd,
  style
}: PadProps) => {
  const [pressed, setPressed] = useState(false);
  const animatedOpacity = useRef(new Animated.Value(1)).current

  const handleStateChange = (event: GestureEvent) => {
    const state: State = event.nativeEvent.state
    if (state === State.BEGAN) {
      setPressed(pressed => {
        if (!pressed) {
          onPressStart();
          Animated.timing(animatedOpacity, {
            toValue: 0.33,
            duration: 75,
            useNativeDriver: true,
          }).start()
        }
        return true
      })
    }
    else if (state !== State.ACTIVE) {
      setPressed(pressed => {
        if (pressed) {
          onPressEnd();
          Animated.timing(animatedOpacity, {
            toValue: 1,
            duration: 75,
            useNativeDriver: true,
          }).start()
        }
        return false
      })
    }
  }

  return (
    <LongPressGestureHandler
      maxDist={100}
      onHandlerStateChange={handleStateChange}
    >
      <Animated.View style={[
        style,
        {
          opacity: animatedOpacity
        }
      ]} />
    </LongPressGestureHandler>
  )
}