import {TagsOutlined} from "@ant-design/icons/lib";
import CustomIcon from '@/components/CustomIcon/index';
import React from "react";
import _ from 'lodash';

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
  {
    path: '/manage/pools',
    name: '奖池管理',
    icon: <CustomIcon type={'pool'}/>
  },
];

export const upload_action = "http://localhost:3000/upload";
export function goto(url) {
  window.location.href = url;
}
export function grid9Generator(arr) {
  const _arr = _.range(0, 9 - arr.length).map(item => item = null);
  return arr.length >= 9 ? arr.slice(0, 8) : arr.concat(_arr);
}
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}
