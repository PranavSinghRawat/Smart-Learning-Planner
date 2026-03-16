import api from './api';

export const getSubjects = async (examId) => {
  const url = examId ? `/subjects?examId=${examId}` : '/subjects';
  const res = await api.get(url);
  return res.data;
};

export const createSubject = async (subjectData) => {
  const res = await api.post('/subjects', subjectData);
  return res.data;
};
