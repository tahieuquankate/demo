import { View, Text, StyleSheet } from 'react-native';

type Props = {
  onBack: () => void;
};

export default function AssignSuccessScreen({ onBack }: Props) {
  return (
    <View style={s.wrap}>
      <Text style={s.text}>Màn 5 — Giao bài thành công</Text>
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