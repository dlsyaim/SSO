<template>
  <a-modal :visible="visible"
           @ok="handleOk"
           @cancel="$emit('change',false)"
           title="督办结果"
           width="660px">
    <template slot="footer">
      <a-button key="1" :loading="loading1" @click="handleOk(1)" v-if="!showSaveButton">重新办理</a-button>
      <a-button key="2" :loading="loading2" @click="handleOk(2)" v-if="!showSaveButton">发起现场核查</a-button>
      <a-button key="3" :loading="loading3" type="primary" v-if="showSaveButton">保存</a-button>
      <a-button key="back" @click="$emit('change',false)">取消</a-button>
    </template>
    <div style="max-height: 400px;overflow-y: auto">
      <div v-for="item in feedbackList" :key="item.id">
        <p class="modal-detail-item">
          <span class="detail-item-label">反馈区域：</span>
          <span>{{item.region_name}}</span>
        </p>
        <p class="modal-detail-item">
          <span class="detail-item-label">答复时间：</span>
          <span>{{item.replyList[0].replyDate}}</span>
        </p>
        <p class="modal-detail-item">
          <span class="detail-item-label">答复说明：</span>
          <span>{{item.replyList[0].description}}</span>
        </p>
        <p class="modal-detail-item" v-if="item.replyList[0].fileList.length > 0">
          <span class="detail-item-label">答复说明：</span>
          <span>{{item.replyList[0].replyPerson}}</span>
        </p>
        <a-divider/>
      </div>
      <a-form :form="form">
        <a-form-item v-bind="{labelCol: {span: 3},wrapperCol: {span: 16}}" label="处理结果">
          <a-select placeholder="请选择处理结果" @change="handleSelectChange"
                    v-decorator="['result', {rules: [{ required: true, message: '请选择处理结果!' }]}]">
            <a-select-option value="1">未办结</a-select-option>
            <a-select-option value="2">未按期整改</a-select-option>
            <a-select-option value="3">已办结</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
  import {put} from "../../../util/axios";
  import {BASE_URL} from "../../../config/config";

  export default {
    model: {
      prop: 'visible',
      event: 'change'
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      feedbackList: {
        type: Array,
        default() {
          return [];
        }
      },
      recordId: String
    },
    data() {
      return {
        loading1: false,
        loading2: false,
        loading3: false,
        showSaveButton: false,
        form: null,
        handleResult: ''
      }
    },
    mounted(){
      this.form = this.$form.createForm(this);
    },
    methods: {
      handleOk(type) {
        this.form.validateFields((err, value) => {
          if (!err) {
            const params = {
              id: this.recordId,
              status:type
            };
            if(type === 2){ //现场核查
              params.whetherinspect = 1
            }
            this['loading'+type]=true;
            put(`${BASE_URL}/duban/v1/DubanSupervision/update`,params).then(res=>{
              this['loading'+type]=false;
              if(res.resCode===1){
                this.$message.success('操作成功');
                this.$emit('success');
                setTimeout(()=>{
                  this.form.resetFields();
                  this.$emit('change',false);
                },1500);
              }
            })
          }
        })
      },
      handleSelectChange(e) {
        this.handleResult = e;
        this.showSaveButton = (e === '3');
      }
    }
  }
</script>

<style scoped>

</style>
