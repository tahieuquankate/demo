import { View, Text, StyleSheet } from 'react-native';

type Props = {
  onGoCreate: () => void;
};

export default function ExamListScreen({ onGoCreate }: Props) {
  return (
    <View style={s.wrap}>
      <Text style={s.text}>Màn 1 — Đề thi</Text>
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