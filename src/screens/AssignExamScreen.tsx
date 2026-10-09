import { View, Text, StyleSheet } from 'react-native';

type Props = {
  onBack: () => void;
  onGoSuccess: () => void;
};

export default function AssignExamScreen({ onBack, onGoSuccess }: Props) {
  return (
    <View style={s.wrap}>
      <Text style={s.text}>Màn 4 — Giao bài</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 20,
    color: '#1F2937',
  },
});