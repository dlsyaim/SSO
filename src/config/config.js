/**
 * api根路径
 * @type {string}http://10.0.0.96:7244
 */


const BASE = (function () {//获取用户URL信息（自调用函数）
  console.log(window.location.href,'函数内部打印，测试文件优先级，即执行顺序');
  const userImportURL = window.location.href;
  if (userImportURL.indexOf('192.168.2.109') != -1) {
    return '//192.168.2.109';
  }else {
    return '//61.240.12.212';
  }
})();

console.log(BASE, '修改后的ip,仅供测试用');

export const BASE_URL='http:'+BASE+':9081';

export const BASE_URL_IMG='http:'+BASE+'9084';

/**
 * 基础URL地址
 */

export const BASE_9080 = 'http:' + BASE + ':9080';

export const BASE_9084 = 'http:' + BASE + ':9084';

export const BASE_9085 = 'http:' + BASE + ':9085';

export const BASE_9086 = 'http:' + BASE + ':9086';

export const BASE_9087 = 'http:' + BASE + ':9087';

export const BASE_9088 = 'http:' + BASE + ':9088';

export const BASE_9089 = 'http:' + BASE + ':9089';

export const BASE_9096 = 'http:' + BASE + ':9096';

/**
 * 上传文件接口
 * @type {string}
 */
export const UPLOAD_URL='http:'+BASE+'/inform/v1/informReport/upload';
// export const UPLOAD_URL='http:'+BASE+'/inform/v1/informReport/upload';

export const FILE_URL_PREFIX='http://47.93.191.69:8080/';

/**
 * 表格常用默认分页配
 */
export const tablePaginationConfig = {
  current: 1,
  pageSize: 10,
  total:0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal:total => `共 ${total} 条`
};
/**
 * 菜单列表
 * @type {*[]}
 */
export const menuList = [
  {id: 1, funcUrl: 'river-patrol', icon: 'file', name: '巡河管理', children: []},
  {
    id: 2,
    funcUrl: 'problem',
    icon: 'file', name: '问题管理',
    children: [
      {id: 20, funcUrl: 'wait-to-deal', icon: 'file', name: '待办问题',children:[]},
      {id: 21, funcUrl: 'problem-tracking', icon: 'file', name: '问题跟踪',children:[]},
      {id: 22, funcUrl: 'river-patrol', icon: 'file', name: '综合查询',children:[]},
      {id: 23, funcUrl: 'river-patrol', icon: 'file', name: '日常抽查',children:[]},
      {id: 24,
        funcUrl: 'river-patrol',
        icon: 'file',
        name: '巡查问题列表',
        children:[
          {id:240,funcUrl:'234',name:'三级标题1'},
          {id:241,funcUrl:'234',name:'三级标题2'}
        ]
      },
    ]
  },
  {id: 3, funcUrl: 'river-patrol', icon: 'file', name: '考核评估', children: []},
  {id: 4, funcUrl: 'river-patrol', icon: 'file', name: '分析统计', children: []},
  {id: 5, funcUrl: 'river-patrol', icon: 'file', name: '信息填报', children: []},
  {id: 6, funcUrl: 'river-patrol', icon: 'file', name: '信息管理', children: []},
  {id: 7, funcUrl: 'river-patrol', icon: 'file', name: '河湖档案', children: []},
  {id: 8, funcUrl: 'river-patrol', icon: 'file', name: '抽查督导', children: []},
  {id: 9, funcUrl: 'river-patrol', icon: 'file', name: '系统管理', children: []},
  {id: 'a', funcUrl: 'river-patrol', icon: 'file', name: '移动平台', children: []},
  {id: 'b', funcUrl: 'river-patrol', icon: 'file', name: '信息服务', children: []},
  {id: 'c', funcUrl: 'river-patrol', icon: 'file', name: '工作台账', children: []},
  {id: 'd', funcUrl: 'river-patrol', icon: 'file', name: '展示发布', children: []}
];

export const GetQueryString = (name) => {
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
  if(r!=null)return  unescape(r[2]); return null;
};
export  function getUrlKey(name){
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}
