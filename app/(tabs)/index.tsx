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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
