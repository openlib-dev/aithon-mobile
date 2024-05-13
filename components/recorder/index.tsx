import conversation from '@/api/chat';
import { ThemedView } from '@/components/ThemedView';
import { storedAtom } from '@/store';
import { getUploadForm } from '@/utils';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRequest } from 'ahooks';
import { Audio } from 'expo-av';
import { router } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, TouchableOpacity, View } from 'react-native';
import Wave, { WaveData } from './wave';


const Recorder = () => {
	const [{ device_id }] = useAtom(storedAtom)

	const { loading: sendMessageLoading, run: sendMessage } = useRequest(conversation.messageSend, {
		manual: true,
		onSuccess: (e) => {
			router.navigate({
				pathname: 'chat', params: {
					conversationId: conversationData?.id
				}
			})
		}
	})
	const { data: uploadData, loading: uploadLoading, run: uploadRun } = useRequest(conversation.upload, {
		manual: true,
		onSuccess: (e) => {
			createConversation(device_id!)
		}
	})
	const { data: conversationData, loading: createConversationLoading, run: createConversation } = useRequest(conversation.create, {
		manual: true,
		onSuccess: (e) => {
			sendMessage(device_id!, {
				conversation_id: e.id,
				message_text: uploadData?.text!,
				message_url: uploadData?.path!
			})
		}
	})

	const [recording, setRecording] = useState<Audio.Recording>();
	const [currentTime, setTime] = useState(0);
	const [currIndex, setIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			const newIndex = currIndex + 1;
			setTime(WaveData[currIndex]);
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
				const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets['HIGH_QUALITY']);
				setRecording(recording);
			}
		} catch (err) {
		}
	}

	async function stopRecording() {
		if (!device_id) {
			return
		}
		if (!recording) {
			return
		}

		setRecording(undefined);

		await recording.stopAndUnloadAsync();
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			playsInSilentModeIOS: true,
		});

		// const { status } = await recording.createNewLoadedSoundAsync();
		// if (status.isLoaded) {
		uploadRun(device_id, getUploadForm(recording))
		// }
	}
	return (
		<ThemedView style={styles.container}>
			<TouchableOpacity disabled={createConversationLoading || sendMessageLoading || uploadLoading} onPress={recording ? stopRecording : startRecording} style={styles.waveContainer}>
				{recording && <Wave currentVolume={currentTime} />}
				<View style={{
					height: 100, width: 100, borderRadius: 60,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: 'rgba(0,72,18,0.9)',
					zIndex: 3
				}}>
					{
						!recording ? <Ionicons name="mic" size={38} color="#fff" /> : <Ionicons name="stop" size={38} color="#fff" />
					}
				</View>
			</TouchableOpacity>
			<Button title='Түүх' onPress={() => router.navigate({
				pathname: 'history'
			})} />
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
		alignItems: 'center',
		marginBottom: 20,
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

