import { Animated, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'

type Props = {
	currentVolume: number
}

const Wave = (props: Props) => {
	const currentVolume = props?.currentVolume ?? 0
	const maxVolume = 100;

	const animationRef = React.useRef(new Animated.Value(0)).current

	const polAnim = animationRef.interpolate({
		inputRange: [0, 1],
		outputRange: [1, 2],
		extrapolate: 'clamp'
	})

	const startAnimations = useCallback(() => {
		Animated.timing(animationRef, {
			toValue: (currentVolume / maxVolume),
			useNativeDriver: true,
			duration: 500
		}).start()
	}, [animationRef, currentVolume])

	useEffect(() => {
		startAnimations()
	}, [startAnimations])

	return (
		<Animated.View style={[styles.ripler, {
			position: 'absolute',
			height: 100,
			width: 100,
			borderRadius: 120,

			transform: [{
				scale: polAnim
			}]
		}]} >
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	ripler: {
		backgroundColor: 'rgba(125,244,102,0.3)',
		zIndex: 2
	},
});

export const WaveData = [1, 6, 39, 40, 50, 22, 7, 15, 12, 1, 6, 39, 40, 50, 22, 7, 15, 18, 1, 6, 39, 40, 50, 22, 7, 15, 12, 1, 6, 39, 40, 50, 22, 7, 15, 12, 1, 6, 39, 40, 50, 22, 7, 15, 12, 1, 6, 39, 40, 50, 22, 7, 15, 12]

export default Wave