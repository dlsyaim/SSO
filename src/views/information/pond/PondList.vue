<template>
  <div class="card-container">
    <a-card title="坑塘管理" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between">
        <div style="display: flex;align-items: center">
          <span>坑塘名称：</span>
          <a-input v-model="name" placeholder="请输入坑塘名称" class="default-select-width"
                   style="margin-right: 40px"></a-input>
          <span>坑塘类型：</span>
          <a-select v-model="pondType" placeholder="请选择坑塘类型" class="default-select-width" style="margin-right: 40px">
            <a-select-option v-for="item in pondTypeList" :key="item.id" :value="item.id">{{item.typeName}}</a-select-option>
          </a-select>
          <span>所属区域：</span>
          <a-input :value="region.name" placeholder="请选择所属区域" class="default-select-width"
                   style="margin-right: 40px;cursor: pointer" readOnly @click="visible=true"></a-input>
          <RegionTreeModal v-model="visible" @getRegion="getRegion"></RegionTreeModal>
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="resetSearchCondition">重置</a-button>
        </div>
        <a-button type="primary" @click="$router.push('/information/pond/add')">
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
    {title: '坑塘名称', dataIndex: 'pondName'},
    {title: '坑塘类型', dataIndex: 'pondTypeName'},
    {title: '所属区域', dataIndex: 'regionName'},
    {title: '面积/m²', dataIndex: 'acreage'},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 220}
  ];

  export default {
    components: {RegionTreeModal},
    data() {
      return {
        name: '',
        pondTypeList:[],
        pondType:undefined,
        region: {},
        visible: false,
        list: [],
        loading: true,
        pagination: tablePaginationConfig,
        columns,
        selected: {}
      }
    },
    mounted() {
      this.getList();
      this.getPondTypeList();
    },
    methods: {
      getList() {
        this.loading = true;
        const params = {
          name: this.name,
          type:this.pondType,
          regionName: this.region.name,
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.current
        };
        get(`${BASE_URL}/watersource/v1/pond/list`, params).then(res => {
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
      getPondTypeList(){
        get(`${BASE_URL}/watersource/v1/pond/pondType`).then(res=>{
          if(res.resCode===1){
            this.pondTypeList=res.data;
          }
        })
      },
      resetSearchCondition() {
        this.name = '';
        this.pondType=undefined;
        this.region = {};
      },
      getRegion(e) {
        this.region = e;
        this.visible = false
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
            this.$router.push({path: '/information/pond/detail', query: {id: this.selected.id}});
          } else if (method === 'modify') {
            this.$router.push({path: '/information/pond/edit', query: {id: this.selected.id}});
          }
        }
      },
      deleteItem() {
        this.loading=true;
        deleteRequest(`${BASE_URL}/watersource/v1/pond/delete?id=${this.selected.id}`).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.$message.success('删除成功');
            this.getList();
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
