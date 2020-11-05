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
    kindDetail: {}
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
  }
};

export default manageModel;
