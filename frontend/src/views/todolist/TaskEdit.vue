<template>
  <div>
    <i class="im im-calendar float-left">
      <date-picker v-model="date" type="date" range placeholder="날짜를 입력해주세요"
                   style="margin-left: 5px; width: auto;"></date-picker>
    </i>
    <v-swatches v-model="color" popover-x="left" popover-y="bottom" class="float-right" show-fallback></v-swatches>
    <div v-if="index==null">
      <b-form-textarea placeholder="내용을 입력해주세요" v-model="taskContent" @keydown.enter.exact="addTask">
      </b-form-textarea>
      <div style="display: flex;justify-content: flex-end;margin-top: 15px;">
        <b-button size="sm" variant="primary" style="margin-right: 5px;" @click="addTask">Save</b-button>
        <b-button size="sm" variant="danger" @click="$emit('createFormToggle')">Cancel</b-button>
      </div>
    </div>
    <div v-else>
      <b-form-textarea placeholder="내용을 입력해주세요" v-model="taskContent" autofocus>
      </b-form-textarea>
      <div style="display: flex;justify-content: flex-end;margin-top: 15px;">
        <b-button size="sm" variant="primary" style="margin-right: 5px;" @click="editTask(index)">Edit
        </b-button>
        <b-button size="sm" variant="danger" @click="$emit('editFormToggle')">Cancel</b-button>
      </div>
    </div>
  </div>
</template>

<script>
  import DatePicker from "vue2-datepicker";
  import 'vue2-datepicker/index.css';
  import VSwatches from 'vue-swatches';
  import 'vue-swatches/dist/vue-swatches.css';

  export default {
    name: "TaskEdit",
    props: ['tasks', 'color', 'date', 'taskListId', 'index'],
    components: {
      DatePicker,
      VSwatches
    },
    data() {
      return {
        task: {
          tasklist_id: this.taskListId,
          content: '',
          member_email: this.$store.state.currentUser.email,
          start_date: null,
          end_date: null,
          state: true,
          color: ''
        },
        taskContent: '',
      }
    },
    created() {
      if (this.index != null) {
        this.color = this.tasks[this.index].color
      }
    },
    mounted() {
      if (this.index != null) {
        this.taskContent = this.tasks[this.index].content
      }
    },
    methods: {
      addTask: function () {
        this.task.content = this.taskContent
        this.task.start_date = this.date[0]
        this.task.end_date = this.date[1]
        this.task.color = this.color
        this.$http.post('/api/task/insert', this.task)
          .then(res => {
            this.taskContent = ''
            this.tasks.unshift(res.data)
            this.$emit('createFormToggle')
            this.$store.state.stompClient.send('/sub/todo/' + this.$store.state.currentChannel.id, null, {typename: 'taskUpdate'})
          }).catch(error => {
          console.error(error)
        })
      },
      editTask: function (index) {
        let task = this.tasks[index]
        task.content = this.taskContent
        if (this.date[0] != null) {
          task.start_date = this.date[0]
          task.end_date = this.date[1]
        }
        if (this.color != null) {
          task.color = this.color
        }
        this.$http.post('/api/task/update/content', task)
          .then(res => {
            this.$store.state.stompClient.send('/sub/todo/' + this.$store.state.currentChannel.id, null, {typename: 'taskUpdate'})
            this.$emit('editFormToggle', -1)
          }).catch(error => {
          console.error(error)
        })
      },
    }
  }
</script>

<style>
  .vue-swatches__container:not(.vue-swatches--inline) {
    top: 42px !important;
    bottom: auto !important;
  }
</style>
