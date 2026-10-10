// Cấu trúc một câu hỏi trong form tạo đề và trong mỗi đề đã lưu.
export type Question = {
  text: string;
  options: string[];
  correct: number;
};

// Cấu trúc một đề thi; `questions` chứa các câu hỏi thuộc đề.
export type Exam = {
  id: number;
  name: string;
  count: number;
  minutes: number;
  saved: boolean;
  questions: Question[];
};

// Tách ngày/giờ thành chuỗi để TextInput có thể hiển thị và chỉnh sửa trực tiếp.
export type Deadline = {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
};
