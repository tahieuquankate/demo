import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import type { Exam } from '../types/exam';
import { s } from '../styles/examStyles';

type Props = {
  // Danh sách do App quản lý; màn hình này chỉ hiển thị và lọc, không tự lưu đề.
  exams: Exam[];
  // Giá trị tìm kiếm và callback cập nhật tương ứng với state trong App.
  query: string;
  onChangeQuery: (query: string) => void;
  // Callback báo App mở form tạo đề hoặc mở chi tiết đề được chọn.
  onGoCreate: () => void;
  onSelectExam: (examId: number) => void;
};

// Màn hình danh sách: lọc dữ liệu nhận từ App và gửi thao tác người dùng ngược về App.
export default function ExamListScreen({
  exams,
  query,
  onChangeQuery,
  onGoCreate,
  onSelectExam,
}: Props) {
  // Lọc theo tên không phân biệt chữ hoa/thường; `query` được App giữ nên
  // mỗi lần nhập, App cập nhật props và danh sách được lọc lại.
  const keyword = query.trim().toLowerCase();
  const shown = exams.filter((exam) => exam.name.toLowerCase().includes(keyword));

  return (
    <View style={s.safe}>
      <View style={s.hero}>
        <Text style={s.heroTitle}>Hi, giáo viên</Text>
        <TextInput
          placeholder="Tìm đề thi"
          placeholderTextColor="#9AA0AA"
          value={query}
          onChangeText={onChangeQuery}
          style={s.searchBox}
        />
      </View>

      <ScrollView contentContainerStyle={s.listContent}>
        {shown.map((exam) => {
          // Cùng màu nền được dùng cho biểu tượng và nhãn trạng thái đề.
          const bgColor = exam.saved ? '#E6F4EC' : '#FDF1DC';
          const badgeText = exam.saved ? 'Đã lưu' : 'Bản nháp';

          // Khi bấm thẻ, gửi ID lên App để App chọn đề và mở màn chi tiết.
          return (
            <TouchableOpacity
              key={exam.id}
              style={s.examCard}
              onPress={() => onSelectExam(exam.id)}
            >
              <View style={[s.tile, { backgroundColor: bgColor }]}>
                <Text style={s.tileText}>📄</Text>
              </View>

              <View style={s.examInfo}>
                <Text style={s.examName}>{exam.name}</Text>
                <Text style={s.examMeta}>
                  {exam.count} câu · {exam.minutes} phút
                </Text>
              </View>

              <View style={[s.badge, { backgroundColor: bgColor }]}>
                <Text style={s.badgeText}>{badgeText}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {shown.length === 0 && (
          <Text style={s.emptyText}>
            {exams.length === 0
              ? 'Chưa có đề thi nào. Bấm nút + để tạo đề mới.'
              : 'Không tìm thấy đề thi nào.'}
          </Text>
        )}
      </ScrollView>

      {/* App xử lý reset form và chuyển sang màn tạo khi callback này được gọi. */}
      <TouchableOpacity style={s.fab} onPress={onGoCreate}>
        <Text style={s.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
