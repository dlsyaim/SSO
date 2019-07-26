<template>
  <a-modal
    title="选择区域"
    v-model="show"
    @ok="handleOk"
  >
    <ul class="ztree" style="margin-left: 20px" id="regionTree"></ul>
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
      }
    },
    data() {
      return {
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
    mounted() {
      this.initTree()
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
        get(`${BASE_URL}/information/v1/administrativeRegion/regionTree?regionCode=120103000000`).then(res => {
          if (res.resCode === 1) {
            $.fn.zTree.init($('#regionTree'), this.treeSetting, res.data);
          }
        })
      },
      asyncGetRegionNodesSuccess(event, treeId, treeNode, res) {
        const treeObj = $.fn.zTree.getZTreeObj(treeId);
        treeObj.addNodes(treeNode, -1,res.data);
        if (treeNode.children[0].resCode === 1) {
          treeObj.removeNode(treeNode.children[0]);
          treeObj.updateNode(treeNode);
        }
      },
      handleOk() {
        const selectedNodes=$.fn.zTree.getZTreeObj('regionTree').getSelectedNodes();
        this.$emit('getRegion',selectedNodes[0]);
        this.$emit('change', false)
      }
    }
  }
</script>
