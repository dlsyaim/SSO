import axios from 'axios';
import Vue from 'vue';

axios.defaults.validateStatus = () => true;

const accessToken = sessionStorage.getItem('Access-Token') ? sessionStorage.getItem('Access-Token') : '';

export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
      headers: {
        'Access-Token': accessToken
      },
      params: params
    }).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else {
        handleBusinessError(res.data);
        resolve(res.data);
      }
    }).catch(err => {
      handleHttpError(err);
      resolve(err.data)
    })
  });
};

export const post = (url, data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      headers: {
        "Access-Token": accessToken
      },
      data: data
    }).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else {
        handleBusinessError(res.data);
        resolve(res.data);
      }
    }).catch(err => {
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
        "Access-Token": accessToken
      },
      data: data
    }).then(res => {
      if (res.status === 200 && res.data.code === 1) {
        resolve(res.data);
      } else {
        handleBusinessError(res.data);
        resolve(res.data);
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
        "Access-Token": accessToken
      }
    }).then(res => {
      if (res.status === 200) {
        resolve(res.data);
      } else {
        handleBusinessError(res.data);
        resolve(res.data);
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
