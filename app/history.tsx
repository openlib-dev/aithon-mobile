import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import History from '@/components/recorder/history';

export default function RecordersScreen() {
	return (
		<ThemedView style={styles.container}>
			<History />
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
