<template>
  <div>
    <a-dropdown>
      <div style="display: flex;align-items: center;font-size: 15px">
        <span>{{currentUserName}}</span>
        <a-avatar :size="48" icon="user" style="padding: 0"/>
      </div>
      <a-menu slot="overlay">
        <a-menu-item @click="showModal">
          <a-icon type="user" style="font-size: 16px"/>
          <span>个人信息</span>
        </a-menu-item>
        <!--<a-menu-item>-->
        <!--<a-icon type="setting" style="font-size: 16px"/><span>修改密码</span>-->
        <!--</a-menu-item>-->
        <a-menu-divider/>
        <a-menu-item @click="logOut">
          <a-icon type="logout" style="font-size: 16px"/>
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <a-modal width="760px"
             title="个人信息"
             @cancel="isModalVisible=false"
             @ok="handleOk"
             :confirmLoading="isSaveLoading"
             :visible="isModalVisible">
      <a-form :form="form">
        <a-row>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="用户名">
              <a-input v-decorator="['userName']" readOnly></a-input>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="真实姓名">
              <a-input placeholder="请输入真实姓名"
                       v-decorator="['name',{rules: [{ required: true, message: '请输入真实姓名!' }]}]"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="性别">
              <a-radio-group placeholder="请选择性别" v-decorator="['gender']">
                <a-radio :value="1">男</a-radio>
                <a-radio :value="2">女</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="移动电话">
              <a-input placeholder="请输入移动电话"
                       v-decorator="['cellphone',{validateFirst:true,rules: [  { pattern: '^[1][3,4,5,7,8][0-9]{9}$', message: '请输入正确的移动电话!' }]}]"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="生日">
              <a-date-picker v-decorator="['birthday']" style="width: 100%;padding: 0"></a-date-picker>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="邮箱地址">
              <a-input placeholder="请输入邮箱地址"
                       v-decorator="['email',{rules: [{ type: 'email', message: '请输入正确的邮箱地址!' }]}]"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="微信">
              <a-input v-decorator="['weixin']" placeholder="请输入微信"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="QQ号">
              <a-input v-decorator="['qq']" placeholder="请输入QQ号"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="部门信息">
              <a-input v-decorator="['department']" placeholder="请输入部门信息"></a-input>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item v-bind="formLayout" label="用户职位">
              <a-input v-decorator="['position']" placeholder="请输入用户职位"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import {BASE_URL, SSO_CENTER_URl} from "../config/config";
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";
  import moment from 'moment';
  import {post} from "../util/axios";

  const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16}
  };

  export default {
    components: {ACol, ARow},
    data() {
      return {
        userId: '',
        isModalVisible: false,
        isSaveLoading: false,
        form: null,
        currentUser:null,
        formLayout
      }
    },
    computed: {
      currentUserName() {
        return this.currentUser?this.currentUser.name:JSON.parse(sessionStorage.getItem('userDTO')).name
      }
    },
    mounted() {
      this.form = this.$form.createForm(this);
    },
    methods: {
      logOut() {
        sessionStorage.removeItem('Access-Token');
        window.location.href = SSO_CENTER_URl;
      },
      showModal() {
        const user = JSON.parse(sessionStorage.getItem('userDTO'));
        this.userId = user.id;
        this.isModalVisible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue({
            name: user.name,
            userName: user.userName,
            cellphone: user.cellphone,
            gender: user.gender,
            email: user.email,
            birthday: user.birthday ? moment(user.birthday) : null,
            weixin: user.weixin,
            qq: user.qq,
            position: user.position,
            department: user.department
          });
        });
      },
      handleOk() {
        this.form.validateFields((err, value) => {
          if (!err) {
            this.isSaveLoading = true;
            const data = {
              id:this.userId,
              name: value.name,
              userName: value.userName,
              cellphone: value.cellphone,
              gender: value.gender,
              email: value.email,
              birthday: value.birthday ? moment(value.birthday).format('YYYY-MM-DD') : null,
              weixin: value.weixin,
              qq: value.qq,
              position: value.position,
              department: value.department
            };
            post(`${BASE_URL}/uip/smUser/updateById`, data).then(res => {
              this.isSaveLoading = false;
              if (res.resCode === 1) {
                this.$message.success('修改成功');
                sessionStorage.setItem('userDTO',JSON.stringify(res.data));
                this.currentUser=res.data;
                setTimeout(() => {
                  this.isModalVisible = false;
                }, 1500);
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  span {
    padding: 0 10px 0 4px;
  }

  li {
    display: flex;
    align-items: center;
  }
</style>
