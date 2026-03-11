import { API } from "./axiosInstance";

/* ===================== PROBLEMS ===================== */

export const fetchAllProblems = (page = 1, limit = 10) =>
  API.get(`/problems?page=${page}&limit=${limit}`);

export const fetchProblemById = (problemId) =>
  API.get(`/problems/${problemId}`);

export const createProblem = (formData) =>
  API.post("/problems/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const editProblem = (problemId, formData) =>
  API.patch(`/problems/${problemId}/edit`, formData);
