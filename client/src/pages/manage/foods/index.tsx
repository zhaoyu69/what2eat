import React, {useEffect, useState} from 'react';
import styles from './index.less';
import { connect } from 'dva';
import {Button, Form, Input, InputNumber, message, Modal, Select, Table, Upload} from "antd";
import {ExclamationCircleOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons/lib";
import {IState} from "../../../interface/IState";
import { formItemLayout } from "@/utils/formLayout";
import { upload_action } from '@/utils/common';
const TextArea = Input.TextArea;
import * as moment from 'moment';
import SearchBar from "../../../components/SearchBar";
const Option = Select.Option;

function FoodsPage({dispatch, foods, foodDetail, searchedKinds}) {
  const { pageNo, pageSize, total, data } = foods;
  const { objectId, name, description, thumbUrl, kind, price } = foodDetail;
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    dispatch({ type: 'manageStore/getFoods' });
    searchKinds();
  }, []);

  function edit(objectId) {
    dispatch({type: 'manageStore/getFoodDetail', payload: { id: objectId }});
    setVisible(true);
  }

  useEffect(() => {
    if(foodDetail.objectId) {
      let thumb = thumbUrl ? [{
        uid: Math.random(),
        url: thumbUrl
      }] : [];
      form.setFieldsValue({
        name,
        description,
        thumb,
        kindId: kind?.objectId,
        price
      });
      setFileList(thumb)
    }
  }, [foodDetail.objectId]);

  function removeConfirm(id) {
    Modal.confirm({
      title: '是否删除该餐品?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({ type: 'manageStore/removeFood', payload: { id: id }})
      },
      onCancel() {},
    })
  }

  const columns = [
    {
      key: 'foodInfo',
      dataIndex: 'foodInfo',
      title: '餐品信息',
      render: (foodInfo, record) => {
        const { name, description, thumbUrl } = record;
        return <div className={styles.foodInfo}>
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
      }
    },
    {
      key: 'kind',
      dataIndex: 'kind',
      title: '种类',
      width: 150,
      align: 'center',
      sorter: true,
      render: (kind) => kind.name
    },
    {
      key: 'price',
      dataIndex: 'price',
      title: '人均',
      width: 100,
      align: 'center',
      sorter: true,
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

  function handleOk() {
    form
      .validateFields()
      .then(values => {
        const thumb = values.thumb;
        values.thumbUrl = thumb ? thumb[0]?.response?.files[0]?.url || thumb[0]?.url : '';
        values.id = objectId;
        dispatch({
          type: 'manageStore/updateFood',
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
    setFileList([]);
    dispatch({ type: 'manageStore/save', payload: { foodDetail: {} } });
  }

  function pageNoChange(pageNo) {
    dispatch({ type: 'manageStore/saveFoods', payload: { pageNo } });
    dispatch({ type: 'manageStore/getFoods' });
  }

  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList.filter(item => item.url || item.status);
  };

  function uploadPreview(file) {
    window.open(file.url || file.response.files[0].url, "_blank");
    return false;
  }

  function uploadChange({fileList}) {
    setFileList(fileList);
  }

  function searchKinds() {
    dispatch({ type: 'manageStore/searchKinds' });
  }

  function handleSearch(values) {
    if(typeof values.minPrice === "number" && typeof values.maxPrice === "number") {
      if(values.minPrice > values.maxPrice) {
        message.error('人均最小值应小于等于人均最大值');
        return ;
      }
    }
    dispatch({ type: 'manageStore/saveSearch', payload: { type: 'foods', ...values }});
    dispatch({ type: 'manageStore/getFoods' });
  }

  function handleClear() {
    dispatch({ type: 'manageStore/resetSearch', payload: { type: 'foods' }});
    dispatch({ type: 'manageStore/getFoods' });
  }

  function tableChange(pagination, filters, sorter) {
    dispatch({ type: 'manageStore/saveSearch', payload: { type: 'foods', sorter }});
    dispatch({ type: 'manageStore/getFoods' });
  }

  return (
    <div className={styles.foodsContainer}>
      <SearchBar
        formItems={[
          {
            props: {
              name: 'name',
              label: '名称',
            },
            children: <Input placeholder="输入餐品名称" allowClear/>
          },
          {
            props: {
              name: 'kindIds',
              label: '种类'
            },
            children: <Select
              mode="multiple"
              placeholder={'选择种类（可选多个）'}
              allowClear
            >
              {
                searchedKinds.map(kind => {
                  const { objectId, name } = kind;
                  return <Option key={objectId}>{name}</Option>
                })
              }
            </Select>
          },
          {
            props: {
              label: '人均',
            },
            children: <div className={styles.priceSearch}>
              <Form.Item name={'minPrice'} style={{ width: '100%' }}>
                <InputNumber placeholder="输入人均最小值" style={{ width: '100%' }}/>
              </Form.Item>
              <div className={styles.split}>-</div>
              <Form.Item name={'maxPrice'} style={{ width: '100%' }}>
                <InputNumber placeholder="输入人均最大值" style={{ width: '100%' }}/>
              </Form.Item>
            </div>
          },
        ]}
        onSearch={handleSearch}
        onClear={handleClear}
      />
      <Button type="dashed" className={styles.btnAdd} icon={<PlusOutlined />} onClick={e => setVisible(true)}>添加</Button>
      <Modal
        title="餐品添加"
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
          <Form.Item
            name="kindId"
            label="所属种类"
            rules={[{ required: true, message: '请选择所属种类!' }]}
          >
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="请选择所属种类"
              optionFilterProp="children"
              // onSearch={searchKinds}
            >
              {
                searchedKinds.map(kind => {
                  const { objectId, name } = kind;
                  return <Option value={objectId} key={objectId}>{name}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item name="price" label="人均">
            <InputNumber min={0} max={99999} placeholder="请输入人均" style={{ width: "100%" }}/>
          </Form.Item>
          <Form.Item
            name="thumb"
            label="展示图"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              action={upload_action}
              listType="picture-card"
              accept="image/*"
              onPreview={uploadPreview}
              onChange={uploadChange}
            >
              {
                fileList && fileList.length >= 1 ? null :
                  <div>
                    <UploadOutlined /> 上传
                  </div>
              }
            </Upload>
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
    </div>
  );
}

export default connect((state:IState) => {
  const { foods, foodDetail, searchedKinds } = state.manageStore;
  return { foods, foodDetail, searchedKinds }
})(FoodsPage);
