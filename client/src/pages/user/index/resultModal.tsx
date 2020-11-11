import CustomIcon from "../../../components/CustomIcon";
import React from "react";
import styles from './index.less';

export function getResultModalProps(currentFood) {
  return {
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
  }
}
