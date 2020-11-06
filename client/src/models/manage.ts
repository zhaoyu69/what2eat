import * as service from '../services/index';
import {message} from "antd";

const manageModel = {
  namespace: 'manageStore',
  state: {
    kinds: {
      pageNo: 1,
      pageSize: 10,
      data: [],
      total: 0,
    },
    kindDetail: {},
    foods: {
      pageNo: 1,
      pageSize: 10,
      data: [],
      total: 0,
    },
    searchedKinds: [],
    foodDetail: {},
    pools: {
      pageNo: 1,
      pageSize: 10,
      data: [],
      total: 0,
    },
    searchedFoods: [],
    poolDetail: {},
  },
  effects: {
    *getKinds({  }, { put, call, select }) {
      const { kinds } = yield select(state => state.manageStore);
      const { pageNo, pageSize } = kinds;
      const result = yield call(service.getKinds, {
        method: 'POST',
        data: { pageNo, pageSize }
      });
      if(result.code === 0) {
        yield put({
          type: 'saveKinds',
          payload: {
            data: result.data.list,
            total: result.data.total
          }
        })
      } else {
        message.error(result.message)
      }
    },

    *getKindDetail({ payload }, { put, call, select }) {
      const { id } = payload;
      const result = yield call(service.getKindDetail, {
        method: 'POST',
        data: { id }
      });
      if(result.code === 0) {
        yield put({
          type: 'save',
          payload: {
            kindDetail: result.data
          }
        });
      } else {
        message.error(result.message)
      }
    },

    *updateKind({ payload }, { put, call, select }) {
      const { id, name, description, thumbUrl, cb } = payload;
      const result = yield call(service.updateKind, {
        method: 'POST',
        data: { id, name, description, thumbUrl }
      });
      if(result.code === 0) {
        yield put({ type: 'getKinds' });
        yield cb && cb();
        message.success(`${id ? '更新' : '添加'}成功`);
      } else {
        message.error(result.message)
      }
    },

    *removeKind({ payload }, { put, call, select }) {
      const { id } = payload;
      const result = yield call(service.removeKind, {
        method: 'POST',
        data: { id }
      });
      if(result.code === 0) {
        yield put({ type: 'getKinds' });
        message.success(`删除成功`);
      } else {
        message.error(result.message)
      }
    },

    *searchKinds({ payload }, { put, call, select }) {
      const { name } = payload;
      const result = yield call(service.getKinds, {
        method: 'POST',
        data: { name }
      });
      if(result.code === 0) {
        yield put({
          type: 'save',
          payload: {
            searchedKinds: result.data.list
          }
        });
      } else {
        message.error(result.message)
      }
    },

    *getFoods({  }, { put, call, select }) {
      const { foods } = yield select(state => state.manageStore);
      const { pageNo, pageSize } = foods;
      const result = yield call(service.getFoods, {
        method: 'POST',
        data: { pageNo, pageSize }
      });
      if(result.code === 0) {
        yield put({
          type: 'saveFoods',
          payload: {
            data: result.data.list,
            total: result.data.total
          }
        })
      } else {
        message.error(result.message)
      }
    },

    *getFoodDetail({ payload }, { put, call, select }) {
      const { id } = payload;
      const result = yield call(service.getFoodDetail, {
        method: 'POST',
        data: { id }
      });
      if(result.code === 0) {
        yield put({
          type: 'save',
          payload: {
            foodDetail: result.data
          }
        });
      } else {
        message.error(result.message)
      }
    },

    *updateFood({ payload }, { put, call, select }) {
      const { id, name, description, kindId, price, thumbUrl, cb } = payload;
      const result = yield call(service.updateFood, {
        method: 'POST',
        data: { id, name, description, kindId, price, thumbUrl }
      });
      if(result.code === 0) {
        yield put({ type: 'getFoods' });
        yield cb && cb();
        message.success(`${id ? '更新' : '添加'}成功`);
      } else {
        message.error(result.message)
      }
    },

    *removeFood({ payload }, { put, call, select }) {
      const { id } = payload;
      const result = yield call(service.removeFood, {
        method: 'POST',
        data: { id }
      });
      if(result.code === 0) {
        yield put({ type: 'getFoods' });
        message.success(`删除成功`);
      } else {
        message.error(result.message)
      }
    },

    *searchFoods({ payload }, { put, call, select }) {
      const { name } = payload;
      const result = yield call(service.getFoods, {
        method: 'POST',
        data: { name }
      });
      if(result.code === 0) {
        yield put({
          type: 'save',
          payload: {
            searchedFoods: result.data.list
          }
        });
      } else {
        message.error(result.message)
      }
    },

    *getPools({  }, { put, call, select }) {
      const { pools } = yield select(state => state.manageStore);
      const { pageNo, pageSize } = pools;
      const result = yield call(service.getPools, {
        method: 'POST',
        data: { pageNo, pageSize }
      });
      if(result.code === 0) {
        yield put({
          type: 'savePools',
          payload: {
            data: result.data.list,
            total: result.data.total
          }
        })
      } else {
        message.error(result.message)
      }
    },

    *getPoolDetail({ payload }, { put, call, select }) {
      const { id } = payload;
      const result = yield call(service.getPoolDetail, {
        method: 'POST',
        data: { id }
      });
      if(result.code === 0) {
        yield put({
          type: 'save',
          payload: {
            poolDetail: result.data
          }
        });
      } else {
        message.error(result.message)
      }
    },

    *updatePool({ payload }, { put, call, select }) {
      const { id, name, description, foodIds, cb } = payload;
      const result = yield call(service.updatePool, {
        method: 'POST',
        data: { id, name, description, foodIds }
      });
      if(result.code === 0) {
        yield put({ type: 'getPools' });
        yield cb && cb();
        message.success(`${id ? '更新' : '添加'}成功`);
      } else {
        message.error(result.message)
      }
    },

    *removePool({ payload }, { put, call, select }) {
      const { id } = payload;
      const result = yield call(service.removePool, {
        method: 'POST',
        data: { id }
      });
      if(result.code === 0) {
        yield put({ type: 'getPools' });
        message.success(`删除成功`);
      } else {
        message.error(result.message)
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveKinds(state, action) {
      const kinds = {
        ...state.kinds,
        ...action.payload
      };
      return { ...state, kinds };
    },
    saveFoods(state, action) {
      const foods = {
        ...state.foods,
        ...action.payload
      };
      return { ...state, foods };
    },
    savePools(state, action) {
      const pools = {
        ...state.pools,
        ...action.payload
      };
      return { ...state, pools };
    },
  }
};

export default manageModel;
