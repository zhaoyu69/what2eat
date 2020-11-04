import React from 'react';
import styles from './index.less';
import {Button, Table} from "antd";
import {PlusOutlined} from "@ant-design/icons/lib";

export default () => {
  const columns = [
    {
      key: 'kindInfo',
      dataIndex: 'kindInfo',
      title: '种类信息'
    },
    {
      key: 'creator',
      dataIndex: 'creator',
      title: '创建人'
    },
    {
      key: 'createdAt',
      dataIndex: 'createdAt',
      title: '创建时间'
    },
    {
      key: 'action',
      dataIndex: 'action',
      title: '操作',
      render: () => {
        return <div>
          <a>编辑</a>&nbsp;
          <a>删除</a>
        </div>
      }
    }
  ];
  const dataSource = [];
  return (
    <div className={styles.kindsContainer}>
      <Button type="dashed" className={styles.btnAdd} icon={<PlusOutlined />}>添加</Button>
      <Table columns={columns} dataSource={dataSource}/>
    </div>
  );
}
