import { API } from "./axiosInstance";


export const fetchSolutionsForProblem = (problemId) =>
  API.get(`/solutions/${problemId}`);

export const createSolution = (problemId, answer) =>
  API.post(`/solutions/create/${problemId}`, { answer });

export const acceptSolution = (solutionId) =>
  API.patch(`/solutions/accept/${solutionId}`);

export const reportSolution = (solutionId) =>
  API.post(`/solutions/${solutionId}/report`);

