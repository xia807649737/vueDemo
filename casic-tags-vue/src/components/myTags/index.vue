<template>
  <div class="my-tags">
    <el-tooltip v-for="item in selected" :key="item[label.key]" class="item" effect="dark" :content="item[label.name]" placement="top">
      <el-tag closable type="info" @close="clickTag(item)">
        <div class="tag-body">
          <div class="label-tag">{{ item[label.name] }}</div>
        </div>
      </el-tag>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'MyTags',
  model: {
    prop: 'give',
    event: 'returnBack'
  },
  props: {
    give: {
      type: Array,
      default: () => {
        return []
      }
    },
    label: {
      type: Object,
      default: () => {
        return { key: 'id', name: 'label' }
      }
    }
  },
  data() {
    return {
      selected: []
    }
  },
  computed: {
  },
  watch: {
    give: {
      handler(val) {
        this.selected = val || []
      },
      deep: true,
      immediate: true
    },
    selected: {
      handler(val, old) {
        this.$emit('returnBack', val)
      },
      deep: true
    }
  },
  created() {
  },
  methods: {
    clickTag(item) {
      const result = this.selected.filter(it => it[this.label.key] !== item[this.label.key])
      this.selected = result
    }
  }
}
</script>

<style lang="scss">
  .my-tags {
    width: 85%;
    height: 250px;
    overflow-y: auto;
    padding: 10px 10px 10px 10px;
    border: 1px solid #DCDFE6;
    min-height: 150px;
    .label-tag {
      display: inline-block;
      width: 75px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .tag-body {
      display: inline-block;
    }
    .el-tag {
      margin-left: 10px;
    }
    .el-tag .el-icon-close {
      top: -10px;
    }
  }
</style>
