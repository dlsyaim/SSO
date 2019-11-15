import axios from 'axios';
import Vue from 'vue';
import VueCookies from 'vue-cookies'
import {getCookie} from "./util";

axios.defaults.validateStatus = () => true;

// const accessToken = localStorage.getItem('Token');
const accessToken = getCookie('Token')

export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
       headers: {
        'token': accessToken
      },
      params: params
    }).then(res => {
      console.log(res);
      if (res.status === 200) {
        if(res.data.code===200){
          resolve(res.data);
        } else {
          handleBusinessError(res.data);
          resolve(res.data);
        }
      }
    }).catch(err => {
      console.log(err);
      handleHttpError(err);
      resolve(err.data)
    })
  });
};

export const post = (url,params, data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
       headers: {
        'token': accessToken
      },
      params:params,
      data: data
    }).then(res => {
      console.log(res);
      if (res.status === 200) {
        if(res.data.code===200){
          resolve(res.data);
        } else {
          handleBusinessError(res.data);
          resolve(res.data);
        }
      }
    }).catch(err => {
      console.log(err);
      handleHttpError(err);
      resolve(err.data)
    })
  });
};

export const put = (url, data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'put',
      url: url,
      headers: {
        'token': accessToken
      },
      data: data
    }).then(res => {
      if (res.status === 200) {
        if(res.data.code===200){
          resolve(res.data);
        } else {
          handleBusinessError(res.data);
          resolve(res.data);
        }
      }
    }).catch(err => {
      handleHttpError(err);
      resolve(err.data)
    })
  });
};

export const deleteRequest = (url) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'delete',
      url: url,
      headers: {
        'token': accessToken
      }
    }).then(res => {
      if (res.status === 200) {
        if(res.data.code===200){
          resolve(res.data);
        } else {
          handleBusinessError(res.data);
          resolve(res.data);
        }
      }
    }).catch(err => {
      handleHttpError(err);
      resolve(err.data)
    })
  });
};


/**
 * 处理http请求错误
 * @param err
 */
const handleHttpError = (err) => {
  Vue.prototype.$message.error('服务器出错');
};

/**
 * 处理业务逻辑错误
 * @param err
 */
const handleBusinessError = (err) => {
  Vue.prototype.$message.error(err.msg);
};


