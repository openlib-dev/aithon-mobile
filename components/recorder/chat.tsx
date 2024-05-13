import conversation from '@/api/chat';
import { storedAtom } from '@/store';
import { getUploadForm } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { useDebounceFn, useRequest } from 'ahooks';
import { Audio } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedView } from '../ThemedView';
import MessageRow from './message';

const Chat = () => {
	const local = useLocalSearchParams<{ conversationId: string }>();
	const conversationId = useMemo(() => {
		return Number(local.conversationId)
	}, [local])
	const [{ device_id }] = useAtom(storedAtom)

	const { data, run: getMessage, refresh } = useRequest(conversation.messageList, {
		manual: true,
	})

	const { run: dbRun } = useDebounceFn(() => {
		if (!device_id || !conversationId) {
			return
		}
		console.log("1s get message")
		getMessage(device_id, conversationId)
	}, {
		maxWait: 1000
	})
	const { loading: sendMessageLoading, run: sendMessage } = useRequest(conversation.messageSend, {
		manual: true,
		onSuccess: (e) => {
			refresh()
		}
	})
	const { data: uploadData, loading: uploadLoading, run: uploadRun } = useRequest(conversation.upload, {
		manual: true,
		onSuccess: () => {
			sendMessage(device_id!, {
				conversation_id: conversationId,
				message_text: uploadData?.text!,
				message_url: uploadData?.path!
			})
		}
	})

	useEffect(() => {
		if (data?.some((e) => e.message_status === "loading")) {
			dbRun()
		}
	}, [data])

	useEffect(() => {
		if (!device_id || !local.conversationId) {
			return
		}
		getMessage(device_id, Number(local.conversationId))
	}, [])

	const [recording, setRecording] = useState<Audio.Recording>();

	const startRecording = useCallback(async function () {
		try {
			const perm = await Audio.requestPermissionsAsync();
			if (perm.status === "granted") {
				await Audio.setAudioModeAsync({
					allowsRecordingIOS: true,
					playsInSilentModeIOS: true
				});
				const { recording: recordingStream } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets['HIGH_QUALITY']);
				setRecording(recordingStream);
			}
		} catch (err) { }
	}, [])

	const stopRecording = useCallback(async function () {
		setRecording(undefined);
		if (!recording) {
			return
		}
		await recording.stopAndUnloadAsync();
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			playsInSilentModeIOS: true,
		});
		const { status } = await recording.createNewLoadedSoundAsync();

		if (status.isLoaded && device_id) {
			uploadRun(device_id, getUploadForm(recording))
		}
	}, [recording])


	const flatList = useMemo(() => {
		console.log("memo length ", data?.length)
		return <FlatList
			data={data}
			// extraData={data}
			keyExtractor={(item) => item.id + ''}
			renderItem={({ item }) => <MessageRow item={item} key={item.id + ''} />}
			contentContainerStyle={styles.messageList}
		/>
	}, [data])
	console.log("length ", data?.length)

	return (
		<ThemedView style={styles.container}>
			{flatList}
			<ThemedView style={styles.micContainer}>
				<TouchableOpacity disabled={uploadLoading || sendMessageLoading} onPress={recording ? stopRecording : startRecording} style={styles.waveContainer}>
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
			</ThemedView>
		</ThemedView>)
}

export default Chat

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
