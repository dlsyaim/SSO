<template>
  <div class="card-container">
    <a-card title="用户列表" :bordered="false" style="min-height: 100%">
      <!--<div style="display: flex;align-items: center;justify-content: space-between">-->
        <!--<div style="display: flex;align-items: center">-->
          <!---->
          <!--<a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>-->
          <!--<a-button @click="resetSearchCondition">重置</a-button>-->
        <!--</div>-->
        <!--<a-button type="primary" @click="isAddModalVisible=true">-->
          <!--<a-icon type="plus" style="font-size: 16px;"/>-->
          <!--新增文档-->
        <!--</a-button>-->
      <!--</div>-->
      <div style="margin-top: 18px;" @click="handleTableClick">
        <!--<a-table :columns="columns"-->
                 <!--:rowKey="record => record.index"-->
                 <!--:dataSource="list"-->
                 <!--:pagination="pagination"-->
                 <!--:loading="loading"-->
                 <!--@change="handleTableChange">-->
          <!--<span slot="action" slot-scope="item">-->
          <!--<span data-method="download" :data-id="item.id" class="table-operation">下载</span>-->
          <!--<a-divider type="vertical"/>-->
          <!--<span data-method="detail" :data-id="item.id" class="table-operation">详情</span>-->
          <!--<a-divider type="vertical"/>-->
          <!--<a-popconfirm title="确定要删除这条数据吗?" @confirm="deleteItem" placement="topRight">-->
          <!--<span data-method="delete" :data-id="item.id" class="table-operation">删除</span>-->
          <!--</a-popconfirm>-->
        <!--</span>-->
        <!--</a-table>-->
      </div>
    </a-card>
  </div>
</template>

<script>
  import {tablePaginationConfig} from "../../../config/config";

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '标题', dataIndex: 'name'},
    {title: '类别', dataIndex: 'typeName'},
    {title: '上传时间', dataIndex: 'createdate'},
    {title: '行政区域', dataIndex: 'regionName'},
    {title: '浏览总量', dataIndex: 'count'},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 200}
  ];

  export default {
    data() {
      return {
        loading: true,
        list: [],
        columns,
        pagination:tablePaginationConfig,
        selected:{},
        fileList:[],
        visible:false,
        region:null
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {

      },
      handleData(list) {
        list.forEach((item, index) => {
          item.index =(this.pagination.current-1)*this.pagination.pageSize+ index + 1;
        });
        this.list = list;
      },
      handleTableChange(e){
        this.pagination=e;
        this.getList();
      },
      handleTableClick(e){
        const method=e.target.dataset.method;
        const id=e.target.dataset.id;
        if(method&&id){
          this.selected=this.list.find(item=>item.id===id);
          if(method==='download'){
          }else if(method ==='detail'){

          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
