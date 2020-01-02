import request from '../utils/request';
import http from './../utils/public';
import querystring from 'querystring';

export const fetchData = (query) => {
    return request({
        url: '/weatherApi?city=成都',
        method: 'get'
        // data: query
    });
};
const apiUrl = 'http://127.0.0.1:8888';
/*const apiUrl = 'http://192.168.0.135:8888';*/
/*const apiUrl = 'http://127.0.0.1:8082';*/


/*—————————————————————注册———————————————————-———*/
/* 用户管理  注册*/
export const user_Register = (params) => {
    debugger
    return http.requestPost(apiUrl + '/user/save/',params);
};
/* 用户管理  登录*/
export const user_Login = (params) => {
    debugger
    return http.requestPost(apiUrl + '/user/login/' ,params);
};
/* 用户管理  分页*/
/* 用户管理  列表*/
/* 用户管理  更新*/
/* 用户管理  删除*/


/*—————————————————————门店———————————————————————*/
/*门店管理 （分页）*/
export const page_CompanyDict = (page, size, params) => {
    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestQuickGet(apiUrl + '/companyDict/page/' + page + '/' + size + '?' + queryString);
};
/*门店管理 （列表）*/
export const list_CompanyDict = (params) => {
    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestQuickGet(apiUrl + '/companyDict/list/' + queryString);
};
/*门店管理 （更新）*/
export const comp_update = (params) => {
    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestPost(apiUrl + '/companyDict/update', params);
};
/*门店管理 （新增）*/
export const company_save = (params) => {
    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestPost(apiUrl + '/companyDict/update', params);
};



/*门店管理更新 （代理商列表信息）*/
export const asso_list = () => {
    return http.requestQuickGet(apiUrl + '/associateCompany/list');
};

/*——————————————————————物料————————————————————————*/
/*物料管理（分页）*/
export const page_GoodsDict = (page, size, params) => {
    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestQuickGet(apiUrl + '/goodsDict/page/' + page + '/' + size + '?' + queryString);
};
/*物料管理（更新）*/
export const goodsDict_update = (params) => {
    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestPost(apiUrl + '/goodsDict/update', params);
};
/*物料管理更新（下拉框数据列表信息）*/
export const goodsDivision_list = () => {

    return http.requestQuickGet(apiUrl + '/goodsDivision/list');
};
/*——————————————————————要货单————————————————————————*/
/* 要货单管理（分页）*/
export const page_NeedOrder = (page, size, params) => {
    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    debugger
    return http.requestQuickGet(apiUrl + '/needOrder/page/' + page + '/' + size + '?' + queryString);
};

/* 要货单管理 （本地信息）*/
export const getNeedOrderByNeedNo = (params) => {
    debugger
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestPost(apiUrl + '/needOrder/getNeedOrderByNeedNo/',params);
};

/*——————————————————————MOP要货单————————————————————————*/
/* MOP要货单（分页）*/
export const page_MOPNeedOrder = (page, size, params) => {
    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestQuickGet(apiUrl + '/MOPNeedOrder/page/' + page + '/' + size + '?' + queryString);
};

/* 下载要货单（MOPNeedOrder） (下载信息)*/
export const downloadMOPNeedOrder = (params) => {
    debugger
    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestPost(apiUrl + '/MOPNeedOrder/downloadMOPNeedOrder/' ,params);
};

/* 要货单管理（保存）*/
export const MOPNeedOrder_Save = (params) => {

    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestPost(apiUrl + '/MOPNeedOrder/save/' ,params);
};

/*要货单管理（查询本地详情）*/
export const getMOPNeedOrderByNeedNo = (params) => {

    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestPost(apiUrl + '/MOPNeedOrder/getMOPNeedOrderByNeedNo/' ,params);
};

/*—————————————————————本地订货单—————————————————————————*/

/* 订货单管理 （分页）*/
export const page_Indent = (page, size, params) => {
    debugger
    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestQuickGet(apiUrl + '/indent/page/' + page + '/' + size + '?' + queryString);
};



/*订货单管理（保存）*/
/*export const indent_Save = (params) => {
    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestPost(apiUrl + '/indent/save/' ,params);
};*/
/*—————————————————————MOP订货单——————————————————————————*/

/* MOP订货单管理 （分页）*/
export const page_MOPIndent = (page, size, params) => {
    debugger
    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestQuickGet(apiUrl + '/MOPIndent/page/' + page + '/' + size + '?' + queryString);
};

/* 下载订货单（MOPIndent） (下载信息详情)*/
export const downloadMOPIndent = (params) => {
    debugger
    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestPost(apiUrl + '/MOPIndent/downloadMOPIndent/' ,params);
};

/* 下载订货单（保存）*/
export const MOPIndent_Save = (params) => {
    debugger
    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestPost(apiUrl + '/MOPIndent/save/' ,params);
};

/*下载表订货单管理（查询本地详情）*/
export const getMOPIndentByOrder = (params) => {
    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestPost(apiUrl + '/MOPIndent/getMOPIndentByOrder/' ,params);
};

/*下载表订货单管理（查询本地详情）*/
export const getMOPIndentByDocNum = (params) => {
    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestPost(apiUrl + '/MOPIndent/getMOPIndentByDocNum/' ,params);
};
/*—————————————————————MOP订货单子项单据信息——————————————————————————*/

/* MOP子项单据单管理 （分页）*/
export const page_MOPIndentDt = (page, size, params) => {
    debugger
    //将params对象数据拼装成key/value串
    let queryString = querystring.stringify(params);
    //请求服务端的页面查询接口
    return http.requestQuickGet(apiUrl + '/mopIndentDt/page/' + page + '/' + size + '?' + queryString);
};






