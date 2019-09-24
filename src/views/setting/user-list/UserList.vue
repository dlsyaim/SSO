<template>
  <div class="card-container">
    <a-card title="用户列表" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between">
        <div style="display:flex;align-items: center">
          <span>用户角色：</span>
          <a-select class="default-select-width" style="margin-right: 40px;" v-model="roleId" placeholder="请选择色用户角色">
            <a-select-option v-for="item in roleList" :value="item.id" :key="item.id" :title="item.name">{{item.name}}
            </a-select-option>
          </a-select>
          <span>河长名称：</span>
          <a-input class="default-select-width" style="margin-right: 40px;" v-model="name"
                   placeholder="请输入河长名称"></a-input>
          <span>行政区域：</span>
          <a-input class="default-select-width" style="margin-right: 40px;cursor: pointer;" :value="region.name"
                   placeholder="请选择行政区域" readOnly @click="visible=true"></a-input>
          <RegionTreeModal v-model="visible" @getRegion="getRegion"></RegionTreeModal>
          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="resetSearchCondition">重置</a-button>
        </div>
        <a-button type="primary" @click="$router.push('/setting/user-list/add')">
          <a-icon type="plus" style="font-size: 16px;"/>
          新增用户
        </a-button>
      </div>
      <div style="margin-top: 18px;" @click="handleTableClick">
        <a-table :columns="columns"
                 :rowKey="record => record.index"
                 :dataSource="list"
                 :pagination="pagination"
                 :loading="loading"
                 @change="handleTableChange">
        <span slot="action" slot-scope="item">
          <span data-method="detail" :data-id="item.id" class="table-operation">详情</span>
          <a-divider type="vertical"/>
          <span data-method="modify" :data-id="item.id" class="table-operation">修改</span>
          <template v-if="item.couldDelete">
            <a-divider type="vertical"/>
            <a-popconfirm title="确定要删除这条数据吗?" @confirm="deleteItem" placement="topRight">
              <span data-method="delete" :data-id="item.id" class="table-operation">删除</span>
            </a-popconfirm>
          </template>
          <a-divider type="vertical"/>
          <a-popconfirm title="确定要重置密码?" @confirm="resetPassword" placement="topRight">
            <span data-method="reset" :data-id="item.id" class="table-operation">重置密码</span>
          </a-popconfirm>
        </span>
        </a-table>
      </div>
    </a-card>
    <a-modal :visible="isDetailModalVisible"
             title="详情"
             :footer="null"
             @cancel="isDetailModalVisible=false"
             width="800px">
       <a-row class="modal-detail-item">
         <a-col span="12">
           <span class="detail-item-label">角色名称：</span>
           <span v-if="isDetailModalVisible">{{selected.roleList[0].name}}</span>
         </a-col>
         <a-col span="12">
           <span class="detail-item-label">用户真实姓名：</span>
           <span >{{selected.name}}</span>
         </a-col>
       </a-row>
      <a-row class="modal-detail-item">
        <a-col span="12">
          <span class="detail-item-label">用户名：</span>
          <span>{{selected.userName}}</span>
        </a-col>
        <a-col span="12">
          <span class="detail-item-label">性别：</span>
          <span >{{selected.gender===1?'男':'女'}}</span>
        </a-col>
      </a-row>
      <a-row class="modal-detail-item">
        <a-col span="12">
          <span class="detail-item-label">移动电话：</span>
          <span>{{selected.cellphone}}</span>
        </a-col>
        <a-col span="12">
          <span class="detail-item-label">所属行政区域：</span>
          <span>{{selected.regionName}}</span>
        </a-col>
      </a-row>
      <a-row class="modal-detail-item">
        <a-col span="12">
          <span class="detail-item-label">生日：</span>
          <span>{{selected.birthday}}</span>
        </a-col>
        <a-col span="12">
          <span class="detail-item-label">邮箱地址：</span>
          <span >{{selected.email}}</span>
        </a-col>
      </a-row>
      <a-row class="modal-detail-item">
        <a-col span="12">
          <span class="detail-item-label">微信账号：</span>
          <span>{{selected.weixin}}</span>
        </a-col>
        <a-col span="12">
          <span class="detail-item-label">QQ号：</span>
          <span >{{selected.qq}}</span>
        </a-col>
      </a-row>
      <a-row class="modal-detail-item">
        <a-col span="12">
          <span class="detail-item-label">用户职位：</span>
          <span>{{selected.position}}</span>
        </a-col>
        <a-col span="12">
          <span class="detail-item-label">部门信息：</span>
          <span >{{selected.department}}</span>
        </a-col>
      </a-row>
      <a-row class="modal-detail-item">
        <a-col span="24">
          <span class="detail-item-label">备注：</span>
          <span>{{selected.description}}</span>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
  import {BASE_URL, tablePaginationConfig} from "../../../config/config";
  import {deleteRequest, get, put} from "../../../util/axios";
  import RegionTreeModal from "../../../components/RegionTreeModal";
  import ARow from "ant-design-vue/es/grid/Row";

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '用户名', dataIndex: 'userName'},
    {title: '姓名', dataIndex: 'name'},
    {title: '性别', dataIndex: 'genderName'},
    {title: '手机号码', dataIndex: 'cellphone'},
    {title: '创建时间', dataIndex: 'createTime'},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 240}
  ];

  export default {
    components: {ARow, RegionTreeModal},
    data() {
      return {
        roleList: [],
        roleId: undefined,
        name: undefined,
        region: {},
        visible: false,
        loading: true,
        list: [],
        columns,
        pagination: tablePaginationConfig,
        selected: {},
        isDetailModalVisible:false
      }
    },
    mounted() {
      this.getList();
      this.getRoleList();
    },
    methods: {
      getList() {
        this.loading = true;
        const params = {
          roleId: this.roleId,
          name: this.name,
          regionId: this.regionId,
          pageSize: this.pagination.pageSize,
          pageNumber: this.pagination.current
        };
        get(`${BASE_URL}/uip/smUser/queryUserList`, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.handleData(res.data.records);
            this.pagination.total = res.data.totalNum;
          }
        })
      },
      handleData(list) {
        list.forEach((item, index) => {
          item.index = (this.pagination.current - 1) * this.pagination.pageSize + index + 1;
          if (item.gender === 1) {
            item.genderName = '男';
          } else if (item.gender === 2) {
            item.genderName = '女';
          }
          // 管理员的角色id为‘1’，不可删除
          item.couldDelete=!(item.roleList.some(item=>item.id==='1'));
        });
        this.list = list;
      },
      getRoleList() {
        get(`${BASE_URL}/uip/smRole/queryRoleList`, {pageNumber: -1, pageSize: -1}).then(res => {
          if (res.resCode === 1) {
            this.roleList = res.data.records;
          }
        })
      },
      getRegion(e) {
        this.region = e;
      },
      resetSearchCondition() {
        this.roleId = undefined;
        this.name = undefined;
        this.region = {};
      },
      handleTableChange(e) {
        this.pagination = e;
        this.getList();
      },
      handleTableClick(e) {
        const method = e.target.dataset.method;
        const id = e.target.dataset.id;
        if (method && id) {
          this.selected = this.list.find(item => item.id === id);
          if (method === 'detail') {
            this.isDetailModalVisible=true;
          } else if (method === 'modify') {
            this.$router.push({path: '/setting/user-list/edit', query: {id: this.selected.id}});
          }
        }
      },
      deleteItem() {
        this.loading=true;
        deleteRequest(`${BASE_URL}/uip/smUser/deleteById?id=${this.selected.id}`).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.$message.success('删除成功');
            this.getList();
          }
        })
      },
      resetPassword() {
        this.loading=true;
        put(`${BASE_URL}/uip/smUser/resetPassword`,{id:this.selected.id}).then(res=>{
          this.loading=false;
          if(res.resCode===1){
            this.$message.success('重置成功');
          }
        })
      }
    }
  }
</script>

