<template>
  <el-dialog
    :show-close="false"
    :title="title"
    :width="width"
    :visible.sync="visible"
    :before-close="() => $emit('cancel')"
    destroy-on-close
    @close="() => $emit('cancel')"
  >
    <div class="form-body">
      <el-form ref="ruleForm" label-position="right" :rules="rules" label-width="100px" :model="formRole">
        <el-form-item label="一级块数据" prop="parentBlockName">
          <el-input v-model="formRole.parentBlockName" placeholder="类别名称" disabled />
        </el-form-item>
        <el-form-item label="块名称" prop="blockName">
          <el-input v-model="formRole.blockName" placeholder="类别名称" />
        </el-form-item>
        <el-form-item v-if="!formRole.blockCode" label="是否有下级块" prop="hasNextLevel">
          <el-radio-group v-model="formRole.hasNextLevel">
            <el-radio :label="0" :disabled="formRole.blockCode">无下级块</el-radio>
            <el-radio :label="1" :disabled="formRole.blockCode"> 有下级块</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="formRole.hasNextLevel === 0" class="form-tags">
          <el-form-item label="标签选择" prop="arr">
            <tags v-model="formRole.arr" />
          </el-form-item>
          <el-button size="small" type="primary" class="form-tags-btn" @click="handleClick()">{{ flag ? '关闭' : '设置' }}</el-button>
        </div>
        <el-form-item v-if="formRole.hasNextLevel === 0" label="计算规则" prop="countRule">
          <el-radio-group v-model="formRole.countRule">
            <el-radio label="2">数据并集</el-radio>
            <el-radio label="1"> 数据交集</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('cancel')">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </div>
    <div class="select-body" :class="{'show-select': flag}">
      <div class="select-title white">
        标签体系
      </div>
      <div class="select-context white">
        <tree-select
          v-model="obj"
          :options="list"
          :max-height="470"
          :default-expand-level="1"
          value-format="object"
          disable-branch-nodes
          always-open
          placeholder="请输入选项名称..."
          no-results-text="没有匹配的搜索结果"
        >
          <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName }" :class="labelClassName">
            <span v-if="node.isNew" style="background: #67c23a; width: 6px; height: 6px; border-radius: 50%; display: inline-block;">&nbsp;</span> {{ node.label }}
          </label>
        </tree-select>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import Tags from '@/components/myTags'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { gettree } from '@/api/label'
import { details } from '@/api/block'

export default {
  name: 'RoleTagModal',
  components: {
    Tags,
    TreeSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      flag: false,
      obj: null,
      options: [],
      title: '新建二级块数据',
      width: '600px',
      list: [{ id: 1, label: '' }],
      formRole: {
        parentBlockCode: '',
        parentBlockName: '',
        blockName: '',
        show: '',
        countRule: '2',
        arr: []
      },
      rules: {
        blockName: [{ required: true, message: '请输入块名称', trigger: 'change' }]
      }
    }
  },
  watch: {
    'formRole.hasNextLevel': {
      handler(val) {
        this.flag = false
      }
    },
    obj(val) {
      if (val) {
        if (val.isNew) {
          const result = this.formRole.arr || []
          const list = [...result].filter(item => item.id !== val.id)
          this.formRole.arr = list.concat([{ id: val.id, label: val.label }])
        } else {
          this.$message.warning('请选择颗粒')
          this.obj = null
        }
      }
    },
    visible(val) {
      this.flag = false
      if (val) {
        this.formRole = { ...this.data, hasNextLevel: this.data.hasNextLevel ? 1 : 0, countRule: this.data.countRule || '2' }
        if (this.formRole.blockCode) {
          this.title = '编辑二级块数据'
          const id = this.data.id
          details(id).then(res => {
            if (res?.code === 200 || res?.status === '0') {
              const it = res.data || {}
              this.formRole.arr = it.associateParticleList || []
              this.formRole.parentBlockName = it.parentBlockName
            }
          })
        } else {
          this.title = '新建二级块数据'
          if (this.$refs && this.$refs.ruleForm) this.$refs.ruleForm.resetFields()
        }
      }
    },
    flag(val) {
      if (val) {
        this.width = '1000px'
      } else {
        this.width = '600px'
      }
    }
  },
  created() {
    this.queryTree()
  },
  methods: {
    handleSubmit() {
      this.$refs.ruleForm.validate(valid => valid && this.$emit('ok', this.formRole))
    },
    handleClick() {
      this.flag = !this.flag
    },
    queryTree() {
      gettree({ hasAtom: true }).then(res => {
        if (res.code === 200) {
          const list = res.body || []
          this.list = JSON.parse(JSON.stringify(list)
            .replace(/"categoryCode"/g, '"id"')
            .replace(/"atomId"/g, '"isNew": true,"id"').replace(/"categoryName"|"atomName"/g, '"label"').replace(/"tagsAtomEntityList"/g, '"children"')
            .replace(/\[\],"subCategoryList"\:/g, '')
            .replace(/\],"subCategoryList":\[\{/g, ',{')
            .replace(/\],"subCategoryList"\:\[/g, '')
            .replace(/"children":\[\],/g, '')
            .replace(/"children":null,/g, ''))
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
 .form-body {
   width: 560px;
 }
 .dialog-footer {
   text-align: right;
 }
 .select-body {
    display: none;
    width: 400px;
    position: absolute;
    right: 0;
    top: 0px;
    min-height: 500px;
    background: #f4f8fb;
    padding-left: 10px;
 }
 .select-title {
    border-bottom: 1px solid #c0c4cc;
    height: 55px;
    /* text-align: center; */
    background: white;
    line-height: 55px;
    padding-left: 10px;
    font-size: 18px;
    color: #303133;
}
.white {
  background: #fff;
}
.select-context {
  height: 542px;
  padding: 10px;
  margin-bottom: 15px;
}

 .form-tags {
   position: relative;
 }
 .form-tags-btn {
   position: absolute;
   right: 0px;
   top: 0px;
 }
 .show-select {
   display: block;
 }
</style>
<style>
.el-dialog__header{
   border-bottom: 1px solid #c0c4cc;
 }
</style>
