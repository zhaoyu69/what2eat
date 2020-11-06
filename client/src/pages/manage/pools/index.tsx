import React, {useEffect, useState} from 'react';
import styles from './index.less';
import { connect } from 'dva';
import {Button, Form, Input, Modal, Pagination, Select, Card, Row, Col} from "antd";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {IState} from "../../../interface/IState";
import { formItemLayout } from "@/utils/formLayout";
const TextArea = Input.TextArea;
const Option = Select.Option;
const { Meta } = Card;
import { grid9Generator } from "@/utils/common";
import * as moment from 'moment';

function PoolsPage({dispatch, pools, poolDetail, searchedFoods}) {
  const { pageNo, pageSize, total, data } = pools;
  const { objectId, name, description } = poolDetail;
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  console.log(data);

  useEffect(() => {
    dispatch({ type: 'manageStore/getPools' });
  }, []);

  function edit(objectId) {
    dispatch({type: 'manageStore/getPoolDetail', payload: { id: objectId }});
    setVisible(true);
  }

  useEffect(() => {
    if(poolDetail.objectId) {
      form.setFieldsValue({
        name,
        description,
      });
    }
  }, [poolDetail.objectId]);

  useEffect(() => {
    if(visible) {
      searchFoods();
    }
  }, [visible]);

  function removeConfirm(id) {
    Modal.confirm({
      title: '是否删除该种类?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({ type: 'manageStore/removePool', payload: { id: id }})
      },
      onCancel() {},
    })
  }

  function handleOk() {
    form
      .validateFields()
      .then(values => {
        values.id = objectId;
        dispatch({
          type: 'manageStore/updatePool',
          payload: { ...values, cb: () => { handleCancel() } }
        });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
    // setVisible(false);
  }

  function handleCancel() {
    setVisible(false);
    form.resetFields();
    dispatch({ type: 'manageStore/save', payload: { poolDetail: {} } });
  }

  function pageNoChange(pageNo) {
    dispatch({ type: 'manageStore/savePools', payload: { pageNo } });
    dispatch({ type: 'manageStore/getPools' });
  }

  function searchFoods(name='') {
    dispatch({ type: 'manageStore/searchFoods', payload: { name } });
  }

  return (
    <div className={styles.poolsContainer}>
      <Button type="dashed" className={styles.btnAdd} icon={<PlusOutlined />} onClick={e => setVisible(true)}>添加</Button>
      <Modal
        title="奖池添加"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        forceRender
        maskClosable={false}
      >
        <Form
          {...formItemLayout}
          form={form}
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称!' }]}
          >
            <Input placeholder={'请输入名称'}/>
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea autoSize={{ minRows: 3, maxRows: 5 }} placeholder={'请输入描述'}/>
          </Form.Item>
          <Form.Item name="foodIds" label="餐品">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请选择餐品"
              // onSearch={searchFoods}
              optionFilterProp="label"
              optionLabelProp="label"
              dropdownClassName={styles.searchedFoodWrap}
            >
              {
                searchedFoods.map(food => {
                  const { objectId, name, description, thumbUrl } = food;
                  return <Option key={objectId} value={objectId} label={name}>
                    <div className={styles.searchedFoodItem}>
                      <div className={styles.left}>
                        {
                          thumbUrl ? <img src={thumbUrl} alt=""/> : <div className={styles.noThumb} />
                        }
                      </div>
                      <div className={styles.right}>
                        <h4 className={styles.name}>{name}</h4>
                        <div className={styles.description}>{description}</div>
                      </div>
                    </div>
                  </Option>
                })
              }
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      {
        !data.length ? null :
          <div className={styles.listWrap}>
            <div className={styles.list}>
              {
                data.map((item, idx) => {
                  const isRowLast = idx % 4 === 0;
                  const { objectId, name, description, foods, createdAt } = item;
                  return <div className={styles.item} key={objectId}>
                    <div className={styles.itemInner} style={{ marginRight: !isRowLast ? '10px' : ''}}>
                      <Card
                        hoverable
                        cover={<div className={styles.cover}>
                          {
                            grid9Generator(foods).map(food => {
                              return <div className={styles.smallFood}>
                                <div className={styles.thumb}>
                                  { food?.thumbUrl ? <img src={food.thumbUrl} alt=""/> : <div className={styles.noThumb}/>}
                                </div>
                                <div className={styles.name}>
                                  { food?.name }
                                </div>
                              </div>
                            })
                          }
                        </div>}
                      >
                        <Meta title={name} description={description} />
                      </Card>
                    </div>
                  </div>
                })
              }
            </div>
            <div className={styles.pagination}>
              <Pagination
                total={total}
                current={pageNo}
                showQuickJumper={true}
                onChange={pageNoChange}
                showTotal={(total) => `共${Math.ceil(total / pageSize)}页/${total}条数据`}
              />
            </div>
          </div>
      }
    </div>
  );
}

export default connect((state:IState) => {
  const { pools, poolDetail, searchedFoods } = state.manageStore;
  return { pools, poolDetail, searchedFoods }
})(PoolsPage);
