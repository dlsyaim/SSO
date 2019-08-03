<template>
  <div class="card-container">
    <a-card title="河长名录" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between">
        <div style="display: flex;align-items: center">
          <span>河长姓名：</span>
          <a-input v-model="name" placeholder="请输入河长姓名" style="margin-right: 40px;width: 240px"></a-input>
          <span>行政区域：</span>
          <a-input :value="region.name" style="width: 240px;cursor: pointer;margin-right: 40px" placeholder="请选择行政区域"
                   readOnly @click="visible=true"></a-input>
          <RegionTreeModal v-model="visible" @getRegion="getRegion"></RegionTreeModal>
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="resetSearchCondition">重置</a-button>
        </div>
        <a-button type="primary" @click="$router.push('/information/river-chief-directory/form')">
          <a-icon style="font-size: 16px" type="plus"></a-icon>
          新增
        </a-button>
      </div>
      <div style="margin-top: 18px;" @click="handleTableClick">
        <a-table :columns="columns"
                 :rowKey="record => record.id"
                 :dataSource="list"
                 :pagination="pagination"
                 :loading="loading"
                 @change="handleTableChange">
        <span slot="action" slot-scope="item">
          <span data-method="detail" :data-id="item.id" class="table-operation">详情</span>
          <a-divider type="vertical"/>
          <span data-method="modify" :data-id="item.id" class="table-operation">修改</span>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定要删除这条数据吗?" @confirm="deleteItem" placement="topRight">
          <span data-method="delete" :data-id="item.id" class="table-operation">删除</span>
          </a-popconfirm>
        </span>
        </a-table>
      </div>
    </a-card>
    <a-modal
      title="详情"
      :visible="isModalVisible"
      @cancel="isModalVisible=false"
      :footer="null"
    >
     <a-row>
       <a-col span="6" class="modal-detail-item">河长姓名：</a-col>
       <a-col span="18" class="modal-detail-item">{{selected.name}}&nbsp;</a-col>
       <a-col span="6" class="modal-detail-item">用户姓名：</a-col>
       <a-col span="18" class="modal-detail-item">{{selected.username}}&nbsp;</a-col>
       <a-col span="6" class="modal-detail-item">所属区域：</a-col>
       <a-col span="18" class="modal-detail-item">{{selected.regionName}}&nbsp;</a-col>
       <a-col span="6" class="modal-detail-item">联系电话：</a-col>
       <a-col span="18" class="modal-detail-item">{{selected.cellphone}}&nbsp;</a-col>
       <a-col span="6" class="modal-detail-item">河长职务：</a-col>
       <a-col span="18" class="modal-detail-item">{{selected.position}}&nbsp;</a-col>
       <a-col span="6" class="modal-detail-item">河长级别：</a-col>
       <a-col span="18" class="modal-detail-item">{{selected.gradeName}}&nbsp;</a-col>
       <a-col span="6" class="modal-detail-item">角色：</a-col>
       <a-col span="18" class="modal-detail-item">{{selected.roleNames}}&nbsp;</a-col>
       <a-col span="6" class="modal-detail-item">联系电话：</a-col>
       <a-col span="18" class="modal-detail-item">{{selected.cellphone}}&nbsp;</a-col>
       <a-col span="6" class="modal-detail-item">联系电话：</a-col>
       <a-col span="18" class="modal-detail-item">{{selected.cellphone}}&nbsp;</a-col>

     </a-row>
    </a-modal>
  </div>
</template>

<script>
  import {tablePaginationConfig} from "../../../config/config";
  import {deleteRequest, get} from "../../../util/axios";
  import {DELETE_RIVER_CHIEF, GET_RIVER_CHIEF_DIRECTORY_LIST} from "../../../api/information";
  import RegionTreeModal from "../../../components/RegionTreeModal";
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '河长姓名', dataIndex: 'name'},
    {title: '区域', dataIndex: 'regionName'},
    {title: '类型', dataIndex: 'chairmanRole'},
    {title: '职务', dataIndex: 'position'},
    {title: '联系电话', dataIndex: 'cellphone'},
    {title: '文件名称', dataIndex: 'doc.filename'},
    {title: '发文机构', dataIndex: 'doc.keywords'},
    {title: '印发日期', dataIndex: 'doc.createdate'},
    {title: '公告媒体', dataIndex: 'doc.remark'},
    {title: '公告日期', dataIndex: 'doc.effectiveTime'},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 200}
  ];

  export default {
    components: {ACol, ARow, RegionTreeModal},
    data() {
      return {
        list: [],
        columns,
        loading: true,
        pagination: tablePaginationConfig,
        region: {},
        name: '',
        visible: false,
        isModalVisible: false,
        selected:{}
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {
        this.loading = true;
        const params = {
          page: this.pagination.current,
          size: this.pagination.pageSize,
          regionId: this.region.id ? this.region.id : 120100000000
        };
        get(GET_RIVER_CHIEF_DIRECTORY_LIST, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.handleData(res.data.records);
            this.pagination.total = res.data.totalNum;
          }
        })
      },
      handleData(list) {
        list.forEach((item, index) => {
          item.index = (this.pagination.current - 1) * this.pagination.pageSize + index + 1
        });
        this.list = list;
      },
      resetSearchCondition() {
        this.region={};
        this.name='';
      },
      handleTableChange(e) {
        this.pagination = e;
        this.getList();
      },
      handleTableClick(e) {
         const method=e.target.dataset.method;
         const id=e.target.dataset.id;
         if(id&&method){
            const selected=this.list.find(item=>item.id===id);
           selected.roleNames=selected.roles.map(role=>role.name).join(',');
           this.selected=selected;
           if(method==='modify'){
              this.$router.push({path:'/information/river-chief-directory/form',query:{id:this.selected.id}})
           }else if(method==='detail'){
             this.isModalVisible=true;
           }
         }
      },
      getRegion(e) {
        this.region = e;
      },
      deleteItem(){
        deleteRequest(`${DELETE_RIVER_CHIEF}?id=${this.selected.id}`).then(res=>{
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
