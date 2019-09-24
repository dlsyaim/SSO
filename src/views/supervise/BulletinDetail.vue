<template>
  <div class="card-container">
    <a-card title="通报批评详情" :bordered="false" style="min-height: 100%">
      <a-button type="primary" slot="extra" @click="$router.go(-1)">返回</a-button>
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="通知详情" key="1">
          <div style="width: 600px;padding-left: 20px">
            <p class="modal-detail-item"><span class="detail-item-label">类型：</span>{{detail.informType===600101?'信息通知':'信息通报'}}</p>
            <p class="modal-detail-item"><span class="detail-item-label">标题：</span>{{detail.title}}</p>
            <p class="modal-detail-item"><span class="detail-item-label">发起日期：</span>{{detail.createDate}}</p>
            <p class="modal-detail-item"><span class="detail-item-label">发起人：</span>{{detail.createPerson}}</p>
            <p class="modal-detail-item"><span class="detail-item-label">问题内容：</span>{{detail.content}}</p>
            <p class="modal-detail-item"><span class="detail-item-label">接收区域：</span>{{detail.regionName}}</p>
            <p class="modal-detail-item"><span class="detail-item-label">成员单位：</span>{{detail.units}}</p>
          </div>
        </a-tab-pane>
        <a-tab-pane :tab="detail.isreply===2?'已阅情况':'答复情况'" key="2">
          <a-table :columns="columns"
                   rowKey="id"
                   :dataSource="list"
                   :pagination="null">
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
  import {get} from "../../util/axios";
  import {BASE_URL} from "../../config/config";

  const columns=[
    {title:'序号',dataIndex:'index'},
    {title:'标题',dataIndex:'title'},
    {title:'通知区域',dataIndex:'region_name'},
    {title:'已阅状态',dataIndex:'readStatusName'},
  ];
  export default {
    data() {
      return {
        list:[],
        detail:{},
        columns
      }
    },
    mounted(){
      const id=this.$route.query.id;
      if(id){
        this.getDetail(id);
        this.getList(id);
      }
    },
    methods:{
      getDetail(id){
        get(`${BASE_URL}/inform/v1/informReport/detail?id=${id}`).then(res=>{
          if(res.resCode===1){
            this.detail=res.data;
          }
        })
      },
      handleData(list){
        list.forEach((item,index)=>{
          item.index=index+1;
          item.readStatusName=item.readStatus===2?'已阅':'未阅';
        })
      },
      getList(id){
        get(`${BASE_URL}/inform/v1/informAccept/list?reportId=${id}`).then(res=>{
          if(res.resCode===1){
            this.list=res.data.list;
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
