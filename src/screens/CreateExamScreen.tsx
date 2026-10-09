import { View, Text, StyleSheet } from 'react-native';

type Props = {
  onBack: () => void;
  onGoDetail: () => void;
};

export default function CreateExamScreen({ onBack, onGoDetail }: Props) {
  return (
    <View style={s.wrap}>
      <Text style={s.text}>Màn 2 — Tạo đề thi</Text>
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