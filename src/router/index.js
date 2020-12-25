import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/company',
                    component: () => import(/* webpackChunkName: "merchant" */ '../components/page/company/Company.vue'),
                    meta: { title: '门店管理' }
                },
                {
                    path: '/materiel',
                    component: () => import(/* webpackChunkName: "merchant" */ '../components/page/materiel/Materiel.vue'),
                    meta: { title: '物料管理' }
                },
                {
                    path: '/NeedOrder',
                    component: () => import(/* webpackChunkName: "SmsProvider" */ '../components/page/sms/NeedOrder.vue'),
                    meta: { title: '要货单信息' }
                },
                {
                    path: '/MOPNeedOrder',
                    component: () => import(/* webpackChunkName: "SmsProvider" */ '../components/page/sms/MOPNeedOrder.vue'),
                    meta: { title: '要货单下载信息' }
                },
                {
                    path: '/ReceiptOrder',
                    component: () => import(/* webpackChunkName: "SmsProvider" */ '../components/page/ReceiptOrder/ReceiptOrder.vue'),
                    meta: { title: '门店收货' }
                },
                {
                    path: '/Indent',
                    component: () => import(/* webpackChunkName: "SmsMchConfig" */ '../components/page/sms/Indent.vue'),
                    meta: { title: '订货单信息' }
                },
                {
                    path: '/MOPIndent',
                    component: () => import(/* webpackChunkName: "SmsMchConfig" */ '../components/page/sms/MOPIndent.vue'),
                    meta: { title: '订货单下载信息' }
                },
                {
                    path: '/SmsTemplateType',
                    component: () => import(/* webpackChunkName: "SmsTemplateType" */ '../components/page/sms/SmsTemplateType.vue'),
                    meta: { title: '短信模板类型' }
                },
                {
                    path: '/MOPIndentDt',
                    component: () => import(/* webpackChunkName: "SmsTemplate" */ '../components/page/sms/MOPIndentDt.vue'),
                    meta: { title: 'MOP订单详情' }
                },
                {
                    path: '/SmsSendRecord',
                    component: () => import(/* webpackChunkName: "SmsSendRecord" */ '../components/page/sms/SmsSendRecord.vue'),
                    meta: { title: '短信发送记录' }
                },
                {
                    path: '/searchOrder',
                    component: () => import(/* webpackChunkName: "SmsSendRecord" */ '../components/page/newRetail/searchOrder.vue'),
                    meta: { title: '订货单查询' }
                },
                // {
                //     path: '/tabs',
                //     component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                //     meta: { title: 'tab选项卡' }
                // },
                // {
                //     path: '/form',
                //     component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                //     meta: { title: '基本表单' }
                // },
                // {
                //     // 富文本编辑器组件
                //     path: '/editor',
                //     component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                //     meta: { title: '富文本编辑器' }
                // },
                // {
                //     // markdown组件
                //     path: '/markdown',
                //     component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                //     meta: { title: 'markdown编辑器' }
                // },
                // {
                //     // 图片上传组件
                //     path: '/upload',
                //     component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                //     meta: { title: '文件上传' }
                // },
                // {
                //     // vue-schart组件
                //     path: '/charts',
                //     component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                //     meta: { title: 'schart图表' }
                // },
                // {
                //     // 拖拽列表组件
                //     path: '/drag',
                //     component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                //     meta: { title: '拖拽列表' }
                // },
                // {
                //     // 拖拽Dialog组件
                //     path: '/dialog',
                //     component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                //     meta: { title: '拖拽弹框' }
                // }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue')
        }
    ]
});
