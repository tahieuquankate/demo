import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import type { Question } from '../types/exam';
import { s } from '../styles/examStyles';

type Props = {
  // Dữ liệu form do App giữ để có thể kiểm tra/lưu khi người dùng nhấn nút.
  examName: string;
  onChangeExamName: (name: string) => void;
  questions: Question[];
  onUpdateQuestionText: (questionIndex: number, text: string) => void;
  onUpdateOption: (questionIndex: number, optionIndex: number, text: string) => void;
  onSetCorrect: (questionIndex: number, optionIndex: number) => void;
  onAddQuestion: () => void;
  onBack: () => void;
  onSave: () => void;
};

// Màn hình chỉ dựng giao diện form; App truyền state xuống và truyền callback xử lý lên.
export default function CreateExamScreen({
  examName,
  onChangeExamName,
  questions,
  onUpdateQuestionText,
  onUpdateOption,
  onSetCorrect,
  onAddQuestion,
  onBack,
  onSave,
}: Props) {
  return (
    <View style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Tạo đề thi</Text>
        <View style={s.backBtn} />
      </View>

      <ScrollView contentContainerStyle={s.content}>
        {/* Các ô nhập gọi callback của App để cập nhật form dùng chung. */}
        <Text style={s.label}>Tên đề thi</Text>
        <TextInput
          placeholder="Nhập tên đề"
          value={examName}
          onChangeText={onChangeExamName}
          style={s.input}
        />

        {/* Một thẻ tương ứng với một câu; số thẻ tăng khi App gọi addQuestion. */}
        {questions.map((question, questionIndex) => (
          <View key={questionIndex} style={s.card}>
            <Text style={s.cardTitle}>Câu {questionIndex + 1}</Text>

            <TextInput
              placeholder="Nhập câu hỏi"
              value={question.text}
              onChangeText={(text) => onUpdateQuestionText(questionIndex, text)}
              style={s.input}
            />

            {/* Mỗi câu có bốn đáp án; lựa chọn đúng được lưu bằng chỉ số `correct`. */}
            {['A', 'B', 'C', 'D'].map((letter, optionIndex) => {
              const isCorrect = question.correct === optionIndex;

              return (
                <View key={letter} style={s.optionRow}>
                  <TouchableOpacity
                    style={isCorrect ? s.radioActive : s.radio}
                    onPress={() => onSetCorrect(questionIndex, optionIndex)}
                  >
                    {isCorrect && <View style={s.radioDot} />}
                  </TouchableOpacity>

                  <Text style={s.optionLetter}>{letter}</Text>

                  <TextInput
                    placeholder={`Đáp án ${letter}`}
                    value={question.options[optionIndex]}
                    onChangeText={(text) =>
                      onUpdateOption(questionIndex, optionIndex, text)
                    }
                    style={s.optionInput}
                  />
                </View>
              );
            })}
          </View>
        ))}

        {/* Callback này đi đến addQuestion ở App để thêm một câu trống vào state. */}
        <TouchableOpacity style={s.outlineBtn} onPress={onAddQuestion}>
          <Text style={s.outlineBtnText}>+ Thêm câu hỏi</Text>
        </TouchableOpacity>

        <Text style={s.hint}>Chọn nút tròn để đánh dấu đáp án đúng.</Text>
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity style={s.primaryBtn} onPress={onSave}>
          {/* App kiểm tra tên/số câu, lưu Exam rồi chuyển sang màn chi tiết. */}
          <Text style={s.primaryBtnText}>Lưu đề thi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
