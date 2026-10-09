import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert,
} from 'react-native';
 
const SafeAreaView = View;

type Screen = 'list' | 'create' | 'detail' | 'assign' | 'done';

type Question = {
  text: string;
  options: string[];
  correct: number;
};

type Exam = {
  id: number;
  name: string;
  count: number;
  minutes: number;
  saved: boolean;
  questions: Question[];
};

const BLUE = '#185FA5';

// Mảng rỗng — app bắt đầu không có đề nào
const INITIAL_EXAMS: Exam[] = [];

// Hàm tạo 1 câu hỏi trống
const newQuestion = (): Question => ({
  text: '',
  options: ['', '', '', ''],
  correct: 0,
});

// ===== APP CHÍNH =====
export default function App() {
  const [screen, setScreen] = useState<Screen>('list');
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  // Form tạo đề
  const [examName, setExamName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([newQuestion(), newQuestion()]);

  // Giao bài
  const [duration, setDuration] = useState('45');
  const [deadlineDay, setDeadlineDay] = useState('12');
  const [deadlineMonth, setDeadlineMonth] = useState('10');
  const [deadlineYear, setDeadlineYear] = useState('2026');
  const [deadlineHour, setDeadlineHour] = useState('23');
  const [deadlineMinute, setDeadlineMinute] = useState('00');

  const selected = exams.find((e) => e.id === selectedId);

  // ===== HÀNH ĐỘNG =====

  // Mở 1 đề → sang màn chi tiết
  const openExam = (id: number) => {
    setSelectedId(id);
    setScreen('detail');
  };

  // Bắt đầu tạo đề mới
  const startCreate = () => {
    setExamName('');
    setQuestions([newQuestion(), newQuestion()]);
    setScreen('create');
  };

  // Cập nhật nội dung câu hỏi
  const updateQuestionText = (qi: number, text: string) => {
    const copy = [...questions];
    copy[qi].text = text;
    setQuestions(copy);
  };

  // Cập nhật 1 đáp án
  const updateOption = (qi: number, oi: number, text: string) => {
    const copy = [...questions];
    copy[qi].options[oi] = text;
    setQuestions(copy);
  };

  // Chọn đáp án đúng
  const setCorrect = (qi: number, oi: number) => {
    const copy = [...questions];
    copy[qi].correct = oi;
    setQuestions(copy);
  };

  // Thêm câu hỏi
  const addQuestion = () => {
    setQuestions([...questions, newQuestion()]);
  };

  // Lưu đề thi
  const saveExam = () => {
    if (!examName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên đề thi.');
      return;
    }

    let filledCount = 0;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].text.trim()) {
        filledCount = filledCount + 1;
      }
    }

    if (filledCount === 0) {
      Alert.alert('Lỗi', 'Hãy nhập ít nhất 1 câu hỏi.');
      return;
    }

    const newId = Date.now();
    const newExam: Exam = {
      id: newId,
      name: examName.trim(),
      count: filledCount,
      minutes: 45,
      saved: true,
      questions: questions,
    };

    setExams([newExam, ...exams]);
    setSelectedId(newId);
    setScreen('detail');
  };

  // Sang màn giao bài
  const goAssign = () => {
    if (!selected) {
      return;
    }
    setDuration(String(selected.minutes));
    setScreen('assign');
  };

  // Xác nhận giao bài
  const confirmAssign = () => {
    if (duration === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập thời gian làm bài.');
      return;
    }

    const day = Number(deadlineDay);
    const month = Number(deadlineMonth);
    const year = Number(deadlineYear);
    const hour = Number(deadlineHour);
    const minute = Number(deadlineMinute);

    if (day < 1 || day > 31) {
      Alert.alert('Lỗi', 'Ngày không hợp lệ (1-31).');
      return;
    }
    if (month < 1 || month > 12) {
      Alert.alert('Lỗi', 'Tháng không hợp lệ (1-12).');
      return;
    }
    if (year < 2025) {
      Alert.alert('Lỗi', 'Năm không hợp lệ.');
      return;
    }
    if (hour < 0 || hour > 23) {
      Alert.alert('Lỗi', 'Giờ không hợp lệ (0-23).');
      return;
    }
    if (minute < 0 || minute > 59) {
      Alert.alert('Lỗi', 'Phút không hợp lệ (0-59).');
      return;
    }

    const updated = exams.map((e) => {
      if (e.id === selectedId) {
        return { ...e, minutes: Number(duration) };
      }
      return e;
    });
    setExams(updated);

    setScreen('done');
  };

  // ===== MÀN 1: DANH SÁCH ĐỀ =====
  if (screen === 'list') {
    const keyword = query.trim().toLowerCase();
    const shown: Exam[] = [];
    for (let i = 0; i < exams.length; i++) {
      if (exams[i].name.toLowerCase().includes(keyword)) {
        shown.push(exams[i]);
      }
    }

    return (
      <SafeAreaView style={s.safe}>
        <View style={s.hero}>
          <Text style={s.heroTitle}>Hi, giáo viên</Text>
          <TextInput
            placeholder="Tìm đề thi"
            placeholderTextColor="#9AA0AA"
            value={query}
            onChangeText={setQuery}
            style={s.searchBox}
          />
        </View>

        <ScrollView contentContainerStyle={s.listContent}>
          {shown.map((exam) => {
            let bgColor = '#FDF1DC';
            let badgeText = 'Bản nháp';

            if (exam.saved) {
              bgColor = '#E6F4EC';
              badgeText = 'Đã lưu';
            }

            return (
              <TouchableOpacity
                key={exam.id}
                style={s.examCard}
                onPress={() => openExam(exam.id)}
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

        <TouchableOpacity style={s.fab} onPress={startCreate}>
          <Text style={s.fabText}>+</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ===== MÀN 2: TẠO ĐỀ =====
  if (screen === 'create') {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => setScreen('list')} style={s.backBtn}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Tạo đề thi</Text>
          <View style={s.backBtn} />
        </View>

        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.label}>Tên đề thi</Text>
          <TextInput
            placeholder="Nhập tên đề"
            value={examName}
            onChangeText={setExamName}
            style={s.input}
          />

          {questions.map((q, qi) => {
            return (
              <View key={qi} style={s.card}>
                <Text style={s.cardTitle}>Câu {qi + 1}</Text>

                <TextInput
                  placeholder="Nhập câu hỏi"
                  value={q.text}
                  onChangeText={(t) => updateQuestionText(qi, t)}
                  style={s.input}
                />

                {['A', 'B', 'C', 'D'].map((letter, oi) => {
                  const isCorrect = q.correct === oi;

                  let radioStyle = s.radio;
                  if (isCorrect) {
                    radioStyle = s.radioActive;
                  }

                  return (
                    <View key={letter} style={s.optionRow}>
                      <TouchableOpacity
                        style={radioStyle}
                        onPress={() => setCorrect(qi, oi)}
                      >
                        {isCorrect && <View style={s.radioDot} />}
                      </TouchableOpacity>

                      <Text style={s.optionLetter}>{letter}</Text>

                      <TextInput
                        placeholder={`Đáp án ${letter}`}
                        value={q.options[oi]}
                        onChangeText={(t) => updateOption(qi, oi, t)}
                        style={s.optionInput}
                      />
                    </View>
                  );
                })}
              </View>
            );
          })}

          <TouchableOpacity style={s.outlineBtn} onPress={addQuestion}>
            <Text style={s.outlineBtnText}>+ Thêm câu hỏi</Text>
          </TouchableOpacity>

          <Text style={s.hint}>Chọn nút tròn để đánh dấu đáp án đúng.</Text>
        </ScrollView>

        <View style={s.footer}>
          <TouchableOpacity style={s.primaryBtn} onPress={saveExam}>
            <Text style={s.primaryBtnText}>Lưu đề thi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ===== MÀN 3: CHI TIẾT ĐỀ =====
  if (screen === 'detail') {
    if (!selected) {
      return null;
    }

    return (
      <SafeAreaView style={s.safe}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => setScreen('list')} style={s.backBtn}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Chi tiết đề thi</Text>
          <View style={s.backBtn} />
        </View>

        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.examDetailName}>{selected.name}</Text>
          <Text style={s.examDetailSub}>{selected.questions.length} câu trắc nghiệm</Text>

          {selected.questions.map((q, qi) => {
            return (
              <View key={qi} style={s.card}>
                <Text style={s.cardTitle}>
                  Câu {qi + 1}. {q.text}
                </Text>

                {q.options.map((opt, oi) => {
                  const isCorrect = q.correct === oi;

                  let rowStyle = s.detailOption;
                  if (isCorrect) {
                    rowStyle = s.detailOptionOk;
                  }

                  return (
                    <View key={oi} style={rowStyle}>
                      <Text style={s.detailLetter}>{'ABCD'[oi]}.</Text>
                      <Text style={s.detailText}>{opt || '(chưa nhập)'}</Text>
                      {isCorrect && <Text style={s.checkIcon}>✓</Text>}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>

        <View style={s.footerRow}>
          <TouchableOpacity
            style={s.outlineBtnFlex}
            onPress={() => {
              Alert.alert('Thông báo', 'Chức năng chỉnh sửa chưa làm.');
            }}
          >
            <Text style={s.outlineBtnText}>Chỉnh sửa</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.primaryBtnFlex} onPress={goAssign}>
            <Text style={s.primaryBtnText}>Giao bài</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ===== MÀN 4: GIAO BÀI =====
  if (screen === 'assign') {
    if (!selected) {
      return null;
    }

    return (
      <SafeAreaView style={s.safe}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => setScreen('detail')} style={s.backBtn}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Giao bài</Text>
          <View style={s.backBtn} />
        </View>

        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.label}>Đề thi: {selected.name}</Text>

          <Text style={s.label}>Thời gian làm bài (phút)</Text>
          <TextInput
            value={duration}
            onChangeText={setDuration}
            keyboardType="number-pad"
            style={s.input}
          />
          <Text style={s.hint}>Nhập 0 để không giới hạn thời gian</Text>

          <Text style={s.label}>Hạn nộp — Ngày</Text>
          <View style={s.dateRow}>
            <TextInput
              value={deadlineDay}
              onChangeText={setDeadlineDay}
              keyboardType="number-pad"
              style={s.dateInput}
              placeholder="Ngày"
            />
            <Text style={s.dateSlash}>/</Text>
            <TextInput
              value={deadlineMonth}
              onChangeText={setDeadlineMonth}
              keyboardType="number-pad"
              style={s.dateInput}
              placeholder="Tháng"
            />
            <Text style={s.dateSlash}>/</Text>
            <TextInput
              value={deadlineYear}
              onChangeText={setDeadlineYear}
              keyboardType="number-pad"
              style={s.dateInputYear}
              placeholder="Năm"
            />
          </View>

          <Text style={s.label}>Hạn nộp — Giờ</Text>
          <View style={s.dateRow}>
            <TextInput
              value={deadlineHour}
              onChangeText={setDeadlineHour}
              keyboardType="number-pad"
              style={s.dateInput}
              placeholder="Giờ"
            />
            <Text style={s.dateSlash}>:</Text>
            <TextInput
              value={deadlineMinute}
              onChangeText={setDeadlineMinute}
              keyboardType="number-pad"
              style={s.dateInput}
              placeholder="Phút"
            />
          </View>
        </ScrollView>

        <View style={s.footer}>
          <TouchableOpacity style={s.primaryBtn} onPress={confirmAssign}>
            <Text style={s.primaryBtnText}>Giao bài</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ===== MÀN 5: THÀNH CÔNG =====
  return (
    <SafeAreaView style={s.safe}>
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
            https://exampro.edu.vn/lam-bai/{String(selectedId).slice(-6)}
          </Text>
        </View>

        <TouchableOpacity
          style={s.outlineBtn}
          onPress={() => Alert.alert('Đã sao chép', 'Link đã được sao chép.')}
        >
          <Text style={s.outlineBtnText}>Sao chép</Text>
        </TouchableOpacity>
      </View>

      <View style={s.footer}>
        <TouchableOpacity style={s.outlineBtn} onPress={() => setScreen('list')}>
          <Text style={s.outlineBtnText}>Về danh sách đề</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ===== STYLE =====
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backBtn: { width: 32 },
  backIcon: { fontSize: 22, color: '#222222' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '600', color: '#222222', textAlign: 'center' },

  // Nội dung chung
  content: { padding: 16, paddingBottom: 40 },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#EEEEEE' },
  footerRow: { flexDirection: 'row', padding: 16, gap: 8, borderTopWidth: 1, borderTopColor: '#EEEEEE' },

  label: { fontSize: 14, color: '#555555', marginBottom: 6, marginTop: 8 },
  hint: { fontSize: 12, color: '#888888', marginTop: 4, marginBottom: 8 },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#222222',
    marginBottom: 8,
  },

  // Nút
  primaryBtn: {
    height: 48,
    backgroundColor: BLUE,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  primaryBtnFlex: {
    flex: 1,
    height: 48,
    backgroundColor: BLUE,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineBtn: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineBtnFlex: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineBtnText: { color: '#333333', fontSize: 16, fontWeight: '500' },

  // Màn 1: Danh sách
  hero: {
    backgroundColor: BLUE,
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '600', marginBottom: 14 },
  searchBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    height: 46,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  listContent: { padding: 16, paddingBottom: 100 },

  examCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E8EE',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  tile: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: { fontSize: 22 },
  examInfo: { flex: 1 },
  examName: { fontSize: 15, fontWeight: '600', color: '#222222', marginBottom: 2 },
  examMeta: { fontSize: 12, color: '#777777' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, color: '#333333', fontWeight: '500' },
  emptyText: { textAlign: 'center', color: '#888888', fontSize: 14, paddingVertical: 24 },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: { color: '#FFFFFF', fontSize: 30, fontWeight: '300', marginTop: -2 },

  // Card câu hỏi
  card: {
    borderWidth: 1,
    borderColor: '#E5E8EE',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#222222', marginBottom: 8 },

  // Option row (màn tạo)
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#BBBBBB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: BLUE },
  optionLetter: { width: 20, fontSize: 15, fontWeight: '600', color: '#333333' },
  optionInput: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
  },

  // Màn 3: Chi tiết
  examDetailName: { fontSize: 20, fontWeight: '600', color: '#222222', marginBottom: 4 },
  examDetailSub: { fontSize: 13, color: '#777777', marginBottom: 12 },
  detailOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 4,
  },
  detailOptionOk: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#E6F4EC',
  },
  detailLetter: { width: 22, fontWeight: '600', color: '#555555' },
  detailText: { flex: 1, color: '#333333', fontSize: 14 },
  checkIcon: { fontSize: 16, color: '#1D9E75', fontWeight: '700' },

  // Màn 4: Giao bài
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateInput: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    textAlign: 'center',
  },
  dateInputYear: {
    flex: 1.5,
    height: 46,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    textAlign: 'center',
  },
  dateSlash: { fontSize: 18, color: '#666666' },

  // Màn 5: Thành công
  doneContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1D9E75',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  checkCircleText: { color: '#FFFFFF', fontSize: 36, fontWeight: '700' },
  doneTitle: { fontSize: 20, fontWeight: '600', color: '#222222', marginBottom: 4 },
  doneSub: { fontSize: 14, color: '#777777', marginBottom: 20, textAlign: 'center' },
  linkBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  linkText: { fontSize: 13, color: '#333333', textAlign: 'center' },
});