<template>
  <div class="card-container">
    <a-card title="河流管理" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between">
        <div style="display: flex;align-items: center">
          <span>河流名称：</span>
          <a-input v-model="riverName" placeholder="请输入河流名称" class="default-select-width"
                   style="margin-right: 40px"></a-input>
          <span>河流类型：</span>
          <a-select v-model="undefined" placeholder="请选择河流类型" class="default-select-width" style="margin-right: 40px">
            <a-select-option v-for="item in riverTypeList" :key="item.id" :value="item.id">{{item.typeName}}</a-select-option>
          </a-select>
          <span>所属区域：</span>
          <a-input :value="region.name" placeholder="请选择所属区域" class="default-select-width"
                   style="margin-right: 40px;cursor: pointer" readOnly @click="visible=true"></a-input>
          <RegionTreeModal v-model="visible" @getRegion="getRegion"></RegionTreeModal>
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="resetSearchCondition">重置</a-button>
        </div>
        <a-button type="primary" @click="$router.push('/information/river/add')">
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
          <span data-method="upload" :data-id="item.id" class="table-operation">上传文档</span>
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
    {title: '河流编码', dataIndex: 'riverCode'},
    {title: '河流名称', dataIndex: 'riverName'},
    {title: '河流类型', dataIndex: 'riverTypeName'},
    {title: '所属水系', dataIndex: 'waterName'},
    {title: '行政区域', dataIndex: 'regionName'},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 320}
  ];

  export default {
    components: {RegionTreeModal},
    data() {
      return {
        riverName: '',
        riverTypeList:[],
        riverType:undefined,
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
      this.getRiverTypeList();
    },
    methods: {
      getList() {
        this.loading = true;
        const params = {
          riverName: this.riverName,
          riverType:this.riverType,
          regionName: this.region.name,
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.current
        };
        get(`${BASE_URL}/watersource/v1/river/list`, params).then(res => {
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
      getRiverTypeList(){
        get(`${BASE_URL}/watersource/v1/river/riverType`,{type: '104'}).then(res=>{
          if(res.resCode===1){
            this.riverTypeList=res.data;
          }
        })
      },
      resetSearchCondition() {
        this.reachName = '';
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

          } else if (method === 'modify') {
            this.$router.push({path: 'edit', query: {id: this.selected.id}});
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
        deleteRequest(`${BASE_URL}/watersource/v1/river/delete?id=${this.selected.id}`).then(res=>{
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
        put(`${BASE_URL}/watersource/v1/river/sortOrder`,params).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.$message.success('上移成功')
          }
        });
      },
      moveDown() {
        this.loading=true;
        const params={
          id:this.selected.id,
          status:1
        };
        put(`${BASE_URL}/watersource/v1/river/sortOrder`,params).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.$message.success('下移成功')
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
