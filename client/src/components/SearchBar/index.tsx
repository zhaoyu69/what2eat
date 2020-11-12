import React from 'react';
import styles from './index.less';
import {Button, Col, Form, Row} from "antd";

export default function SearchBar({formItems, onSearch, onClear}) {
  const [form] = Form.useForm();

  const onFinish = values => {
    onSearch(values);
  };

  return (
    <div className={styles.searchBar}>
      <Form
        form={form}
        onFinish={onFinish}
      >
        <Row gutter={24}>
          {
            formItems.map(formItem => {
              const { props, children } = formItem;
              return <Col span={8}>
                <Form.Item
                  { ...props }
                >
                  { children }
                </Form.Item>
              </Col>
            })
          }
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                form.resetFields();
                onClear();
              }}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
