import {TagsOutlined} from "@ant-design/icons/lib";
import CustomIcon from '@/components/CustomIcon/index';
import React from "react";

export const menus = [
  {
    path: '/manage/kinds',
    name: '种类管理',
    icon: <TagsOutlined />,
  },
  {
    path: '/manage/foods',
    name: '餐品管理',
    icon: <CustomIcon type={'food'}/>
  },
];

export const upload_action = "http://localhost:3000/upload";
