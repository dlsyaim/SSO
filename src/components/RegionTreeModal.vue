<template>
  <a-modal
    title="选择区域"
    v-model="show"
    :mask="showMask"
    @ok="handleOk"
  >
    <a-input-search
      placeholder="请输入区域名称"
      @search="onSearch"
      enterButton
    />
      <div v-show="noData" style="display: flex;align-items: center;justify-content: space-between;flex-direction: column;position: absolute;top: 160px;left: 50%;transform: translateX(-50%)">
        <img src="../assets/no-data.svg"/>
        <span style="color: rgba(0,0,0,.3);margin-top: 6px">暂无匹配数据</span>
      </div>
    <a-spin :spinning="loading">
      <ul class="ztree" style="margin:10px 0 0 10px;height: 300px;overflow-y: auto;" id="regionTree"></ul>
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
        noData:false,
        treeSetting: {
          async: {
            enable: true,
            url: `${BASE_URL}/information/v1/administrativeRegion/regionTree`,
            dataType: 'json',
            type: 'get',
            autoParam:['id=parentCode']
          },
          callback: {
            onAsyncSuccess: this.asyncGetRegionNodesSuccess,
          }
        }
      }
    },
    computed: {
      show: {
        get() {
          return this.visible;
        },
        set(value) {
          this.$emit('change', value);
        }
      }
    },
    methods: {
      initTree() {
        this.loading=true;
        get(`${BASE_URL}/information/v1/administrativeRegion/regionTree?regionCode=120100000000`).then(res => {
          this.loading=false;
          if (res.resCode === 1) {
            $.fn.zTree.init($('#regionTree'), this.treeSetting, res.data);
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
      handleOk() {
        const selectedNodes=$.fn.zTree.getZTreeObj('regionTree').getSelectedNodes();
        this.$emit('getRegion',selectedNodes[0]);
        this.$emit('change', false)
      },
      onSearch(e){
        this.searchRegion(e);
      },
      searchRegion(regionName){
        this.loading=true;
        $.fn.zTree.destroy('regionTree');
        get(`${BASE_URL}/information/v1/administrativeRegion/regionTree?regionCode=120100000000&regionName=${regionName}`).then(res => {
          this.loading=false;
          if (res.resCode === 1) {
            if(res.data.length!==0){
              this.noData=false;
              $.fn.zTree.init($('#regionTree'), this.treeSetting, res.data);
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
