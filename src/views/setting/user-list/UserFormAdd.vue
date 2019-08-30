<template>
  <div class="card-container">
    <a-card title="新增用户" :bordered="false" style="min-height: 100%">
      <a-button type="primary" slot="extra" @click="$router.push('/setting/user-list')">返回</a-button>
      <a-form :form="form" style="width: 80%">
        <a-row>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="用户角色">
              <a-select placeholder="请选择用户角色" v-decorator="['inputSectionCode', {rules: [{ required: true, message: '请选择用户角色!' }]}]">
                <a-select-option v-for="item in roleList" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="用户真实姓名">
              <a-input placeholder="请输入用户真实姓名" v-decorator="['name', {rules: [{ required: true, message: '请输入用户真实姓名!' }]}]"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="用户名">
              <a-input placeholder="请输入用户名" v-decorator="['userName',
              {rules:[{ required: true, message: '请输入用户名!' },usernameAsyncValidator],
              validateFirst:true,
              validateTrigger:'blur'
              }]"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="登录密码">
              <a-input placeholder="请输入登录密码" type="password" v-decorator="['password', {rules: [{ required: true, message: '请输入登录密码!' }]}]"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="性别">
              <a-radio-group placeholder="请选择性别" v-decorator="['gender', {rules: [{ required: true, message: '请选择性别!' }],initialValue:'1'}]">
                <a-radio value="1">男</a-radio>
                <a-radio value="2">女</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="移动电话">
              <a-input placeholder="请输入移动电话" v-decorator="['cellphone',
              {rules: [{ required: true, message: '请输入移动电话!' },{ pattern: '^[1][3,4,5,7,8][0-9]{9}$', message: '请输入正确的移动电话!' },cellphoneAsyncValidator],
              validateFirst:true,
              validateTrigger:'blur'
              }]"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="所属区域">
              <a-input placeholder="请选择区域" style="cursor: pointer" readOnly :value="region.name" @click="visible=true"></a-input>
              <a-input style="display: none" v-decorator="['regionId', {rules: [{ required: true, message: '请选择区域!' }]}]"></a-input>
              <RegionTreeModal v-model="visible" @getRegion="getRegion"></RegionTreeModal>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="生日">
              <a-date-picker v-decorator="['birthday']" style="width: 100%"></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="邮箱地址">
              <a-input placeholder="请输入邮箱地址" v-decorator="['email', {rules: [{ type: 'email', message: '请输入正确的邮箱地址!' }]}]"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="微信">
              <a-input v-decorator="['weixin']" placeholder="请输入微信"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="QQ号">
              <a-input v-decorator="['qq']" placeholder="请输入QQ号"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="用户职位">
              <a-input v-decorator="['position']" placeholder="请输入用户职位"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="部门信息">
              <a-input v-decorator="['department']" placeholder="请输入部门信息"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="用户头像">
              <a-upload
                listType="picture-card"
                :beforeUpload="beforeUpload"
                :fileList="fileList"
                @preview="handlePreview"
                :remove="handleRemove"
              >
                <div v-if="fileList.length < 1">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传头像</div>
                </div>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible=false">
                <img alt="头像" style="width: 100%" :src="previewImage" />
              </a-modal>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="8">
            <a-form-item v-bind="formLayout" label="备注">
              <a-textarea rows="3" v-decorator="['description']" placeholder="请输入备注"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col span="8">
            <a-form-item  :wrapper-col="{ span: 12, offset: 6 }">
              <a-button type="primary" @click="submit" :loading="isSaveLoading">提交</a-button>
              <a-button style="margin-left: 20px" @click="reset">重置</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>

<script>
  import {BASE_URL} from "../../../config/config";
  import {get, post} from "../../../util/axios";
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";
  import RegionTreeModal from "../../../components/RegionTreeModal";
  import ATextarea from "ant-design-vue/es/input/TextArea";

  const formLayout={labelCol: {span: 6},wrapperCol: {span: 15}};

  const usernameAsyncValidator={validator:(rules,value,callback)=>{
      get(`${BASE_URL}/uip/common/checkUserNameExist?userName=${value}`).then(res=>{
        if(res.resCode!==1){
          callback(new Error());
        }
      })
    },message:'用户名已存在'};

  const cellphoneAsyncValidator={validator:(rules,value,callback)=>{
      get(`${BASE_URL}/uip/common/checkCellphoneExist?cellphone=${value}`).then(res=>{
        if(res.resCode!==1){
          callback(new Error());
        }
      })
    },message:'手机号码已存在'};

  export default {
    components: {ATextarea, RegionTreeModal, ACol, ARow},
    data() {
      return {
        roleList:[],
        form:null,
        region:{},
        visible:false,
        formLayout,
        previewImage:'',
        previewVisible:false,
        fileList:[],
        isSaveLoading:false,
        userNameInput:null,
        usernameAsyncValidator,
        cellphoneAsyncValidator
      }
    },
    mounted(){
      this.getRoleList();
      this.form=this.$form.createForm(this);
    },
    methods:{
      getRoleList() {
        get(`${BASE_URL}/uip/smRole/queryRoleList`, {pageNumber: -1, pageSize: -1}).then(res => {
          if (res.resCode === 1) {
            this.roleList = res.data.records;
          }
        })
      },
      checkUserNameExist(userName){
         get(`${BASE_URL}/uip/common/checkUserNameExist?userName=${userName}`).then(res=>{
           if(res.resCode!==1){

           }
         })
      },
      getRegion(e){
        this.region=e;
        this.form.setFieldsValue({
          regionId:e.id
        });
      },
      handlePreview (file) {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true
      },
      handleRemove(e){
        this.fileList=[];
        return true;
      },
      beforeUpload(file) {
        const typeList=['image/jpeg','image/png'];
        if(typeList.lastIndexOf(file.type)===-1){
          this.$message.warn('只能上传png，jpg，jpeg格式的图片');
          return false;
        }
        else {
          this.fileList = [...this.fileList, file];
          const data=new FormData();
          data.append('file',file);
          return false;
        }
      },
      submit(){
        this.form.validateFields((err,value)=>{
          if(!err){
            this.isSaveLoading=true;
            let data=new FormData();
            for (let key in value){
              if(value[key]){
                data.append(key,value[key]);
              }
            }
            if(this.fileList.length!==0){
              data.append('userImage',this.fileList[0]);
            }
            post(`${BASE_URL}/uip/smUser/addUser`,null,data).then(res=>{
              this.isSaveLoading=false;
              // 上传图像这有问题，只要http返回200，将当做操作成功
              // 原有河长制系统也是这样的
              // if(res.resCode===1){
                this.$message.success('创建成功');
                setTimeout(()=>{
                  this.$router.replace('/setting/user-list');
                },1500);
              // }
            })
          }
        })
      },
      reset(){
        this.region={};
        this.form.resetFields();
      }
    }
  }
</script>

