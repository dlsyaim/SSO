<template>
  <div class="card-container">
    <a-card title="水质变化与达标情况统计" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between">
        <div style="display: flex;align-items: center">
          <span>断面名称：</span>
          <a-select class="default-select-width"
                    showSearch id="sectionSelect"
                    style="margin-right: 40px"
                    v-model="sectionName"
                    placeholder="请选择断面名称">
            <a-select-option v-for="item in sectionList" :key="item.id" :value="item.sectionName">{{item.sectionName}}</a-select-option>
          </a-select>
          <span>检测周期：</span>
          <a-range-picker style="margin-right: 40px" v-model="date" />
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="resetSearchCondition">重置</a-button>
        </div>
        <a-button><a-icon type="download" style="font-size: 18px" @click="exportFile"/>导出</a-button>
      </div>
      <div style="margin-top: 18px;" @click="handleTableClick">
        <a-table :columns="columns"
                 rowKey="id"
                 :dataSource="list"
                 :pagination="pagination"
                 @change="handleTableChange"
                 :loading="loading">
        <span slot="action" slot-scope="item">
          <span data-method="detail" :data-id="item.id" class="table-operation">详情</span>
        </span>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
  import {BASE_URL, tablePaginationConfig} from "../../config/config";
  import {get} from "../../util/axios";

  const columns=[
    {title:'序号',dataIndex:'index'},
    {title:'断面名称',dataIndex:'sectionName'},
    {title:'目标等级',dataIndex:'unitLevel'},
    {title:'水质等级',dataIndex:'qualityLevel'},
    {title:'河流名称',dataIndex:'riverName'},
    {title:'pH值',dataIndex:'pH'},
    {title:'溶解氧',dataIndex:'dO'},
    {title:'氨氮（mg/L）',dataIndex:'ammonia'},
    {title:'总磷（mg/L）',dataIndex:'totalphosphorus'},
    {title:'化学需氧量（mg/L）',dataIndex:'cOD'},
    {title:'高锰酸钾（mg/L）',dataIndex:'permanganate'},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'},width:140}
  ];

  export default {
    data() {
      return {
        date:[],
        sectionName:undefined,
        sectionList:[],
        list:[],
        loading:true,
        pagination:tablePaginationConfig,
        columns
      }
    },
    mounted(){
      this.getList();
    },
    methods:{
      getList(){
        this.loading=true;
        const params={
          pageSize:this.pagination.pageSize,
          pageNumber:this.pagination.current,
          sectionName:this.sectionName
        };
        get(`${BASE_URL}/analysis/v1/WaterQuality/selectWaterQuality`,params).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.list=res.data.list;
            this.pagination.total=res.data.total;
          }
        });
      },
      handleData(list){
        list.forEach((item,index)=>{
          item.index=(this.pagination.current-1)*this.pagination.pageSize+index+1;
        });
        this.list=list;
      },
      resetSearchCondition(){

      },
      handleTableChange(e){
        this.pagination=e;
        this.getList();
      },
      handleTableClick(e){

      },
      exportFile(){

      }
    }
  }
</script>

<style scoped>

</style>
