import api from './api';

export const getExams = async () => {
  const res = await api.get('/exams');
  return res.data;
};

export const createExam = async (examData) => {
  const res = await api.post('/exams', examData);
  return res.data;
};
