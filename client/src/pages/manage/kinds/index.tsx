import React, {useEffect, useState} from 'react';
import styles from './index.less';
import { connect } from 'dva';
import {Button, Form, Input, Modal, Table, Upload} from "antd";
import {ExclamationCircleOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons/lib";
import {IState} from "../../../interface/IState";
import { formItemLayout } from "@/utils/formLayout";
import { upload_action } from '@/utils/common';
const TextArea = Input.TextArea;
import * as moment from 'moment';

function KindsPage({dispatch, kinds, kindDetail}) {
  const { pageNo, pageSize, total, data } = kinds;
  const { objectId, name, description, thumbUrl } = kindDetail;
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    dispatch({ type: 'manageStore/getKinds' });
  }, []);

  function edit(objectId) {
    dispatch({type: 'manageStore/getKindDetail', payload: { id: objectId }});
    setVisible(true);
  }

  useEffect(() => {
    if(kindDetail.objectId) {
      let thumb = [{
        uid: Math.random(),
        url: thumbUrl
      }];
      form.setFieldsValue({
        name,
        description,
        thumb
      });
      setFileList(thumb)
    }
  }, [kindDetail.objectId]);

  function removeConfirm(id) {
    Modal.confirm({
      title: '是否删除该种类?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({ type: 'manageStore/removeKind', payload: { id: id }})
      },
      onCancel() {},
    })
  }

  const columns = [
    {
      key: 'kindInfo',
      dataIndex: 'kindInfo',
      title: '种类信息',
      render: (kindInfo, record) => {
        const { name, description, thumbUrl } = record;
        return <div className={styles.kindInfo}>
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
      key: 'createdAt',
      dataIndex: 'createdAt',
      title: '创建时间',
      width: 200,
      render: (createdAt) => moment(createdAt).format('YYYY/MM/DD HH:mm:ss')
    },
    {
      key: 'action',
      dataIndex: 'action',
      title: '操作',
      width: 100,
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
        values.thumbUrl = thumb[0]?.response?.files[0]?.url || thumb[0]?.url;
        values.id = objectId;
        dispatch({
          type: 'manageStore/updateKind',
          payload: { ...values, cb: () => { handleCancel() } } });
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
    dispatch({ type: 'manageStore/save', payload: { kindDetail: {} } });
  }

  function pageNoChange(pageNo) {
    dispatch({ type: 'manageStore/saveKinds', payload: { pageNo } });
    dispatch({ type: 'manageStore/getKinds' });
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

  return (
    <div className={styles.kindsContainer}>
      <Button type="dashed" className={styles.btnAdd} icon={<PlusOutlined />} onClick={e => setVisible(true)}>添加</Button>
      <Modal
        title="种类添加"
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
  const { kinds, kindDetail } = state.manageStore;
  return { kinds, kindDetail }
})(KindsPage);
