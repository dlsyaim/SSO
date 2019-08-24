<template>
  <div class="card-container">
    <a-card title="信息发布" :bordered="false" style="min-height: 100%">
      <div style="display: flex;align-items: center;justify-content: space-between">
        <div style="display: flex;align-items: center">
          <span>发布月份：</span>
          <a-month-picker v-model="post_time" class="default-select-width" style="margin-right: 40px"/>
          <span>发布类型：</span>
          <a-select class="default-select-width" v-model="type" placeholder="请选择发布类型" style="margin-right: 40px">
            <a-select-option v-for="(value,key) in publishTypeEnum" :value="key" :key="key">{{value}}</a-select-option>
          </a-select>

          <a-button type="primary" @click="getList" style="margin-right: 20px">查询</a-button>
          <a-button @click="resetSearchCondition">重置</a-button>
        </div>
        <a-button type="primary" @click="showAddModal">
          <a-icon type="plus" style="font-size: 16px;"/>
          新增
        </a-button>
      </div>
      <div style="margin-top: 18px;" @click="handleTableClick">
        <a-table :columns="columns"
                 @change="handleTableChange"
                 rowKey="id"
                 :dataSource="list"
                 :pagination="pagination"
                 :loading="loading">
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
    <a-modal :visible="isModalVisible"
             @cancel="isModalVisible=false"
             @ok="handleOk"
             :title="isEdit?'编辑':'新增'"
             :confirmLoading="isSaveLoading"
             width="760px">
      <a-form :form="form">
        <a-row>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="上传类型">
              <a-select placeholder="请选择上传类型"
                        v-decorator="['type', {rules: [{ required: true, message: '请选择上传类型!' }]}]">
                <a-select-option v-for="(value,key) in publishTypeEnum" :value="key" :key="key">{{value}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="标题">
              <a-input placeholder="请输入标题" v-decorator="['title', {rules: [{ required: true, message: '请输入标题!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="上传人">
              <a-input readOnly v-decorator="['issuer',{initialValue:name}]"/>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="上传日期">
              <a-date-picker style="width: 100%"
                             v-decorator="['post_time', {rules: [{ required: true, message: '请选择上传日期!' }],initialValue:current}]"/>
            </a-form-item>
          </a-col>
          <a-col span="24">
            <a-form-item v-bind="{labelCol: {span: 3},wrapperCol: {span: 20}}" label="上传文件">
              <a-upload @change="uploadFile"
                        :data="extraUploadData"
                        name="files"
                        :action="BASE_URL+'/bulletin/v1/bulletin/upload1'"
                        :fileList="fileList"
                        :remove="handleFileRemove">
                <div style="display: flex;align-items: center;justify-content: space-between;width: 144px">
                  <a-button>
                    <a-icon type="upload"/>
                    上传文件
                  </a-button>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
          <a-col span="24">
            <a-form-item v-bind="{labelCol: {span: 3},wrapperCol: {span: 20}}" label="上传图片">
              <a-upload
                listType="picture-card"
                :fileList="pictureList"
                accept="image/*"
                :remove="handlePictureRemove"
                @preview="previewVisible=true"
                name="files"
                :data="extraUploadData"
                :action="BASE_URL+'/bulletin/v1/bulletin/upload'"
                @change="uploadPicture"
              >
                <div v-if="pictureList.length < 1">
                  <a-icon type="plus"/>
                  <div class="ant-upload-text">上传图片</div>
                </div>
              </a-upload>
              <a-modal :visible="previewVisible" :mask="false" :footer="null" @cancel="previewVisible=false">
                <img v-if="previewVisible" style="width: 100%" :src="FILE_URL_PREFIX+pictureList[0].responseUrl"/>
              </a-modal>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>

  import {BASE_URL, FILE_URL_PREFIX, tablePaginationConfig} from "../../../config/config";
  import {deleteRequest, get, post, put} from "../../../util/axios";
  import moment from 'moment';
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";

  const publishTypeEnum = {
    '1': '暗查暗访',
    '2': '工作动态',
    '3': '工作简报',
    '4': '考核通报',
    '5': '督导检查',
    '6': '政策文件',
    '7': '水质文件',
    '8': '督办单',
  };

  const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16}
  };

  const columns = [
    {title: '序号', dataIndex: 'index'},
    {title: '类型', dataIndex: 'typeName'},
    {title: '标题', dataIndex: 'title', sorter: true},
    {title: '上传日期', dataIndex: 'post_time', sorter: true},
    {title: '上传人', dataIndex: 'issuer'},
    {title: '操作', key: 'action', scopedSlots: {customRender: 'action'}, width: 240}
  ];

  export default {
    components: {ACol, ARow},
    data() {
      return {
        publishTypeEnum,
        post_time: null,
        type: undefined,
        sortColumn: undefined,
        sortOrder: undefined,
        list: [],
        loading: true,
        columns,
        pagination: tablePaginationConfig,
        selected: {},
        form: null,
        formLayout,
        isModalVisible: false,
        isEdit: false,
        isSaveLoading: false,
        name: '',
        current: null,
        fileList: [],
        pictureList: [],
        BASE_URL,
        FILE_URL_PREFIX,
        previewVisible: false,
        fileName: '',
        pictureName: ''
      }
    },
    mounted() {
      this.getList();
      this.name = JSON.parse(sessionStorage.getItem('userDTO')).name;
      this.current = moment();
      this.form = this.$form.createForm(this);
    },
    methods: {
      getList() {
        this.loading = true;
        const params = {
          pageNumber: this.pagination.current,
          pageSize: this.pagination.pageSize,
          post_time: this.post_time ? moment(this.post_time).format('YYYY-MM') : null,
          type: this.type,
          column: this.sortColumn,
          order: this.sortOrder
        };
        get(`${BASE_URL}/bulletin/v1/bulletin/list`, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.handleData(res.data.list);
            this.pagination.total = res.data.total;
          }
        })
      },
      handleData(list) {
        list.forEach((item, index) => {
          item.index = (this.pagination.current - 1) * this.pagination.pageSize + index + 1;
          item.typeName = this.publishTypeEnum[item.type];
        });
        this.list = list;
      },
      resetSearchCondition() {
        this.post_time = null;
        this.type = undefined;
        this.sortColumn = undefined;
        this.sortOrder = undefined;
      },
      showAddModal() {
        this.isEdit = false;
        this.fileList = [];
        this.pictureList = [];
        this.isModalVisible = true;
        this.form.resetFields();
      },
      showEditModal() {
        this.isEdit = true;
        this.isModalVisible = true;
        this.reShowFileList();
        this.$nextTick(() => {
          const data = this.selected;
          this.form.setFieldsValue({
            title: data.title,
            issuer: data.issuer,
            post_time: moment(data.post_time),
            type: data.type,
          });
        });
      },
      reShowFileList(){
        // 回显文件
        if(this.selected.attand_url){
          this.fileList=[
            {
              uid:this.selected.id,
              responseUrl:{
                attand_url:this.selected.attand_url,
                detail_url:this.selected.detail_url
              },
              name: this.selected.attand_url.split('_').reverse()[0],
              status: 'done'
            }
          ]
        }else {
          this.fileList=[];
        }
        // 回显图片
        if(this.selected.picUrl){
          this.pictureList=[
            {
              uid:this.selected.id,
              responseUrl:this.selected.picUrl,
              name: this.selected.picUrl.split('_').reverse()[0],
              status: 'done'
            }
          ]
        }else {
          this.pictureList=[];
        }
      },
      handleTableChange(pagination, filters, sorter) {
        this.pagination = pagination;
        if (sorter.order === 'ascend') {
          this.sortColumn = sorter.columnKey;
          this.sortOrder = 'asc';
        } else if (sorter.order === 'descend') {
          this.sortOrder = 'desc';
          this.sortColumn = sorter.columnKey;
        } else {
          this.sortOrder = '';
          this.sortColumn = '';
        }
        this.getList();
      },
      handleTableClick(e) {
        const id = e.target.dataset.id;
        const method = e.target.dataset.method;
        if (id && method) {
          this.selected = this.list.find(item => item.id === id);
          if (method === 'modify') {
            this.showEditModal();
          } else if (method === 'detail') {
            this.$router.push({path:'/publish/info-publish/detail',query:{id:this.selected.id}});
          }
        }
      },
      deleteItem() {
        this.loading = true;
        deleteRequest(`${BASE_URL}/bulletin/v1/bulletin/delete?id=${this.selected.id}`).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.$message.success('删除成功');
            this.getList();
          }
        })
      },
      handleOk() {
        this.form.validateFields((err, value) => {
          if (!err) {
            this.isSaveLoading = true;
            const fileUrlArray = this.fileList.filter(item => item.responseUrl).map(item => item.responseUrl)[0];
            const pictureUrlArray = this.pictureList.filter(item => item.responseUrl).map(item => item.responseUrl)[0];
            value.post_time = moment(value.post_time).format('YYYY-MM-DD');
            value.attand_url = fileUrlArray.attand_url;
            value.detail_url = fileUrlArray.detail_url;
            value.picUrl=pictureUrlArray;
            if (this.isEdit) {
              this.edit(value);
            } else {
              this.add(value);
            }
          }
        })
      },
      add(value) {
        post(`${BASE_URL}/bulletin/v1/bulletin/add`, value).then(res => {
          this.isSaveLoading = false;
          if (res.resCode === 1) {
            this.$message.success('新增成功');
            this.getList();
            setTimeout(() => {
              this.isModalVisible = false;
            }, 1000)
          }
        })
      },
      edit(value) {
        const data=Object.assign({},value,{id:this.selected.id});
        put(`${BASE_URL}/bulletin/v1/bulletin/update`, data).then(res => {
          this.isSaveLoading = false;
          if (res.resCode === 1) {
            this.$message.success('修改成功');
            this.getList();
            setTimeout(() => {
              this.isModalVisible = false;
            }, 1000)
          }
        })
      },
      extraUploadData(file) {
        return {fileName: file.name};
      },
      uploadPicture({file, fileList}) {
        this.pictureList = fileList;
        if (file.status === 'done') {
          this.$message.success('上传成功');
          this.pictureList.forEach(item => {
            if (item.uid === file.uid) {
              item.responseUrl = file.response.data[0];
            }
          });
        } else if (file.status === 'error') {
          this.$message.error('上传失败');
        }
      },
      handlePictureRemove(file) {
        this.pictureList = this.pictureList.filter(item => item.uid !== file.uid);
      },
      uploadFile({file, fileList}) {
        this.fileList = fileList;
        if (file.status === 'done') {
          this.$message.success('上传成功');
          this.fileList.forEach(item => {
            if (item.uid === file.uid) {
              item.responseUrl={};
              item.responseUrl.attand_url = file.response.data[0].attand_url;
              item.responseUrl.detail_url = file.response.data[0].detail_url;
            }
          });
        } else if (file.status === 'error') {
          this.$message.error('上传失败');
        }
      },
      handleFileRemove(file) {
        this.fileList = this.fileList.filter(item => item.uid !== file.uid);
      }
    }
  }
</script>

<style scoped>

</style>
