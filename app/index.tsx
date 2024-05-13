import { Button, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import Recorder from '@/components/recorder';
import { useEffect } from 'react';
import * as Location from 'expo-location';
import { useAtom } from 'jotai';
import uuid from 'react-native-uuid';
import { storedAtom, locationAtom } from '@/store';


export default function HomeScreen() {
	const [{ device_id }, setStore] = useAtom(storedAtom)
	const [, setLocation] = useAtom(locationAtom)
	useEffect(() => {
		(async () => {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				return;
			}
			const location = await Location.getCurrentPositionAsync({});
			setLocation(location)
		})();
	}, []);

	useEffect(() => {
		if (!device_id) {
			setStore({ device_id: uuid.v4().toString() })
		}
	}, [])


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
