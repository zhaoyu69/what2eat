import React, {useEffect, useMemo, useRef, useState} from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { grid9Generator, getRandomInt } from "@/utils/common";
import {Button, Modal} from "antd";
import {PauseCircleOutlined, PlayCircleOutlined} from "@ant-design/icons/lib";
import CustomIcon from "../../components/CustomIcon";

function IndexPage({ dispatch, currentPool }) {
  const timers = useRef({});
  const [key, setKey] = useState(-1);
  const [isStart, setIsStart] = useState(false);
  const finalKey = useRef(null); // 最终的key

  useEffect(() => {
    dispatch({ type: 'userStore/getCurrentPool' });
    return () => {
      resetTimers();
      if(finalKey.current) {
        finalKey.current = null;
      }
    }
  }, []);

  function resetTimers(keys=['randomKey', 'stopDelay', 'autoStop']) {
    keys.map(key => {
      if(timers.current && timers.current[key]) {
        clearInterval(timers.current[key]);
        timers.current[key] = null;
      }
    });
  }

  useEffect(() => {
    finalKey.current = key;
  }, [key]);

  function start() {
    if(isStart || timers.current?.stopDelay) {
      // 未结束或结束的延迟未完成直接返回
      return ;
    }
    setIsStart(true);
    timers.current.randomKey = setInterval(() => {
      // 随机生成key
      setKey(getRandomInt(0, currentPool?.foods?.length));
    }, 200);
    timers.current.autoStop = setTimeout(() => {
      // 10s自动停下
      stop();
    }, 1000 * 10);
  }

  function stop() {
    setIsStart(false);
    if(timers.current?.randomKey) {
      timers.current.stopDelay = setTimeout(() => {
        // 延迟停下
        resetTimers();
        const currentFood = currentPool?.foods[finalKey.current];
        Modal.info({
          centered: true,
          icon: <CustomIcon type={'congratulation'} />,
          title: '恭喜恭喜恭喜你呀，抽中了！',
          content: <div className={styles.resultModal}>
            <div className={styles.thumb}>
              <img src={currentFood?.thumbUrl} alt=""/>
            </div>
            <div className={styles.name}>
              {currentFood?.name}
            </div>
          </div>,
          okText: '去打卡'
        });
      }, 1000);
    }
  }

  return (
    <div className={styles.indexPage}>
      <div className={styles.main}>
        <div className={styles.title}>
          { currentPool?.name ?? '当前暂无抽奖' }
        </div>
        <div className={styles.grids}>
          { grid9Generator(currentPool && currentPool.foods || []).map((food, idx) => {
            const isActive = idx === key;
            return <div className={styles.grid} style={{ border: isActive ? '2px solid red' : '1px solid #eee' }}>
              <div className={styles.gridImg}>
                <img src={food?.thumbUrl} alt=""/>
              </div>
              <div className={styles.gridName}>
                { food?.name }
              </div>
            </div>
          }) }
        </div>
        <div className={styles.control}>
          {
            !isStart ? <Button type={"primary"} icon={<PlayCircleOutlined />} onClick={start} disabled={!currentPool}>开始</Button> :
              <Button type={"primary"} icon={<PauseCircleOutlined />} onClick={stop} disabled={!currentPool}>结束</Button>
          }
        </div>
      </div>
    </div>
  );
}

export default connect(state => {
  const { currentPool } = state.userStore;
  return { currentPool }
})(IndexPage);
