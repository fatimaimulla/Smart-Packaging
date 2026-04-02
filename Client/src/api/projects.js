import apiClient from "@/lib/apiClient";

export const createProjectRequest = (payload = {}) =>
  apiClient.post("/api/projects", payload);

export const getProjectsRequest = () => apiClient.get("/api/projects");

export const getProjectRequest = ({ sessionId }) =>
  apiClient.get(`/api/projects/${sessionId}`);

export const updateProjectConfigRequest = ({ sessionId, ...payload }) =>
  apiClient.patch(`/api/projects/${sessionId}/config`, payload);

export const deleteProjectRequest = ({ sessionId }) =>
  apiClient.delete(`/api/projects/${sessionId}`);
