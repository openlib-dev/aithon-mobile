import { recordAtom, storedAtom } from '@/store';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useRequest } from 'ahooks';
import conversation from '@/api/chat';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const History = () => {
	const [{ device_id }] = useAtom(storedAtom)
	const { data, run } = useRequest(conversation.list, {
		manual: true
	})
	useEffect(() => {
		if (device_id) {
			run(device_id)
		}
	}, [device_id])

	const renderHistory = () => {
		if (!data || Object.keys(data).length === 0) {
			return <ThemedText>Түүх байхгүй байна</ThemedText>
		}
		return Object.keys(data).map((key) => {
			return <ThemedView style={styles.row} key={key}>
				<ThemedText>
					{key}
				</ThemedText>
				<ThemedView style={styles.list}>
					{
						data[key].map((each) =>
							<TouchableOpacity style={styles.listItem} onPress={() => {
								router.navigate({
									pathname: 'chat', params: {
										conversationId: each.id
									}
								})
							}}>
								<ThemedText ellipsizeMode='tail' numberOfLines={1} style={styles.listText} key={`${each.name}`}>{each.first_message.message_text}</ThemedText>
								<Ionicons name="arrow-forward-circle-sharp" size={30} color="#fff" />
							</TouchableOpacity>)
					}
				</ThemedView>
			</ThemedView>
		})
	}
	return (
		<ThemedView style={styles.container}>
			{renderHistory()}
		</ThemedView>
	)
}

export default History

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 80,
		alignItems: 'center',
	},
	row: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column'
	},
	fill: {
		height: '100%',
	},
	list: {
		flexDirection: 'column',
		paddingTop: 10
	},
	listItem: {
		padding: 16,
		borderRadius: 10,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(0,72,18,0.8)',
		marginBottom: 10
	},
	listText: {
		overflow: 'hidden',
	}
})