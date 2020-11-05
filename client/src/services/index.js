import request from "../utils/request";

export function getKinds(opt) {
  return request('/api/kind/getKinds', { ...opt });
}

export function getKindDetail(opt) {
  return request('/api/kind/getKindDetail', { ...opt });
}

export function updateKind(opt) {
  return request('/api/kind/updateKind', { ...opt });
}

export function removeKind(opt) {
  return request('/api/kind/removeKind', { ...opt });
}
