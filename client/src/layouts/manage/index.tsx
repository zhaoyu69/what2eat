import React, {useState} from 'react';
import styles from './index.less';
import {Breadcrumb, Layout, Menu} from "antd";
const { Header, Sider, Content } = Layout;
import { Link, withRouter } from 'umi';
import { menus } from '@/utils/common';
const breadcrumbs = {
  '/manage/kinds': [{ name: '种类管理' }],
  '/manage/foods': [{ name: '餐品管理' }]
};

function ManageLayout({ children }) {
  const { pathname } = window.location;
  return (
    <Layout className={styles.manageLayout}>
      <Header className={styles.header}>
        <Link to={"/manage"}>
          <div className={styles.logo}>
            <img src={require('../../assets/images/logo.png')}/>
          </div>
        </Link>
      </Header>
      <Layout>
        <Sider width={200}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[pathname]}
          >
            {
              menus.map(menu => {
                const { path, name, icon } = menu;
                return <Menu.Item key={path}>
                  <Link to={path}>
                    {icon}{name}
                  </Link>
                </Menu.Item>
              })
            }
          </Menu>
        </Sider>
        <Layout className={styles.contentWrap}>
          <div className={styles.breadcrumbs}>
            <Breadcrumb>
              <Breadcrumb.Item>
                <a href="/manage">主页</a>
              </Breadcrumb.Item>
              {
                breadcrumbs[pathname]?.map(breadcrumb => {
                  const { name, href } = breadcrumb;
                  return <Breadcrumb.Item>
                    { href ? <a href={href}>{name}</a> : name }
                  </Breadcrumb.Item>
                })
              }
            </Breadcrumb>
          </div>
          <Content className={styles.content}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default withRouter(ManageLayout);
