import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { Exam } from '../types/exam';
import { s } from '../styles/examStyles';

type Props = {
  // Đề được App tra từ selectedId và truyền vào để màn hình hiển thị.
  exam: Exam;
  // Hai callback cho phép quay lại danh sách hoặc bắt đầu luồng giao bài.
  onBack: () => void;
  onGoAssign: () => void;
};

// Màn hình chỉ đọc thông tin đề; dữ liệu gốc vẫn do App quản lý.
export default function ExamDetailScreen({ exam, onBack, onGoAssign }: Props) {
  return (
    <View style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Chi tiết đề thi</Text>
        <View style={s.backBtn} />
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.examDetailName}>{exam.name}</Text>
        <Text style={s.examDetailSub}>{exam.questions.length} câu trắc nghiệm</Text>

        {/* Duyệt các câu đã lưu; trong mỗi câu, duyệt tiếp bốn phương án trả lời. */}
        {exam.questions.map((question, questionIndex) => (
          <View key={questionIndex} style={s.card}>
            <Text style={s.cardTitle}>
              Câu {questionIndex + 1}. {question.text}
            </Text>

            {question.options.map((option, optionIndex) => {
              const isCorrect = question.correct === optionIndex;

              return (
                <View
                  key={optionIndex}
                  style={isCorrect ? s.detailOptionOk : s.detailOption}
                >
                  <Text style={s.detailLetter}>{'ABCD'[optionIndex]}.</Text>
                  <Text style={s.detailText}>{option || '(chưa nhập)'}</Text>
                  {isCorrect && <Text style={s.checkIcon}>✓</Text>}
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>

      <View style={s.footerRow}>
        {/* Chỉnh sửa hiện chỉ là thông báo placeholder, chưa cập nhật đề. */}
        <TouchableOpacity
          style={s.outlineBtnFlex}
          onPress={() => Alert.alert('Thông báo', 'Chức năng chỉnh sửa chưa làm.')}
        >
          <Text style={s.outlineBtnText}>Chỉnh sửa</Text>
        </TouchableOpacity>

        {/* App nhận callback này, nạp thời lượng đề và mở AssignExamScreen. */}
        <TouchableOpacity style={s.primaryBtnFlex} onPress={onGoAssign}>
          <Text style={s.primaryBtnText}>Giao bài</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
