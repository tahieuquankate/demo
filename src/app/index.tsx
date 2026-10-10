import { useState } from 'react';
import { Alert } from 'react-native';
import AssignExamScreen from '../screens/AssignExamScreen';
import AssignSuccessScreen from '../screens/AssignSuccessScreen';
import CreateExamScreen from '../screens/CreateExamScreen';
import ExamDetailScreen from '../screens/ExamDetailScreen';
import ExamListScreen from '../screens/ExamListScreen';
import type { Deadline, Exam, Question } from '../types/exam';

// Tên các màn hình mà App có thể hiển thị; screen bên dưới quyết định màn hiện tại.
type Screen = 'list' | 'create' | 'detail' | 'assign' | 'done';

// Dữ liệu ban đầu: ứng dụng mở lên với danh sách đề trống.
const INITIAL_EXAMS: Exam[] = [];

// Hạn nộp mặc định được đưa vào form giao bài khi ứng dụng khởi động.
const INITIAL_DEADLINE: Deadline = {
  day: '12',
  month: '10',
  year: '2026',
  hour: '23',
  minute: '00',
};

// Tạo dữ liệu cho một câu hỏi mới với bốn đáp án trống.
const newQuestion = (): Question => ({
  text: '',
  options: ['', '', '', ''],
  correct: 0,
});

