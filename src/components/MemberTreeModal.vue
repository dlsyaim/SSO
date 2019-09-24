<template>
  <a-modal
    title="选择人员"
    :visible="visible"
    @cancel="$emit('change',false)"
    :mask="showMask"
    @ok="handleOk"
    destroyOnClose
  >
    <a-input-search
      placeholder="请输入人员名称"
      @search="onSearch"
      enterButton
    />
    <div v-show="noData" style="display: flex;align-items: center;justify-content: space-between;flex-direction: column;position: absolute;top: 160px;left: 50%;transform: translateX(-50%)">
      <img src="../assets/no-data.svg"/>
      <span style="color: rgba(0,0,0,.3);margin-top: 6px">暂无匹配数据</span>
    </div>
    <a-spin :spinning="loading">
      <ul class="ztree" style="margin:10px 0 0 10px;height: 300px;overflow-y: auto;" id="memberTree"></ul>
    </a-spin>
  </a-modal>
</template>

<script>
  import {get} from "../util/axios";
  import {BASE_URL, REGION_ID} from "../config/config";

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
        noData:false,
        treeSetting: {
          async: {
            enable: true,
            url: `${BASE_URL}/watersource/v1/reach/regionAndUserTree?userType=1`,
            dataType: 'json',
            type: 'get',
            autoParam:['id=parentCode']
          },
          callback: {
            onAsyncSuccess: this.asyncGetRegionNodesSuccess,
            beforeClick:this.beforeClick
          }
        }
      }
    },
    methods: {
      initTree() {
        this.loading=true;
        get(`${BASE_URL}/watersource/v1/reach/regionAndUserTree?userType=1&parentCode=${REGION_ID}`).then(res => {
          this.loading=false;
          if (res.resCode === 1) {
            $.fn.zTree.init($('#memberTree'), this.treeSetting, res.data);
            this.isTreeInit=true;
          }
        })
      },
      asyncGetRegionNodesSuccess(event, treeId, treeNode, res) {
        // 对展开节点引发的请求进行处理
        if(treeNode){
          const treeObj = $.fn.zTree.getZTreeObj(treeId);
          treeObj.addNodes(treeNode, -1,res.data);
          if (treeNode.children[0].resCode === 1) {
            treeObj.removeNode(treeNode.children[0]);
            treeObj.updateNode(treeNode);
          }
        }
      },
      beforeClick(treeId, treeNode, clickFlag){
        if(!treeNode.type && !treeNode.usertype){
          return false;
        }else {
          return true;
        }
      },
      handleOk() {
        const selectedNodes=$.fn.zTree.getZTreeObj('memberTree').getSelectedNodes();
        if(selectedNodes.length===0){
          this.$emit('getMember',{});
        }else {
          this.$emit('getMember',selectedNodes[0]);
        }
        this.$emit('change', false)
      },
      onSearch(e){
        this.loading=true;
        $.fn.zTree.destroy('memberTree');
        get(`${BASE_URL}/watersource/v1/reach/findByUser?userName=${e}&userType=1`).then(res => {
          this.loading=false;
          if (res.resCode === 1) {
            if(res.data.length!==0){
              this.noData=false;
              $.fn.zTree.init($('#memberTree'), this.treeSetting, res.data);
            }else {
              this.noData=true
            }
          }
        })
      }
    },
    watch:{
      visible(newVal){
        if(newVal){
          this.initTree();
        }
      }
    }
  }
</script>
