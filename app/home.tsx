import { StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import Recorder from '@/components/recorder';

export default function HomeScreen() {
	return (
		<ThemedView style={styles.container}>
			<Recorder />
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
