<template>
  <a-modal
    title="选择河流"
    :visible="visible"
    @cancel="$emit('change',false)"
    :mask="showMask"
    @ok="handleOk"
  >
    <a-input-search
      placeholder="请输入河流名称"
      @search="onSearch"
      enterButton
    />
    <div v-show="noData" style="display: flex;align-items: center;justify-content: space-between;flex-direction: column;position: absolute;top: 160px;left: 50%;transform: translateX(-50%)">
      <img src="../assets/no-data.svg"/>
      <span style="color: rgba(0,0,0,.3);margin-top: 6px">暂无匹配数据</span>
    </div>
    <a-spin :spinning="loading">
      <ul class="ztree" style="margin:10px 0 0 10px;height: 300px;overflow-y: auto;" id="riverTree"></ul>
    </a-spin>
  </a-modal>
</template>

<script>
  import {get} from "../util/axios";
  import {BASE_URL} from "../config/config";

  export default {
    model: {
      prop: 'visible',
      event: 'change'
    },
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      showMask:{
        type:Boolean,
        default:true
      }
    },
    data() {
      return {
        isTreeInit:false,
        loading:true,
        noData:false
      }
    },
    methods: {
      initTree() {
        this.loading=true;
        get(`${BASE_URL}/watersource/v1/waterSystem/riverLakesReservoir?type=A`).then(res => {
          this.loading=false;
          if (res.resCode === 1) {
            $.fn.zTree.init($('#riverTree'), {}, res.data);
            this.isTreeInit=true;
          }
        })
      },
      handleOk() {
        const selectedNodes=$.fn.zTree.getZTreeObj('riverTree').getSelectedNodes();
        if(selectedNodes.length===0){
          this.$emit('getRiver',{});
        }else {
          this.$emit('getRiver',selectedNodes[0]);
        }
        this.$emit('change', false)
      },
      onSearch(e){
        this.loading=true;
        $.fn.zTree.destroy('riverTree');
        get(`${BASE_URL}/watersource/v1/waterSystem/riverLakesReservoir?type=A&name=${e}`).then(res => {
          this.loading=false;
          if (res.resCode === 1) {
            if(res.data.length!==0){
              this.noData=false;
              $.fn.zTree.init($('#riverTree'), {}, res.data);
            }else {
              this.noData=true
            }
          }
        })
      }
    },
    watch:{
      visible(newVal){
        if(!this.isTreeInit&&newVal){
          this.initTree();
        }
      }
    }
  }
</script>
