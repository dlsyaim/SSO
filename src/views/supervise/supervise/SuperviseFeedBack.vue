<template>
  <a-modal :visible="visible"
           @cancel="$emit('change',false)"
           @ok="handleOk"
           title="发起督办"
           :confirmLoading="isSaveLoading"
           width="760px">
    <!--<a-form :form="form">-->
      <!--<a-row>-->
        <!--<a-col span="12">-->
          <!--<a-form-item v-bind="formLayout" label="督办标题">-->
            <!--<a-input placeholder="请输入督办标题"-->
                     <!--v-decorator="['title', {rules: [{ required: true, message: '请输入督办标题!' }]}]"/>-->
          <!--</a-form-item>-->
        <!--</a-col>-->
      <!--</a-row>-->
    <!--</a-form>-->
  </a-modal>
</template>

<script>
  export default {
    model: {
      prop: 'visible',
      event: 'change'
    },
    props:{
      visible:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        isSaveLoading:false
      }
    },
    methods:{
      handleOk(){

      }
    }
  }
</script>

<style scoped>

</style>
