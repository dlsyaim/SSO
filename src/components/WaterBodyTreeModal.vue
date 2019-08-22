<template>
  <a-modal
    title="选择水体"
    :visible="visible"
    @cancel="handleCancel"
    @ok="handleOk"
    destroyOnClose
  >
    <a-input-search
      placeholder="请输入区域名称"
      @search="onSearch"
      enterButton
    />
    <div v-show="noData"
         style="display: flex;align-items: center;justify-content: space-between;flex-direction: column;position: absolute;top: 160px;left: 50%;transform: translateX(-50%)">
      <img src="../assets/no-data.svg"/>
      <span style="color: rgba(0,0,0,.3);margin-top: 6px">暂无匹配数据</span>
    </div>
    <a-spin :spinning="loading">
      <ul class="ztree" style="margin:10px 0 0 10px;height: 300px;overflow-y: auto;" id="waterBodyTree"></ul>
    </a-spin>
  </a-modal>
</template>

<script>
  import {get} from "../util/axios";
  import {BASE_URL} from "../config/config";

  export default {
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      regionCode: {
        type: Number,
        default: 120100000000
      },
      waterType: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        loading: true,
        noData: false,
        treeSetting: {
          async: {
            enable: true,
            url: `${BASE_URL}/watersource/v1/reachChairMan/bindList?waterType=${this.waterType}`,
            dataType: 'json',
            type: 'get',
            autoParam: ['id=parentCode']
          },
          check:{
            enable:true,
            chkboxType: { "Y": "", "N": "" }
          },
          callback: {
            onAsyncSuccess: this.asyncGetRegionNodesSuccess,
          }
        }
      }
    },
    methods: {
      initTree() {
        this.loading = true;
        const params = {
          regionCode: this.regionCode,
          waterType: this.waterType
        };
        get(`${BASE_URL}/watersource/v1/reachChairMan/bindList`, params).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            this.treeSetting.async.url=`${BASE_URL}/watersource/v1/reachChairMan/bindList?waterType=${this.waterType}`;
            $.fn.zTree.init($('#waterBodyTree'), this.treeSetting, res.data);
          }
        })
      },
      asyncGetRegionNodesSuccess(event, treeId, treeNode, res) {
        // 对展开节点引发的请求进行处理
        if (treeNode) {
          const treeObj = $.fn.zTree.getZTreeObj(treeId);
          treeObj.addNodes(treeNode, -1, res.data);
          if (treeNode.children[0].resCode === 1) {
            treeObj.removeNode(treeNode.children[0]);
            treeObj.updateNode(treeNode);
          }
        }
      },
      handleOk() {
        const checkedNodes = $.fn.zTree.getZTreeObj('waterBodyTree').getCheckedNodes();
        const data=checkedNodes.map(item=>{
          return {id:item.id,name:item.name,grade:item.grade};
        });
        this.$emit('getWaterBody', data);
      },
      onSearch(e) {
        this.searchRegion(e);
      },
      searchRegion(regionName) {
        this.loading = true;
        $.fn.zTree.destroy('waterBodyTree');
        get(`${BASE_URL}/information/v1/administrativeRegion/waterBodyTree?regionCode=120100000000&regionName=${regionName}`).then(res => {
          this.loading = false;
          if (res.resCode === 1) {
            if (res.data.length !== 0) {
              this.noData = false;
              $.fn.zTree.init($('#waterBodyTree'), this.treeSetting, res.data);
            } else {
              this.noData = true
            }
          }
        })
      },
      handleCancel(){
        this.$emit('getWaterBody', []);
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
