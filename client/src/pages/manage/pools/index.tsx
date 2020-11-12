import React, {useEffect, useState} from 'react';
import styles from './index.less';
import { connect } from 'dva';
import {Button, Form, Input, Modal, Pagination, Select, Card, Row, Col, Tag, Table} from "antd";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined, MinusCircleOutlined,
  PlusOutlined
} from "@ant-design/icons/lib";
import {IState} from "../../../interface/IState";
import { formItemLayout } from "@/utils/formLayout";
const TextArea = Input.TextArea;
const Option = Select.Option;
const { Meta } = Card;
import { grid9Generator } from "@/utils/common";
import MultiClamp from 'react-multi-clamp';
import CustomIcon from "../../../components/CustomIcon";
import cx from "classnames";
import SearchBar from "../../../components/SearchBar";
import * as moment from "moment";

function PoolsPage({dispatch, pools, poolDetail, searchedFoods}) {
  const { pageNo, pageSize, total, data } = pools;
  const { objectId, name, description, foods } = poolDetail;
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({ type: 'manageStore/getPools' });
    searchFoods();
  }, []);

  const columns = [
    {
      key: 'poolInfo',
      dataIndex: 'poolInfo',
      title: '奖池信息',
      render: (poolInfo, record) => {
        const { name, description } = record;
        return <div className={styles.poolInfo}>
          <h4 className={styles.name}>{name}</h4>
          <div className={styles.description}>{description}</div>
        </div>
      }
    },
    {
      key: 'isCurrent',
      dataIndex: 'isCurrent',
      title: '状态',
      width: 100,
      align: 'center',
      sorter: true,
      render: (isCurrent, record) => isCurrent ?
        <Tag color={'#87d068'}>当前</Tag> :
        <Tag color={'gray'} onClick={e => setCurrentConfirm(record.objectId)} style={{ cursor: 'pointer' }}>以往</Tag>
    },
    {
      key: 'foods',
      dataIndex: 'foods',
      title: '包含餐品',
      width: 400,
      align: 'center',
      render: (foods) => {
        return <div className={styles.includeFoods}>
          {
            foods.slice(0, 9).map(food => {
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
        </div>
      }
    },
    {
      key: 'createdAt',
      dataIndex: 'createdAt',
      title: '创建时间',
      width: 200,
      align: 'center',
      sorter: true,
      render: (createdAt) => moment(createdAt).format('YYYY/MM/DD HH:mm:ss')
    },
    {
      key: 'action',
      dataIndex: 'action',
      title: '操作',
      width: 100,
      align: 'center',
      render: (action, record) => {
        const { objectId } = record;
        return <div>
          <a onClick={e => edit(objectId)}>编辑</a>&nbsp;&nbsp;
          <a onClick={e => removeConfirm(objectId)}>删除</a>
        </div>
      }
    }
  ];

  function edit(objectId) {
    dispatch({type: 'manageStore/getPoolDetail', payload: { id: objectId }});
    setVisible(true);
  }

  useEffect(() => {
    if(poolDetail.objectId) {
      form.setFieldsValue({
        name,
        description,
        foodIds: foods.map(food => food.objectId)
      });
    }
  }, [poolDetail.objectId]);

  function removeConfirm(id) {
    Modal.confirm({
      title: '是否删除该奖池?',
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

  function setCurrentConfirm(id) {
    Modal.confirm({
      title: '是否激活该奖池?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'manageStore/setCurrentPool',
          payload: { id, isCurrent: true }
        });
      },
      onCancel() {},
    });
  }

  function handleSearch(values) {
    if(values.isCurrent) {
      values.isCurrent = !!Number(values.isCurrent);
    }
    dispatch({ type: 'manageStore/saveSearch', payload: { type: 'pools', ...values }});
    dispatch({ type: 'manageStore/getPools' });
  }

  function handleClear() {
    dispatch({ type: 'manageStore/resetSearch', payload: { type: 'pools' }});
    dispatch({ type: 'manageStore/getPools' });
  }

  function tableChange(pagination, filters, sorter) {
    dispatch({ type: 'manageStore/saveSearch', payload: { type: 'pools', sorter }});
    dispatch({ type: 'manageStore/getPools' });
  }

  return (
    <div className={styles.poolsContainer}>
      <SearchBar
        formItems={[
          {
            props: {
              name: 'name',
              label: '名称',
            },
            children: <Input placeholder="输入奖池名称" allowClear/>
          },
          {
            props: {
              name: 'foodIds',
              label: '包含餐品'
            },
            children: <Select
              mode="multiple"
              placeholder="选择餐品（可选多个）"
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
          }, {
            props: {
              name: 'isCurrent',
              label: '状态',
            },
            children: <Select
              placeholder={'选择状态'}
              allowClear
            >
              <Option key={1}>当前</Option>
              <Option key={0}>以往</Option>
            </Select>
          },
        ]}
        onSearch={handleSearch}
        onClear={handleClear}
      />
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
      <Table
        columns={columns}
        dataSource={data}
        onChange={tableChange}
        pagination={{
          total,
          current: pageNo,
          showQuickJumper: true,
          onChange: pageNoChange,
          showTotal: (total) => `共${Math.ceil(total / pageSize)}页/${total}条数据`
        }}
      />
      {/*{*/}
      {/*  !data.length ? null :*/}
      {/*    <div className={styles.listWrap}>*/}
      {/*      <div className={styles.list}>*/}
      {/*        {*/}
      {/*          data.map((item, idx) => {*/}
      {/*            const isRowLast = (idx + 1) % 5 === 0;*/}
      {/*            const { objectId, name, description, foods, createdAt, isCurrent } = item;*/}
      {/*            return <div className={styles.item} key={objectId}>*/}
      {/*              <div className={styles.itemInner} style={{ marginRight: !isRowLast ? '10px' : ''}}>*/}
      {/*                <Card*/}
      {/*                  hoverable*/}
      {/*                  cover={<div className={styles.cover}>*/}
      {/*                    {*/}
      {/*                      grid9Generator(foods).map(food => {*/}
      {/*                        if(!food) {*/}
      {/*                          return <div className={cx(styles.smallFood, styles.noFood)}>*/}
      {/*                            <div className={styles.thumb}>*/}
      {/*                              <CustomIcon type={"empty"} style={{ color:"rgba(59, 59, 59, 0.3)" }}/>*/}
      {/*                            </div>*/}
      {/*                            <div className={styles.name} style={{color:"rgba(59, 59, 59, 0.3)"}}>未设置</div>*/}
      {/*                          </div>*/}
      {/*                        }*/}
      {/*                        return <div className={styles.smallFood}>*/}
      {/*                          <div className={styles.thumb}>*/}
      {/*                            { food?.thumbUrl ? <img src={food.thumbUrl} alt=""/> : <div className={styles.noThumb}/>}*/}
      {/*                          </div>*/}
      {/*                          <div className={styles.name}>*/}
      {/*                            { food?.name }*/}
      {/*                          </div>*/}
      {/*                        </div>*/}
      {/*                      })*/}
      {/*                    }*/}
      {/*                  </div>}*/}
      {/*                  actions={[*/}
      {/*                    <EditOutlined onClick={e => edit(objectId)}/>,*/}
      {/*                    <DeleteOutlined onClick={e => removeConfirm(objectId)}/>,*/}
      {/*                  ]}*/}
      {/*                >*/}
      {/*                  <Meta*/}
      {/*                    title={*/}
      {/*                      <div className={styles.metaTitle}>*/}
      {/*                        <div className={styles.metaTitleName}>*/}
      {/*                          <span title={description}>*/}
      {/*                            <MultiClamp ellipsis="..." clamp={1}>*/}
      {/*                              {name}*/}
      {/*                            </MultiClamp>*/}
      {/*                          </span>*/}
      {/*                        </div>*/}
      {/*                        <div className={styles.metaTitleTag}>*/}
      {/*                          {*/}
      {/*                            isCurrent ?*/}
      {/*                              <Tag color="#87d068">当前</Tag> :*/}
      {/*                              <Tag color="#ccc" style={{ cursor: 'pointer' }} onClick={e => setCurrentConfirm(objectId)}>往期</Tag>*/}
      {/*                          }*/}
      {/*                        </div>*/}
      {/*                      </div>*/}
      {/*                    }*/}
      {/*                    description={*/}
      {/*                      <span title={description}>*/}
      {/*                        <MultiClamp ellipsis="..." clamp={1}>*/}
      {/*                          {description}*/}
      {/*                        </MultiClamp>*/}
      {/*                      </span>*/}
      {/*                    }*/}
      {/*                  />*/}
      {/*                </Card>*/}
      {/*              </div>*/}
      {/*            </div>*/}
      {/*          })*/}
      {/*        }*/}
      {/*      </div>*/}
      {/*      <div className={styles.pagination}>*/}
      {/*        <Pagination*/}
      {/*          total={total}*/}
      {/*          current={pageNo}*/}
      {/*          showQuickJumper={true}*/}
      {/*          onChange={pageNoChange}*/}
      {/*          showTotal={(total) => `共${Math.ceil(total / pageSize)}页/${total}条数据`}*/}
      {/*        />*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*}*/}
    </div>
  );
}

export default connect((state:IState) => {
  const { pools, poolDetail, searchedFoods } = state.manageStore;
  return { pools, poolDetail, searchedFoods }
})(PoolsPage);
