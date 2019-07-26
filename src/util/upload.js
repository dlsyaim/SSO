import {post} from "./axios";
import {UPLOAD_URL} from "../config/config";

export const uploadFile=(formData)=>{
  return new Promise((resolve, reject) => {
    post(UPLOAD_URL,formData).then(res=>{
      resolve(res)
    }).catch(err=>{
      resolve('');
    });
  })
};
