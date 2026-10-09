import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import type { Deadline, Exam } from '../types/exam';
import { s } from '../styles/examStyles';

type Props = {
  // Đề đang giao cùng các giá trị form do App quản lý.
  exam: Exam;
  duration: string;
  onChangeDuration: (duration: string) => void;
  deadline: Deadline;
  onChangeDeadline: (key: keyof Deadline, value: string) => void;
  onBack: () => void;
  onConfirm: () => void;
};

// Màn hình giao bài hiển thị thông tin đề, thời lượng và hạn nộp.
// Mọi thay đổi được gửi về App để confirmAssign kiểm tra và lưu.
export default function AssignExamScreen({
  exam,
  duration,
  onChangeDuration,
  deadline,
  onChangeDeadline,
  onBack,
  onConfirm,
}: Props) {
  return (
    <View style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Giao bài</Text>
        <View style={s.backBtn} />
      </View>

      <ScrollView contentContainerStyle={s.content}>
        {/* Mỗi ô nhập cập nhật một trường trong state duration/deadline ở App. */}
        <Text style={s.label}>Đề thi: {exam.name}</Text>

        <Text style={s.label}>Thời gian làm bài (phút)</Text>
        <TextInput
          value={duration}
          onChangeText={onChangeDuration}
          keyboardType="number-pad"
          style={s.input}
        />
        <Text style={s.hint}>Nhập 0 để không giới hạn thời gian</Text>

        <Text style={s.label}>Hạn nộp — Ngày</Text>
        <View style={s.dateRow}>
          <TextInput
            value={deadline.day}
            onChangeText={(value) => onChangeDeadline('day', value)}
            keyboardType="number-pad"
            style={s.dateInput}
            placeholder="Ngày"
          />
          <Text style={s.dateSlash}>/</Text>
          <TextInput
            value={deadline.month}
            onChangeText={(value) => onChangeDeadline('month', value)}
            keyboardType="number-pad"
            style={s.dateInput}
            placeholder="Tháng"
          />
          <Text style={s.dateSlash}>/</Text>
          <TextInput
            value={deadline.year}
            onChangeText={(value) => onChangeDeadline('year', value)}
            keyboardType="number-pad"
            style={s.dateInputYear}
            placeholder="Năm"
          />
        </View>

        <Text style={s.label}>Hạn nộp — Giờ</Text>
        <View style={s.dateRow}>
          <TextInput
            value={deadline.hour}
            onChangeText={(value) => onChangeDeadline('hour', value)}
            keyboardType="number-pad"
            style={s.dateInput}
            placeholder="Giờ"
          />
          <Text style={s.dateSlash}>:</Text>
          <TextInput
            value={deadline.minute}
            onChangeText={(value) => onChangeDeadline('minute', value)}
            keyboardType="number-pad"
            style={s.dateInput}
            placeholder="Phút"
          />
        </View>
      </ScrollView>

      <View style={s.footer}>
        {/* App xác thực ngày/giờ; hợp lệ thì cập nhật đề và mở màn thành công. */}
        <TouchableOpacity style={s.primaryBtn} onPress={onConfirm}>
          <Text style={s.primaryBtnText}>Giao bài</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
