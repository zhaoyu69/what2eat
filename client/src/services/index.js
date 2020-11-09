import request from "../utils/request";

/*
* kinds
* */
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

/*
* foods
* */
export function getFoods(opt) {
  return request('/api/food/getFoods', { ...opt });
}

export function getFoodDetail(opt) {
  return request('/api/food/getFoodDetail', { ...opt });
}

export function updateFood(opt) {
  return request('/api/food/updateFood', { ...opt });
}

export function removeFood(opt) {
  return request('/api/food/removeFood', { ...opt });
}

/*
* pools
* */
export function getPools(opt) {
  return request('/api/pool/getPools', { ...opt });
}

export function getPoolDetail(opt) {
  return request('/api/pool/getPoolDetail', { ...opt });
}

export function updatePool(opt) {
  return request('/api/pool/updatePool', { ...opt });
}

export function removePool(opt) {
  return request('/api/pool/removePool', { ...opt });
}

export function setCurrentPool(opt) {
  return request('/api/pool/setCurrentPool', { ...opt });
}

export function getCurrentPool(opt) {
  return request('/api/pool/getCurrentPool', { ...opt });
}
