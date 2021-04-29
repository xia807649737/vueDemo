<template>
  <div class="ToDoList">
    <h1 v-html="title"></h1>
    <div>
      代办:<input type="text" v-model="newItem" />
      <button @click="addNewItem">添加</button>
    </div>
    <ul>
      <li v-for="item in lists" :key="item.id">
        <span v-html="item.title"></span>
        <button v-on:click="toggleFinish(item)">完成</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ToDoList",
  data() {
    return {
      title: "ToDoList",
      //   待办事项列表
      lists: [],
      newItem: "",
      id: 0,
    };
  },
  methods: {
    toggleFinish(recycleItem) {
      this.lists.map((item, index) => {
        if (item.id === recycleItem.id) {
          // 删除对应事项
          this.lists.splice(index, 1);
        }
      });
    },
    addNewItem() {
      this.lists.push({ id: this.id, title: this.newItem });
      this.id++;
      this.newItem = "";
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
  display: grid;
}
li {
  display: inline-block;
  margin: 10px 10px;
}
</style>
f