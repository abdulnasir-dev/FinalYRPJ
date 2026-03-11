import { API } from "./axiosInstance";

export const toggleLikeSolution = (solutionId) =>
  API.patch(`/votes/toggle/${solutionId}`);