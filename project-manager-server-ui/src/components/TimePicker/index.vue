<template>
  <div class="time-picker">
    <input type="text" v-model="selectedTime" @click="showPicker = true">
    <div v-if="showPicker" class="picker">
      <div class="picker-header">
        <button @click="decrementHour">-</button>
        <span>{{selectedHour}}</span>
        <button @click="incrementHour">+</button>
        <span>:</span>
        <button @click="decrementMinute">-</button>
        <span>{{selectedMinute}}</span>
        <button @click="incrementMinute">+</button>
        <button @click="showPicker = false">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedTime: '',
      showPicker: false,
      selectedHour: 0,
      selectedMinute: 0
    }
  },
  methods: {
    incrementHour() {
      if (this.selectedHour === 23) {
        this.selectedHour = 0
      } else {
        this.selectedHour++
      }
    },
    decrementHour() {
      if (this.selectedHour === 0) {
        this.selectedHour = 23
      } else {
        this.selectedHour--
      }
    },
    incrementMinute() {
      if (this.selectedMinute === 59) {
        this.selectedMinute = 0
      } else {
        this.selectedMinute++
      }
    },
    decrementMinute() {
      if (this.selectedMinute === 0) {
        this.selectedMinute = 59
      } else {
        this.selectedMinute--
      }
    }
  },
  computed: {
    formattedTime() {
      return `${this.selectedHour}:${this.selectedMinute}`
    }
  },
  watch: {
    formattedTime() {
      this.selectedTime = this.formattedTime
    }
  }
}
</script>

<style scoped>
.time-picker {
  position: relative;
  display: inline-block;
}
.picker {
  position: absolute;
  top: 30px;
  left: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
}
.picker-header {
  display: flex;
  justify-content: center;
  align-items: center;
}
.picker-header button {
  font-size: 1.2rem;
  margin: 5px;
  padding: 5px;
}
.picker-header span {
  font-size: 1.2rem;
  margin: 5px;
}
</style>
