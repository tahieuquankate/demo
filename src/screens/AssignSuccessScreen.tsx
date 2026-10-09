import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { s } from '../styles/examStyles';

type Props = {
  // ID đề được App truyền vào để tạo URL minh họa cho bài vừa giao.
  examId: number;
  // Callback quay về màn danh sách đề.
  onBack: () => void;
};

// Màn hình cuối của luồng: xác nhận thành công, hiển thị link và nút quay về.
export default function AssignSuccessScreen({ examId, onBack }: Props) {
  return (
    <View style={s.safe}>
      <View style={s.header}>
        <View style={s.backBtn} />
        <Text style={s.headerTitle}>Giao bài thành công</Text>
        <View style={s.backBtn} />
      </View>

      <View style={s.doneContent}>
        <View style={s.checkCircle}>
          <Text style={s.checkCircleText}>✓</Text>
        </View>

        <Text style={s.doneTitle}>Đã giao bài</Text>
        <Text style={s.doneSub}>Gửi liên kết này cho học sinh để làm bài.</Text>

        <View style={s.linkBox}>
          <Text style={s.linkText}>
            https://exampro.edu.vn/lam-bai/{String(examId).slice(-6)}
          </Text>
        </View>

        {/* Bản demo chỉ hiện thông báo sao chép, chưa ghi link vào clipboard. */}
        <TouchableOpacity
          style={s.outlineBtn}
          onPress={() => Alert.alert('Đã sao chép', 'Link đã được sao chép.')}
        >
          <Text style={s.outlineBtnText}>Sao chép</Text>
        </TouchableOpacity>
      </View>

      <View style={s.footer}>
        <TouchableOpacity style={s.outlineBtn} onPress={onBack}>
          <Text style={s.outlineBtnText}>Về danh sách đề</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
