<template>
  <a-form :form="form">
    <a-form-item v-bind="formLayout" label="结案意见">
      <a-textarea rows="3" placeholder="请输入结案意见" v-decorator="['resultDesc']"></a-textarea>
    </a-form-item>
    <a-form-item v-bind="formLayout" label="上传附件">
      <a-upload :beforeUpload="beforeUpload">
        <a-button>
          <a-icon type="upload" />上传图片
        </a-button>
      </a-upload>
    </a-form-item>
    <a-form-item :wrapper-col="{span:formLayout.wrapperCol.span,offset:formLayout.labelCol.span}">
      <a-button type="primary" @click="submit" :loading="isSaveLoading">确认</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";
  import {get, post} from "../../../util/axios";
  import {BASE_URL} from "../../../config/config";
  import ATextarea from "ant-design-vue/es/input/TextArea";

  const formLayout = {
    labelCol: {span: 2},
    wrapperCol: {span: 6}
  };

  export default {
    components: {ATextarea, ACol, ARow},
    props:{
      regionList:{
        type:Array,
        default(){
          return []
        }
      },
      userId:{
        type:String,
        default:''
      },
      eventId:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        form:null,
        isSaveLoading:false,
        formLayout
      }
    },
    mounted(){
      this.form=this.$form.createForm(this);
    },
    methods:{
      submit: function () {
        this.form.validateFields((err, value) => {
          if (!err) {
            this.isSaveLoading = true;
            const params = {
              resultDesc:value.resultDesc,
              eventId:this.eventId,
              userId:this.userId
            };
            get(`${BASE_URL}/eventMgr/v1/event/close`,params).then(res=>{
              this.isSaveLoading=false;
              if(res.resCode===1){
                this.$message.success('结案成功');
                setTimeout(()=>{
                  this.$router.go(-1);
                },1500)
              }
            })
          }
        });
      },
      beforeUpload(file){
        const data=new FormData();
        data.append('files',file);
        data.append('eventId',this.eventId);
        data.append('tacheId','1');
        post(`${BASE_URL}/eventMgr/v1/event/uploadFiles`,null,data).then(res=>{});
        return false;
      }
    }
  }
</script>
