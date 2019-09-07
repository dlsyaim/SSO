<template>
  <div class="card-container">
    <a-card title="流域管理" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between">
        <div style="display: flex;align-items: center">
          <span>流域名称：</span>
          <a-input v-model="basinName" placeholder="请输入流域名称" class="default-select-width"
                   style="margin-right: 40px"></a-input>
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="basinName=''">重置</a-button>
        </div>
        <a-button type="primary" @click="$router.push('/information/basin/add')">
          <a-icon type="plus" style="font-size: 16px;"/>
          新增
        </a-button>
      </div>
      <div style="margin-top: 18px;" @click="handleTableClick">
        <a-table :columns="columns"
                 rowKey="id"
                 :dataSource="list"
                 :pagination="pagination"
                 :loading="loading"
                 @change="handleTableChange">
          <span slot="action" slot-scope="item">
          <span data-method="detail" :data-id="item.id" class="table-operation">详情</span>
          <a-divider type="vertical"/>
          <span data-method="modify" :data-id="item.id" class="table-operation">编辑</span>
          <a-divider type="vertical"/>
          <span data-method="up" :data-id="item.id" class="table-operation">上移</span>
          <a-divider type="vertical"/>
          <span data-method="down" :data-id="item.id" class="table-operation">下移</span>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定要删除这条数据吗?" @confirm="deleteItem" placement="topRight">
            <span data-method="delete" :data-id="item.id" class="table-operation">删除</span>
          </a-popconfirm>
        </span>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
  import RegionTreeModal from "../../../components/RegionTreeModal";
  import {BASE_URL, tablePaginationConfig} from "../../../config/config";
  import {deleteRequest, get, post, put} from "../../../util/axios";

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '流域代码', dataIndex: 'basinCode'},
    {title: '流域名称', dataIndex: 'basinName'},
    {title: '备注', dataIndex: 'remark'},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 280}
  ];

  export default {
    data() {
      return {
        basinName: '',
        list: [],
        loading: true,
        pagination: tablePaginationConfig,
        columns,
        selected: {}
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {
        this.loading = true;
        const params = {
          basinName: this.basinName,
          size: this.pagination.pageSize,
          page: this.pagination.current,
          status:-1//TODO
        };
        get(`${BASE_URL}/watersource/v1/drainageBasin/list`, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.handleData(res.data.list);
            this.pagination.total = res.data.total;
          }
        });
      },
      handleData(list) {
        list.forEach((item, index) => {
          item.index = (this.pagination.current - 1) * this.pagination.pageSize + index + 1;
        });
        this.list = list;
      },
      handleTableChange(e) {
        this.pagination = e;
        this.getList();
      },
      handleTableClick(e) {
        const id = e.target.dataset.id;
        const method = e.target.dataset.method;
        if (id && method) {
          this.selected = this.list.find(item => item.id === id);
          if (method === 'detail') {
            this.$router.push({path: '/information/basin/detail', query: {id: this.selected.id}});
          } else if (method === 'modify') {
            this.$router.push({path: '/information/basin/edit', query: {id: this.selected.id}});
          } else if (method === 'upload') {

          } else if (method === 'up') {
            this.moveUp();
          } else if (method === 'down') {
            this.moveDown();
          }
        }
      },

      deleteItem() {
        this.loading=true;
        deleteRequest(`${BASE_URL}/watersource/v1/drainageBasin/delete?id=${this.selected.id}`).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.$message.success('删除成功');
            this.getList();
          }
        })
      },
      moveUp() {
        this.loading=true;
        const params={
          id:this.selected.id,
          status:0
        };
        get(`${BASE_URL}/watersource/v1/drainageBasin/sortOrder`,params).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.$message.success('上移成功');
            this.getList();
          }
        });
      },
      moveDown() {
        this.loading=true;
        const params={
          id:this.selected.id,
          status:1
        };
        get(`${BASE_URL}/watersource/v1/drainageBasin/sortOrder`,params).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.$message.success('下移成功');
            this.getList();
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
