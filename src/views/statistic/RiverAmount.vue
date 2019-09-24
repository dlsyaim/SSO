<template>
  <div class="card-container">
    <a-card title="河流数量统计" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: flex-end">
        <a-button type="primary" @click="exportFile">
          <a-icon type="download" style="font-size: 18px;"/>
          导出
        </a-button>
      </div>
      <a-table :columns="columns"
               style="margin-top: 18px;"
               bordered
               :rowKey="record => record.index"
               :dataSource="list"
               :pagination="false"
               :loading="loading">
      </a-table>
    </a-card>
  </div>
</template>

<script>
  import {get} from "../../util/axios";
  import {EXPORT_RIVER_AMOUNT, GET_RIVER_AMOUNT_LIST} from "../../api/statistic";

  const columns=[
    {title:'序号',dataIndex:'index',width:60},
    {title:'区域',dataIndex:'regionName',width:120},
    {
      title:'河流',
      children:[
        {
          title:'一级河流',
          children:[
            {title:'条数',dataIndex:'oneNum'},
            {title:'公里数（km）',dataIndex:'oneLength'}
          ]
        },
        {
          title:'二级河流',
          children:[
            {title:'条数',dataIndex:'twoNum'},
            {title:'公里数（km）',dataIndex:'twoLength'}
          ]
        },
        {
          title:'沟渠条数',
          children:[
            {title:'条数',dataIndex:'threeNum'},
            {title:'公里数（km）',dataIndex:'threeLength'}
          ]
        }
      ]
    },
    {
      title:'湖泊',
      children:[
        {
          title:'水库',
          children:[
            {title:'个数',dataIndex:'reservoirNum'},
            {title:'面积（㎡）',dataIndex:'reservoirAcreage'}
          ]
        },
        {
          title:'湿地',
          children:[
            {title:'个数',dataIndex:'wetlandNum'},
            {title:'面积（㎡）',dataIndex:'wetlandAcreage'}
          ]
        },
        {
          title:'湖泊',
          children:[
            {title:'个数',dataIndex:'lakesNum'},
            {title:'面积（㎡）',dataIndex:'lakesAcreage'}
          ]
        }
      ]
    },
    {
      title:'坑塘及景观水景',
      children:[
        {title:'个数',dataIndex:'pondNum'},
        {title:'面积（㎡）',dataIndex:'pondAcreage'}
      ]
    }
  ];
  export default {
    data() {
      return {
        list:[],
        loading:true,
        columns
      }
    },
    mounted(){
      this.getList();
    },
    methods:{
      getList(){
        this.loading=true;
        get(GET_RIVER_AMOUNT_LIST).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.handleData(res.data);
          }
        });
      },
      handleData(list){
        list.forEach((item,index)=>{
          item.index=index+1;
        });
        this.list=list;
      },
      exportFile(){
        window.location.href=EXPORT_RIVER_AMOUNT;
      }
    }
  }
</script>

<style scoped>

</style>