// App là component điều phối: giữ dữ liệu dùng chung, xử lý nghiệp vụ,
// rồi chọn và render một Screen tương ứng với state `screen`.
export default function App() {
  // `screen` điều khiển luồng list → create/detail → assign → done.
  const [screen, setScreen] = useState<Screen>('list');
  // `exams` là nguồn dữ liệu chính, được cập nhật khi lưu đề hoặc giao bài.
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);
  // Chỉ lưu ID đề đang thao tác để tra đề mới nhất từ `exams`.
  const [selectedId, setSelectedId] = useState<number | null>(null);
  // Các state dưới đây chứa dữ liệu của ô tìm kiếm và form tạo đề.
  const [query, setQuery] = useState('');
  const [examName, setExamName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([newQuestion(), newQuestion()]);
  // Các state này được dùng trong form giao bài.
  const [duration, setDuration] = useState('45');
  const [deadline, setDeadline] = useState<Deadline>(INITIAL_DEADLINE);

  // Tìm đề đang chọn từ ID; các màn chi tiết/giao bài nhận kết quả này qua props.
  const selected = exams.find((exam) => exam.id === selectedId);

  // Được gọi khi ExamListScreen bấm vào một thẻ đề.
  // Lưu ID đề và chuyển App sang ExamDetailScreen.
  const openExam = (id: number) => {
    setSelectedId(id);
    setScreen('detail');
  };

  // Được gọi từ nút dấu cộng của ExamListScreen.
  // Xóa dữ liệu form cũ, tạo sẵn hai câu hỏi trống rồi mở CreateExamScreen.
  const startCreate = () => {
    setExamName('');
    setQuestions([newQuestion(), newQuestion()]);
    setScreen('create');
  };

  // Callback từ ô nhập câu hỏi trong CreateExamScreen.
  // Tạo mảng/câu hỏi mới để React nhận biết state đã đổi và render lại form.
  const updateQuestionText = (questionIndex: number, text: string) => {
    setQuestions((current) =>
      current.map((question, index) =>
        index === questionIndex ? { ...question, text } : question,
      ),
    );
  };

  // Callback từ ô nhập đáp án trong CreateExamScreen.
  // Cập nhật đúng câu và đúng lựa chọn; sao chép options để không sửa state cũ.
  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    setQuestions((current) =>
      current.map((question, index) => {
        if (index !== questionIndex) {
          return question;
        }

        const options = [...question.options];
        options[optionIndex] = text;
        return { ...question, options };
      }),
    );
  };

  // Callback từ nút tròn cạnh đáp án trong CreateExamScreen.
  // Lưu chỉ số đáp án đúng để màn chi tiết có thể đánh dấu lại đáp án đó.
  const setCorrect = (questionIndex: number, optionIndex: number) => {
    setQuestions((current) =>
      current.map((question, index) =>
        index === questionIndex ? { ...question, correct: optionIndex } : question,
      ),
    );
  };

  // Callback từ nút "+ Thêm câu hỏi" trong CreateExamScreen.
  // Dùng newQuestion để thêm câu có nội dung rỗng và bốn lựa chọn mặc định.
  const addQuestion = () => {
    setQuestions((current) => [...current, newQuestion()]);
  };

  // Callback từ nút "Lưu đề thi" trong CreateExamScreen.
  // Kiểm tra dữ liệu, tạo Exam, thêm vào `exams`, chọn đề mới và chuyển sang chi tiết.
  const saveExam = () => {
    if (!examName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên đề thi.');
      return;
    }

    let filledCount = 0;
    for (let index = 0; index < questions.length; index += 1) {
      if (questions[index].text.trim()) {
        filledCount += 1;
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
      questions,
    };

    setExams((current) => [newExam, ...current]);
    setSelectedId(newId);
    setScreen('detail');
  };

  // Callback từ nút "Giao bài" trong ExamDetailScreen.
  // Nạp thời lượng hiện tại của đề vào form rồi chuyển sang AssignExamScreen.
  const goAssign = () => {
    if (!selected) {
      return;
    }

    setDuration(String(selected.minutes));
    setScreen('assign');
  };

  // Callback từ nút "Giao bài" trong AssignExamScreen.
  // Nếu dữ liệu hợp lệ, cập nhật thời lượng trong `exams` và chuyển sang màn thành công.
  const confirmAssign = () => {
    if (duration === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập thời gian làm bài.');
      return;
    }

    const day = Number(deadline.day);
    const month = Number(deadline.month);
    const year = Number(deadline.year);
    const hour = Number(deadline.hour);
    const minute = Number(deadline.minute);

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

    // Date tự đổi ngày/tháng không hợp lệ (ví dụ 31/02) sang tháng kế tiếp,
    // nên so sánh lại các thành phần để chỉ chấp nhận ngày thực sự tồn tại.
    const deadlineDate = new Date(year, month - 1, day, hour, minute);
    if (
      deadlineDate.getFullYear() !== year ||
      deadlineDate.getMonth() !== month - 1 ||
      deadlineDate.getDate() !== day
    ) {
      Alert.alert('Lỗi', 'Ngày không tồn tại trong tháng đã chọn.');
      return;
    }

    // Không cho giao bài với hạn nộp đã qua, bao gồm mọi ngày thuộc năm 2025.
    if (deadlineDate.getTime() <= Date.now()) {
      Alert.alert('Lỗi', 'Hạn nộp phải là thời điểm trong tương lai.');
      return;
    }

    // Tạo danh sách mới: chỉ đề đang chọn được đổi thời lượng,
    // các đề còn lại được giữ nguyên như cũ.
    setExams(function (currentExams) {
      const updatedExams: Exam[] = [];

      for (const exam of currentExams) {
        if (exam.id === selectedId) {
          const updatedExam: Exam = {
            id: exam.id,
            name: exam.name,
            count: exam.count,
            minutes: Number(duration),
            saved: exam.saved,
            questions: exam.questions,
          };
          updatedExams.push(updatedExam);
        } else {
          updatedExams.push(exam);
        }
      }

      return updatedExams;
    });
    setScreen('done');
  };

  // Điều hướng nội bộ bằng cách chọn component theo `screen` (không dùng router).
  // App truyền dữ liệu xuống Screen qua props; các callback từ Screen gọi lại
  // những hàm xử lý ở trên để cập nhật state và chuyển sang màn kế tiếp.
  if (screen === 'list') {
    return (
      <ExamListScreen
        exams={exams}
        query={query}
        onChangeQuery={setQuery}
        onGoCreate={startCreate}
        onSelectExam={openExam}
      />
    );
  }

  if (screen === 'create') {
    // onBack quay về danh sách; onSave gọi saveExam để kiểm tra, lưu và mở chi tiết.
    return (
      <CreateExamScreen
        examName={examName}
        onChangeExamName={setExamName}
        questions={questions}
        onUpdateQuestionText={updateQuestionText}
        onUpdateOption={updateOption}
        onSetCorrect={setCorrect}
        onAddQuestion={addQuestion}
        onBack={() => setScreen('list')}
        onSave={saveExam}
      />
    );
  }

  if (screen === 'detail' && selected) {
    // Từ chi tiết có thể quay lại danh sách hoặc gọi goAssign để giao đề đang chọn.
    return (
      <ExamDetailScreen
        exam={selected}
        onBack={() => setScreen('list')}
        onGoAssign={goAssign}
      />
    );
  }

  if (screen === 'assign' && selected) {
    // Form giao bài sửa deadline theo từng trường; onBack vẫn giữ đề đang chọn.
    return (
      <AssignExamScreen
        exam={selected}
        duration={duration}
        onChangeDuration={setDuration}
        deadline={deadline}
        onChangeDeadline={(key, value) =>
          setDeadline((current) => ({ ...current, [key]: value }))
        }
        onBack={() => setScreen('detail')}
        onConfirm={confirmAssign}
      />
    );
  }

  if (screen === 'done' && selectedId !== null) {
    // ID đề được dùng để tạo đường dẫn minh họa; nút quay lại trở về danh sách.
    return (
      <AssignSuccessScreen
        examId={selectedId}
        onBack={() => setScreen('list')}
      />
    );
  }

  return null;
}
