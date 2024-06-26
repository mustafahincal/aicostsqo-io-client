import { instance as axios } from "./axiosInstance";

export const bulkDeleteRps = (data: string[]) =>
  axios.post("/rps/bulk-delete", data);

export const getRps = () => axios.get("/rps");

export const copyPasteRp = (siteBoundId: string, data: any) =>
  axios.post(`/rps/copy-paste/${siteBoundId}`, data);

export const createRp = (data: any) => axios.post("/rps", data);

export const updateRp = (id: string, data: any) =>
  axios.put(`/rps/${id}`, data);

export const getRpsBySiteBoundId = (siteBoundId: string) =>
  axios.get(`/rps/${siteBoundId}`);

export const createRpsByManual = (data: any) => axios.post("/rps/manual", data);

export const getRpDistributionCurves = (data: any) =>
  axios.post(`/rps/distribution-curves`, data);

export const getExportedRps = (siteBoundId: string) =>
  axios.get(`/rps/export/by-site-bound/${siteBoundId}`);
