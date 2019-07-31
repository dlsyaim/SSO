<template>
  <div class="card-container">
    <a-card title="问题事件统计" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center">
        <span>开始日期：</span>
        <a-date-picker v-model="startTime" :disabledDate="disableStartDate" style="margin-right: 40px"/>
        <span>结束日期：</span>
        <a-date-picker v-model="endTime" :disabledDate="disableEndDate" style="margin-right: 40px"/>
        <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
        <a-button @click="resetSearchCondition">重置</a-button>
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
  import {GET_EVENT_LIST} from "../../api/event";
  import {get} from "../../util/axios";

  export default {
    data() {
      return {
        startTime:null,
        endTime:null,
        loading:true,
        list:[],
        columns:[
          {title: '序号', dataIndex: 'index',fixed:'left',width:60},
          {title: '行政区域', dataIndex: 'regionName',fixed:'left',width:120},
          {
            title: '合计',
            fixed:'right',
            width:200,
            children:[
              {title:'已办结',dataIndex:'finishTotal'},
              {title:'待办',dataIndex:'unFinishTotal'}
            ]
          }
        ],
        isColumnsInit:false
      }
    },
    mounted(){
      this.getList();
    },
    methods:{
      getList() {
        const params = {
          beginDate: this.startTime ? moment(this.startTime).format('YYYY-mm-DD') : '',
          endDate: this.endTime ? moment(this.endTime).format('YYYY-mm-DD') : ''
        };
        this.loading = true;
        get(GET_EVENT_LIST, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            if(!this.isColumnsInit&&res.data.length!==0){
              this.handleColumns(res.data);
            }
            this.handleData(res.data);
          }
        })
      },
      handleColumns(list){
        const columns=[
          {title: '序号', dataIndex: 'index',fixed:'left',width:40},
          {title: '行政区域', dataIndex: 'regionName',fixed:'left',width:90},
        ];
        list[0].list.forEach((item,index)=>{
          columns.push({
            title:item.typeName,
            children:[
              {title:'已办结',dataIndex:index+'已办结'},
              {title:'待办',dataIndex:index+'待办'}
            ]
          });
        });
        columns.push({
          title: '合计',
          width:220,
          children:[
            {title:'已办结',dataIndex:'finishTotal'},
            {title:'待办',dataIndex:'unFinishTotal'}
          ]
        });
        this.columns=columns
      },
      handleData(list) {
        list.forEach((item, index) => {
          item.index = index + 1;
          let unFinishTotal=0;
          let finishTotal=0;
          item.list.forEach((subItem,index)=>{
            unFinishTotal=subItem.unfinishedNum;
            item[index+'待办']=subItem.unfinishedNum;
            finishTotal=finishTotal+subItem.finishedNum;
            item[index+'已办结']=subItem.finishedNum;
            item[index+'typeName']=subItem.typeName
          });
          item.unFinishTotal=unFinishTotal;
          item.finishTotal=finishTotal;
        });
        this.list = Object.freeze(list);
      },
      resetSearchCondition() {
        this.startTime = null;
        this.endTime = null;
      },
      disableStartDate(startTime) {
        if (!startTime || !this.endTime) {
          return false
        } else {
          return startTime.valueOf() > this.endTime.valueOf()
        }
      },
      disableEndDate(endTime) {
        if (!endTime || !this.startTime) {
          return false
        } else {
          return endTime.valueOf() < this.startTime.valueOf()
        }
      }
    }
  }
</script>

<style scoped>

</style>
