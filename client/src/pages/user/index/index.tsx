import React, {useEffect, useState} from 'react';
import styles from './index.less';
import { connect } from 'dva';
import {SwapOutlined} from "@ant-design/icons/lib";
import Scratch from "./Scratch";
import Grid9 from "./Grid9";

function IndexPage({ dispatch, currentPool }) {
  const [typer, setTyper] = useState(false);

  useEffect(() => {
    dispatch({ type: 'userStore/getCurrentPool' });
  }, []);

  function handleSwitchType() {
    setTyper(!typer);
  }

  return (
    <div className={styles.indexPage}>
      <div className={styles.typeSwitcher} onClick={handleSwitchType}>
        <SwapOutlined style={{ fontSize:18, color: 'rgba(0,0,0,.65)' }}/>
      </div>
      {
        typer ? <Scratch currentPool={currentPool}/> :
          <Grid9 currentPool={currentPool}/>
      }

    </div>
  );
}

export default connect(state => {
  const { currentPool } = state.userStore;
  return { currentPool }
})(IndexPage);
