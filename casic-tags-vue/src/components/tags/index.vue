<template>
  <div class="my-tags">
    <el-tooltip v-for="item in list" :key="item[label.key]" class="item" effect="dark" :content="item[label.name]" placement="top">
      <el-tag :type="getTpye(item)" effect="dark" class="label-tag" @click="clickTag(item)">
        {{ item[label.name] }}
      </el-tag>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'Labels',
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
    list: {
      type: Array,
      default: () => {
        return [{ id: '222', name: '呵呵呵呵或' }, { id: '21', name: '呵呵呵呵或或或或或333' }, { id: '23', name: '呵呵呵呵或或或或或222' }, { id: '24', name: '呵呵呵呵或或或或或333' }, { id: '25', name: '呵呵呵呵或或或或或222' }, { id: '26', name: '呵呵呵呵或或或或或333' }, { id: '27', name: '呵呵呵呵或或或或或222' }]
      }
    },
    label: {
      type: Object,
      default: () => {
        return { key: 'id', name: 'name' }
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
  methods: {
    getTpye(item) {
      const arr = this.selected.filter(it => it === item[this.label.key])
      if (arr.length) return 'success'
      return 'info'
    },
    clickTag(item) {
      const result = this.selected.filter(it => it !== item[this.label.key])
      if (result.length === this.selected.length) result.push(item[this.label.key])
      this.selected = result
    }
  }
}
</script>

<style lang="scss" scoped>
  .my-tags {
    padding: 10px 10px 10px 10px;
    border: 1px solid #DCDFE6;
    min-height: 150px;
    .label-tag {
      width: 80px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-right: 10px;
      cursor: pointer;
    }
  }
</style>
