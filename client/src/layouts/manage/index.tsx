import React from 'react';
import styles from './index.less';
import {Layout, Menu} from "antd";
const { Header, Sider, Content } = Layout;
import { Link } from 'umi';
const { SubMenu } = Menu;

export default function ManageLayout({ children }) {
  return (
    <Layout className={styles.manageLayout}>
      <Header className={styles.header}>
        <Link to={"/"}>
          <div className={styles.logo}>
            <img src={require('../../assets/images/logo.png')}/>
          </div>
        </Link>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: "#2D3456", position: "relative" }}>
          <Menu
            theme="dark"
            mode="inline"
          >
            <Menu.Item key={"/manage/kinds"}>
              <Link to={"/manage/kinds"}>
                种类管理
              </Link>
            </Menu.Item>
            <Menu.Item key={"/manage/foods"}>
              <Link to={"/manage/foods"}>
                餐品管理
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: "16px", background: "#EEF5FD" }}>
          <Content className={styles.content}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
