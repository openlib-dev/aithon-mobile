import { Message } from '@/interface'
import { Audio } from "expo-av"
import React from 'react'
import { Animated, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { ThemedView } from '../ThemedView'

type Props = {
	item: Message
}


const soundObject = new Audio.Sound();

const MessageRow = ({ item }: Props) => {
	const progress = new Animated.Value(0)
	console.log("sda BI REDNEDED",)
	async function playSound(url: string) {
		if (url) {
			await soundObject.unloadAsync()
			await soundObject.loadAsync({
				uri: url
			})
			// const { sound } = await Audio.Sound.createAsync(
			// 	{
			// 		uri: url,
			// 	},
			// 	{ shouldPlay: true },
			// );
			await soundObject.replayAsync();

			soundObject._onPlaybackStatusUpdate = (duration) => {
				if (duration.isLoaded) {
					console.log(duration.durationMillis, "-", duration.positionMillis)
				}
				if (duration.isLoaded && duration.durationMillis) {
					const position = duration.positionMillis / duration.durationMillis;
					Animated.timing(progress, {
						toValue: position,
						duration: 1000,
						useNativeDriver: false,
					}).start();

				}
			}
		}
	}
	// useEffect(() => {

	// 	if (current === item.id) {
	// 		// item.sound.playAsync()
	// 		console.log(item.url)
	// 		playSound(item.url)
	// 		progress.setValue(0)
	// 	} else {
	// 		// item.sound.stopAsync()
	// 		soundObject.unloadAsync()
	// 	}
	// 	// return () => {
	// 	// 	soundObject ? () => {
	// 	// 		console.log("Unloading Sound");
	// 	// 		soundObject.unloadAsync();
	// 	// 	}
	// 	// 		: undefined;
	// 	// }
	// }, [item.id, current])

	// item.sound._onPlaybackStatusUpdate = (duration) => {
	// 	if (duration.isLoaded && duration.durationMillis) {
	// 		const position = duration.positionMillis / duration.durationMillis;
	// 		Animated.timing(progress, {
	// 			toValue: position,
	// 			duration: 1000,
	// 			useNativeDriver: false,
	// 		}).start();

	// 		setTimeout(() => {
	// 			if (duration.positionMillis === duration.durationMillis) {
	// 				setCurrent(undefined)
	// 			}
	// 		}, 1000)
	// 	}
	// }

	return (<TouchableOpacity onPress={() => {
		playSound(item.message_url)
	}}>
		<ThemedView style={[styles.messageContainer, item.message_type === "sent" ? styles.fromMe : styles.fromOthers]}>
			<Image source={require("@/assets/images/wave.png")} style={{ height: 45 }} resizeMode='contain' />
			<Animated.View
				style={{
					position: 'absolute',
					borderRadius: 32,
					bottom: -10,
					left: 0,
					width: 5,
					height: 70,
					backgroundColor: '#004812',
					transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 145] }) }],
				}}
			/>
		</ThemedView>
	</TouchableOpacity>
	);
}

export default MessageRow

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginBottom: 40,
	},
	messageList: {
		flexGrow: 1,
		padding: 10,
		justifyContent: 'flex-end',
	},
	waveContainer: {
		width: 100,
		height: 100,
		justifyContent: 'center',
		alignItems: 'center'
	},
	messageContainer: {
		marginBottom: 25,
		borderRadius: 10,
		width: 160,
		height: 50,
		alignSelf: 'flex-start',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f2f2f2',
		flexDirection: 'row'
	},
	messageText: {
		fontSize: 16,
	},
	fromMe: {
		alignSelf: 'flex-end',
	},
	fromOthers: {
		alignSelf: 'flex-start',
	},
	micContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 10,
	},
	input: {
		flex: 1,
		minHeight: 40,
		backgroundColor: '#fff',
		borderRadius: 20,
		paddingHorizontal: 15,
		marginVertical: 10,
	},
	sendButton: {
		marginLeft: 10,
		padding: 10,
		backgroundColor: '#004812',
		borderRadius: 20,
	},
	sendButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
