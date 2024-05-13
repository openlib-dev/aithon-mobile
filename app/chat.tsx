import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import Chat from '@/components/recorder/chat';

export default function RecordersScreen() {
	return (
		<ThemedView style={styles.container}>
			<Chat />
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
