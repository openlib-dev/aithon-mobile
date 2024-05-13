import { Button, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Audio } from 'expo-av';
import { Recording } from '@/interface';
import Wave from './wave';
import Ionicons from '@expo/vector-icons/Ionicons';


const data = [1, 6, 39, 40, 50, 22, 7, 15, 12, 1, 6, 39, 40, 50, 22, 7, 15, 18, 1, 6, 39, 40, 50, 22, 7, 15, 12, 1, 6, 39, 40, 50, 22, 7, 15, 12, 1, 6, 39, 40, 50, 22, 7, 15, 12, 1, 6, 39, 40, 50, 22, 7, 15, 12]

const Recorder = () => {
	const [recording, setRecording] = useState<Audio.Recording>();
	const [recordings, setRecordings] = useState<Recording[]>([]);
	const [currentTime, setTime] = useState(0);
	const [currIndex, setIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			const newIndex = currIndex + 1;
			setTime(data[currIndex]);
			setIndex(newIndex);
		}, 500)
		return () => clearInterval(interval)
	}, [currIndex])

	async function startRecording() {
		try {
			const perm = await Audio.requestPermissionsAsync();
			if (perm.status === "granted") {
				await Audio.setAudioModeAsync({
					allowsRecordingIOS: true,
					playsInSilentModeIOS: true
				});
				const { recording } = await Audio.Recording.createAsync();
				setRecording(recording);
			}
		} catch (err) { }
	}

	async function stopRecording() {
		setRecording(undefined);
		if (!recording) {
			return
		}
		await recording.stopAndUnloadAsync();
		let allRecordings = [...recordings];
		const { sound, status } = await recording.createNewLoadedSoundAsync();

		if (status.isLoaded)
			allRecordings.push({
				sound: sound,
				duration: getDurationFormatted(status.durationMillis || 0),
				file: recording.getURI()
			});

		setRecordings(allRecordings);
	}

	function getDurationFormatted(milliseconds: number) {
		const minutes = milliseconds / 1000 / 60;
		const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
		return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`
	}

	function getRecordingLines() {
		return recordings.map((recordingLine, index) => {
			return (
				<ThemedText key={index} style={styles.row}>
					<ThemedText style={styles.fill}>
						Recording #{index + 1} | {recordingLine.duration}
					</ThemedText>
					<Button onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>
				</ThemedText>
			);
		});
	}

	return (
		<ThemedView style={styles.container}>
			<TouchableOpacity onPress={recording ? stopRecording : startRecording} style={styles.waveContainer}>
				{recording && <Wave currentVolume={currentTime} />}
				<View style={{
					height: 100, width: 100, borderRadius: 60,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: 'rgba(125,244,102,0.9)',
					zIndex: 3
				}}>
					{
						!recording ? <Ionicons name="mic" size={38} color="green" /> : <Ionicons name="stop" size={38} color="red" />
					}
				</View>
			</TouchableOpacity>
			{getRecordingLines()}
		</ThemedView>
	)
}

export default Recorder

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	waveContainer: {
		width: 100,
		height: 100,
		justifyContent: 'center',
		alignItems: 'center'
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 10,
		marginRight: 40
	},
	fill: {
		flex: 1,
		margin: 15
	}
})