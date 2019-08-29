<template>
  <a-modal :visible="visible"
           @cancel="$emit('change',false)"
           title="详情"
           width="600px"
           :footer="null">
    <p class="modal-detail-item">
      <span class="detail-item-label">督办标题：</span>
      <span>{{detail.title}}</span>
    </p>
    <a-row class="modal-detail-item">
      <a-col span="12">
        <span class="detail-item-label">下发日期：</span>
        <span>{{detail.issuedtime}}</span>
      </a-col>
      <a-col span="12">
        <span class="detail-item-label">截止日期：</span>
        <span>{{detail.deadlinedate}}</span>
      </a-col>
    </a-row>
    <a-row class="modal-detail-item">
      <a-col span="12">
        <span class="detail-item-label">督办单文号：</span>
        <span>{{detail.dubandanProof}}</span>
      </a-col>
      <a-col span="12">
        <span class="detail-item-label">督办函文号：</span>
        <span>{{detail.dubanhanProof}}</span>
      </a-col>
    </a-row>
    <p class="modal-detail-item">
      <span class="detail-item-label">督办事项：</span>
      <span>{{detail.project}}</span>
    </p>
    <p class="modal-detail-item">
      <span class="detail-item-label">督办点位：</span>
      <span>{{detail.address}}</span>
    </p>
    <p class="modal-detail-item">
      <span class="detail-item-label">督办类型：</span>
      <span>{{detail.type}}</span>
    </p>
    <p class="modal-detail-item">
      <span class="detail-item-label">督办原因：</span>
      <span>{{detail.reason}}</span>
    </p>
    <div class="modal-detail-item" style="display: flex">
      <span class="detail-item-label">附件：</span>
      <div style="display: inline-block">
        <span  v-for="(item,index) in fileList" :key="index"><a :href="FILE_URL_PREFIX+item" target="_blank">{{item.split('_').reverse()[0]}}</a><br/></span>
      </div>
    </div>
  </a-modal>
</template>

<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";
  import {FILE_URL_PREFIX} from "../../../config/config";

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
      detail: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data(){
      return{
        FILE_URL_PREFIX
      }
    },
    computed:{
      fileList(){
        return this.detail.assessoryyuan?this.detail.assessoryyuan.split(','):[];
      }
    }
  }
</script>

<style scoped>

</style>
