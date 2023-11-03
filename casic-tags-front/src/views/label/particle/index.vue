<template>
  <div class="mask">
    <div class="app-container">
      <div class="label-search">
        <span class="search-label">颗粒名称：</span>
        <el-input v-model="name" class="search-width230 margin-right15" size="small" />
        <el-button type="primary" size="small" @click="query">查询</el-button>
        <div class="data-right">
          颗粒数量共计：<span class="num">{{ automNum }} 个 </span> 打标人数共计：<span class="num">{{ peopleNum }} 人</span>
        </div>
      </div>
      <div id="jsmind_container" style="width: 100%; height: calc(100vh - 220px);" />
    </div>
  </div>
</template>

<script>
import { gettree, automNum } from '@/api/label'

export default {
  name: 'Particle',
  components: {},
  data() {
    return {
      name: '',
      tree: [],
      jm: null,
      automNum: 0,
      peopleNum: 0
    }
  },
  created() {
    automNum().then(res => {
      if (res.code === 200) {
        const body = res.body || {}
        this.automNum = body.atomNum || 0
        this.peopleNum = body.peopleNum || 0
      }
    })
  },
  mounted() {
    const mind = {
      meta: {
        name: '自然人',
        author: 'hizzgdev@163.com',
        version: '0.2'
      },
      format: 'node_tree',
      data: {
        id: 'root',
        topic: '自然人',
        children: this.tree
      }
    }
    /* eslint-disabled */
    this.jm = new jsMind(this.getOption())
    this.jm.show(mind)
    // this.jm.expand_all()
    this.queryTree()
    // 展开全部节点
  },
  methods: {
    query() {
      this.jm.show(this.getMind())
      // this.jm.expand_all()
    },
    queryTree() {
      gettree({ hasAtom: true }).then(res => {
        if (res.code === 200) {
          let list = res.body || []
          list = JSON.parse(JSON.stringify(list)
            .replace(/"categoryCode"/g, '"id"')
            .replace(/"atomId"/g, '"isNew": true,"id"')
            .replace(/"categoryName"|"atomName"/g, '"name"')
            .replace(/"tagsAtomEntityList"/g, '"children"')
            .replace(/\[\],"subCategoryList"\:/g, '')
            .replace(/\],"subCategoryList":\[\{/g, ',{')
            .replace(/\],"subCategoryList"\:\[/g, '')
            .replace(/"children":\[\],/g, '')
            .replace(/"children":null,/g, ''))
          const tree = (list[0] && list[0].children) || []
          tree.map((item, index) => {
            if (index % 2) {
              item.direction = 'right'
            } else {
              item.direction = 'left'
            }
            return item
          })
          this.tree = tree
          this.jm.show(this.getMind())
          // this.jm.expand_all()
        }
      })
    },
    getTree(list = []) {
      list.map(obj => {
        obj.topic = obj.name
        const str = JSON.stringify(obj.children) + obj.name
        obj.peopleNum = obj.peopleNum || '0'
        if (this.name && str.indexOf(this.name) > -1) {
          obj['background-color'] = '#409EFF'
          obj.topic = '<div style="color: #fff">' + obj.name + '</div> <div style="font-size: 12px; color: #fff; text-align: center; margin-top: 2px;">' + obj.peopleNum + '人</div>'
        } else {
          delete obj['background-color']
          if (obj.categoryLevel < 3) obj['background-color'] = '#EEEEEE'
          obj.topic = '<div>' + obj.name + '</div> <div style="font-size: 12px; text-align: center; margin-top: 2px;">' + obj.peopleNum + '人</div>'
        }
        if (obj.categoryLevel < 3 || obj.atomLevel < 3) {
          obj.expanded = true
        } else {
          obj.expanded = false
        }
        if (obj.children) this.getTree(obj.children)
        return obj
      })
      return list
    },
    getOption() {
      return {
        container: 'jsmind_container', // 容器的ID
        editable: false, // 是否启用编辑
        theme: null, // 主题
        mode: 'full', // 显示模式========full - 子节点动态分布在根节点两侧 [默认值] side - 子节点只分布在根节点右侧
        support_html: true, // 是否支持节点里的HTML元素
        view: {
          hmargin: 100, // 思维导图距容器外框的最小水平距离
          vmargin: 50, // 思维导图距容器外框的最小垂直距离
          line_width: 2, // 思维导图线条的粗细
          line_color: '#555' // 思维导图线条的颜色
        },
        layout: {
          hspace: 30, // 节点之间的水平间距
          vspace: 20, // 节点之间的垂直间距
          pspace: 13 // 节点与连接线之间的水平间距（用于容纳节点收缩/展开控制器）
        },
        shortcut: {
          enable: true, // 是否启用快捷键
          handles: {}, // 命名的快捷键事件处理器
          mapping: {
            // 快捷键映射
            addchild: 45, // <Insert>
            addbrother: 13, // <Enter>
            editnode: 113, // <F2>
            delnode: 46, // <Delete>
            toggle: 32, // <Space>
            left: 37, // <Left>
            up: 38, // <Up>
            right: 39, // <Right>
            down: 40 // <Down>
          }
        }
      }
    },
    getMind() {
      return {
        meta: {
          name: '自然人',
          author: 'hizzgdev@163.com',
          version: '0.2'
        },
        format: 'node_tree',
        data: {
          id: 'root',
          topic: '<div style="color: #fff;">自然人</div>',
          'background-color': '#1E88E5',
          foreground: '#fff',
          children: JSON.parse(JSON.stringify(this.getTree(this.tree)))
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.mask {
  width: 100%;
  margin: 0;
  padding: 0;
  height: calc(100vh - 110px);
  background-color: #f4f8fb;
  padding-top: 1px;
}
.app-container {
  width: 98%;
  margin: 20px auto 0 auto;
  height: calc(100vh - 150px);
  background-color: #fff;
  box-shadow: 0px 3px 6px rgba(21, 21, 21, 0.2);
  opacity: 1;
}
.app-container p {
  margin: 20px 0;
  height: 40px;
}
.table {
  margin-top: 20px;
}
.data-right {
  float: right;
  padding-top: 10px;
  font-size: 14px;
  color: #666666;
  .num {
    display: inline-block;
    margin-right: 20px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
