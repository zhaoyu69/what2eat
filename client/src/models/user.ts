import * as service from '../services/index';
import {message} from "antd";

const userModel = {
  namespace: 'userStore',
  state: {
    currentPool: {}
  },
  effects: {
    *getCurrentPool({  }, { put, call, select }) {
      const result = yield call(service.getCurrentPool, {
        method: 'POST',
      });
      if(result.code === 0) {
        yield put({
          type: 'save',
          payload: {
            currentPool: result.data,
          }
        })
      } else {
        message.error(result.message)
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  }
};

export default userModel;
