import axios from 'axios';
import Qs from 'qs';
import Vue from 'vue';

axios.defaults.validateStatus = () => true;

export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
      headers: {
        'Access-Token': sessionStorage.getItem('Access-Token')
      },
      params: params
    }).then(res => {
      if (res.status === 200) {
        if(res.data.resCode===1){
          resolve(res.data);
        } else {
          handleBusinessError(res.data);
          resolve(res.data);
        }
      }else {
        handleHttpError(res);
        resolve(res.data);
      }
    }).catch(err => {
      handleHttpError(err);
      resolve(err);
    })
  });
};

export const post = (url,params, data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      headers: {
        "Access-Token": sessionStorage.getItem('Access-Token')
      },
      params:params,
      data: data,
      paramsSerializer: function(params) {
        return Qs.stringify(params, {arrayFormat: 'repeat'})
      }
    }).then(res => {
      if (res.status === 200) {
        if(res.data.resCode===1){
          resolve(res.data);
        } else {
          handleBusinessError(res.data);
          resolve(res.data);
        }
      }else {
        handleHttpError(res);
        resolve(res.data);
      }
    }).catch(err => {
      handleHttpError(err);
      resolve(err);
    })
  });
};

export const put = (url,params, data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'put',
      url: url,
      headers: {
        "Access-Token": sessionStorage.getItem('Access-Token')
      },
      params:params,
      data: data
    }).then(res => {
      if (res.status === 200) {
        if(res.data.resCode===1){
          resolve(res.data);
        } else {
          handleBusinessError(res.data);
          resolve(res.data);
        }
      }else {
        handleHttpError(res);
        resolve(res.data);
      }
    }).catch(err => {
      handleHttpError(err);
      resolve(err);
    })
  });
};

export const deleteRequest = (url) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'delete',
      url: url,
      headers: {
        "Access-Token": sessionStorage.getItem('Access-Token')
      }
    }).then(res => {
      if (res.status === 200) {
        if(res.data.resCode===1){
          resolve(res.data);
        } else {
          handleBusinessError(res.data);
          resolve(res.data);
        }
      }else {
        handleHttpError(res);
        resolve(res.data);
      }
    }).catch(err => {
      handleHttpError(err);
      resolve(err);
    })
  });
};


/**
 * 处理http请求错误
 * @param err
 */
const handleHttpError = (err) => {
  if(err==='Network Error'){
    Vue.prototype.$message.error('网络出错');
  }else {
    Vue.prototype.$message.error('服务器出错');
  }
};

/**
 * 处理业务逻辑错误
 * @param err
 */
const handleBusinessError = (err) => {
  Vue.prototype.$message.error(err.resMsg);
};
