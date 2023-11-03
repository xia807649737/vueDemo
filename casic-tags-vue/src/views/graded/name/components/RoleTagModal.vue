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
      <el-form ref="ruleForm" label-position="right" :rules="rules" label-width="80px" :model="formRole">
        <el-form-item label="分级名称" prop="attentionLevelName">
          <el-input v-model="formRole.attentionLevelName" placeholder="类别名称" />
        </el-form-item>
        <div class="form-tags">
          <el-form-item label="标签选择" prop="particleDTOList">
            <tags v-model="formRole.particleDTOList" />
          </el-form-item>
          <el-button size="small" type="primary" class="form-tags-btn" @click="handleClick()">{{ flag ? '关闭' : '选择' }}</el-button>
        </div>
        <el-form-item label="计算规则" prop="countRule">
          <el-radio-group v-model="formRole.countRule">
            <el-radio :label="2">数据并集</el-radio>
            <el-radio :label="1"> 数据交集</el-radio>
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
          :max-height="400"
          :default-expand-level="1"
          value-format="object"
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
      title: '添加分级',
      width: '600px',
      list: [{ id: 1, label: '' }],
      formRole: {
        attentionLevelName: '',
        particleDTOList: [],
        countRule: ''
      },
      rules: {
        attentionLevelName: [{ required: true, message: '请输入分级名称', trigger: 'blur' }],
        particleDTOList: [{ required: true, message: '请选择标签', trigger: 'blur' }],
        countRule: [{ required: true, message: '请选择计算规则', trigger: 'blur' }]
      }
    }
  },
  watch: {
    obj(val) {
      if (val) {
        if (val.isNew) {
          const result = this.formRole.particleDTOList || []
          const list = [...result].filter(item => item.id !== val.id)
          this.formRole.particleDTOList = list.concat([{ id: val.id, label: val.label }])
        } else {
          this.$message.warning('请选择颗粒')
          this.obj = null
        }
      }
    },
    visible(val) {
      this.flag = false
      if (val) {
        this.formRole = this.data
        if (this.formRole.typeId) {
          this.title = '编辑分级'
        } else {
          this.title = '添加分级'
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
  height: 481px;
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
<style lang="scss">
  .el-dialog__header{
    border-bottom: 1px solid #c0c4cc;
  }
</style>
