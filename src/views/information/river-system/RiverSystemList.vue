<template>
  <div class="card-container">
    <a-card title="水系管理" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between">
        <div style="display: flex;align-items: center">
          <span>水系名称：</span>
          <a-input v-model="waterName" placeholder="请输入水系名称" class="default-select-width"
                   style="margin-right: 40px"></a-input>
          <span>河流类型：</span>
          <a-select v-model="basinCode" placeholder="请选择河流类型" class="default-select-width" style="margin-right: 40px">
            <a-select-option v-for="item in belongDrainageList" :key="item.id" :value="item.id" :title="item.basinName">{{item.basinName}}</a-select-option>
          </a-select>
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="resetSearchCondition">重置</a-button>
        </div>
        <a-button type="primary" @click="$router.push('/information/river-system/add')">
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
  import {deleteRequest, get, put} from "../../../util/axios";

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '水系代码', dataIndex: 'waterCode'},
    {title: '水系名称', dataIndex: 'waterName'},
    {title: '所属流域', dataIndex: 'basinName'},
    {title: '备注', dataIndex: 'remark'},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 240}
  ];

  export default {
    data() {
      return {
        waterName: '',
        basinCode:undefined,
        belongDrainageList:[],
        list: [],
        loading: true,
        pagination: tablePaginationConfig,
        columns,
        selected: {}
      }
    },
    mounted() {
      this.getList();
      this.getBelongDrainageList();
    },
    methods: {
      getList() {
        this.loading = true;
        const params = {
          waterName: this.riverName,
          basinCode:this.basinCode,
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.current
        };
        get(`${BASE_URL}/watersource/v1/waterSystem/list`, params).then(res => {
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
      getBelongDrainageList(){
        get(`${BASE_URL}/watersource/v1/drainageBasin/findByBasinName`).then(res=>{
          if(res.resCode===1){
            this.belongDrainageList=res.data.list;
          }
        })
      },
      resetSearchCondition() {
        this.waterName = '';
        this.basinCode = undefined;
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
            this.$router.push({path: '/information/river-system/detail', query: {id: this.selected.id}});
          } else if (method === 'modify') {
            this.$router.push({path: '/information/river-system/edit', query: {id: this.selected.id}});
          }else if (method === 'up') {
            this.moveUp();
          } else if (method === 'down') {
            this.moveDown();
          }
        }
      },

      deleteItem() {
        this.loading=true;
        deleteRequest(`${BASE_URL}/watersource/v1/waterSystem/delete?id=${this.selected.id}`).then(res=>{
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
        get(`${BASE_URL}/watersource/v1/waterSystem/sortOrder`,params).then(res=>{
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
        get(`${BASE_URL}/watersource/v1/waterSystem/sortOrder`,params).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.$message.success('下移成功')
            this.getList();
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
