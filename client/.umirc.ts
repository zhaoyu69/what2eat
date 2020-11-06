import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  locale: { default: 'zh-CN' },
  links: [{ rel: 'icon', href: '/favicon128.ico' }],
  routes: [
    // 管理端
    {
      path: '/manage',
      component: '../layouts/manage/index',
      routes: [
        { path: '/manage/kinds', component: '@/pages/manage/kinds/index'} ,
        { path: '/manage/foods', component: '@/pages/manage/foods/index'} ,
        { path: '/manage/pools', component: '@/pages/manage/pools/index'} ,
      ],
    },
    // 用户端
    {
      path: '/',
      component: '../layouts/user/index',
      routes: [
        { path: '/', component: '@/pages/user/index' },
      ]
    },
  ],
  proxy: {
    "/api": {
      "target": "http://localhost:3000",
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    },
  }
});
