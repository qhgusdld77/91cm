<template>
  <div class="mainwrapper" style="height: calc(100vh - 150px);">
    <full-calendar ref="calendar" :config="config" :events="events" @event-selected="selectEvent"></full-calendar>
    <b-modal id="change-event" @ok="handleOk" title="일정 수정" @cancel="resetData" @hide="resetData">
      <v-swatches class="float-right" v-model="eventColor" popover-x="right"
                  show-fallback placeholder="제목을 입력해주세요."></v-swatches>
      <b-form-group
        label="일정 이름"
        label-for="input-title">
        <b-form-input id="input-title" v-model="eventTitle" title="일정 수정" placeholder="캘린더 이벤트 제목"
                      style="margin-right: 15px;" class="float-left"></b-form-input>
      </b-form-group>
      <b-form-group
        label="일정 내용"
        label-for="textarea-content">
        <b-textarea id="textarea-content" v-model="taskContent"></b-textarea>
      </b-form-group>
    </b-modal>
  </div>
</template>

<script>
  import {FullCalendar} from 'vue-full-calendar'
  import VSwatches from 'vue-swatches'
  import 'vue-swatches/dist/vue-swatches.css'
  import {mapGetters} from 'vuex'
  // Date 유틸을 만들어서 import 하면 현재 선언된 main의 Date의 prototype이 가능한지
  export default {
    name: 'Calendar',
    components: {
      FullCalendar,
      VSwatches
    },
    watch: {
      taskBoard: function (newTaskBoard, oldTaskBoard) {
        this.events = []
        newTaskBoard.forEach(taskList => {
          taskList.tasks.forEach(task => {
            if (task.start_date && task.state) {
              let title = '제목 없음'
              // eslint-disable-next-line eqeqeq
              if (task.title == null || task.title == '') {
                title = task.content
              } else {
                title = task.title
              }
              this.events.push({
                title: title,
                start: new Date(task.start_date),
                end: new Date(task.end_date).addDays(1),
                color: task.color,
                task: task
              })
            }
          })
        })
      }
    },
    computed: {
      ...mapGetters({
        taskBoard: 'getTaskBoard',
        selectComponent: 'getSelectComponent'
      })
    },
    activated() {
      this.taskSubscribe = this.$store.state.stompClient.subscribe('/sub/todo/' + this.$store.state.currentChannel.id, (res) => {
        if (res.headers.typename == 'taskUpdate') {
          this.$store.dispatch('updateTaskBoard')
        }
      })
      this.$http.get('/api/tasklist/get/' + this.$store.state.currentChannel.id)
        .then(res => {
          const taskBoard = res.data
          this.$store.commit('setTaskBoard', taskBoard)
          taskBoard.forEach(taskList => {
            taskList.tasks.forEach(task => {
              if (task.start_date && task.state) {
                let title = '제목 없음'
                if (task.title == null || task.title == '') {
                  title = task.content
                } else {
                  title = task.title
                }
                this.events.push({
                  title: title,
                  start: new Date(task.start_date),
                  end: new Date(task.end_date).addDays(1),
                  color: task.color,
                  task: task
                })
              }
            })
          })
        })
    },
    deactivated() {
      this.taskSubscribe.unsubscribe()
      this.taskSubscribe = null
      this.events = null
    },
    data() {
      return {
        taskSubscribe: null,
        taskContent: '',
        events: [],
        selectTask: {},
        eventTitle: null,
        eventColor: null,
        config: {
          header:{
            left: 'prev,next',
            center: 'title',
            right: 'today'
          },
          editable: false,
          defaultView: 'month',
          selectHelper: false,
          locale: 'ko',
          height: 'parent'
        }
      }
    },
    methods: {
      getUniqueObjectArray: function (array) {
        array.filter((item, i) => {
          return array.findIndex((item2, j) => {
            return item.id == item2.id
          }) === 1
        })
      },
      resetData: function () {
        this.eventColor = null
        this.eventTitle = null
        this.taskContent = null
      },
      selectEvent: function (event) {
        this.selectTask = event.task
        this.eventTitle = event.task.title
        this.taskContent = event.task.content
        this.eventColor = event.task.color
        this.$bvModal.show('change-event')
      },
      handleOk: function () {
        this.selectTask.title = this.eventTitle
        this.selectTask.content = this.taskContent
        this.selectTask.color = this.eventColor
        this.$http.post('/api/task/update/content', this.selectTask)
          .then(res => {
            this.$store.state.stompClient.send('/sub/todo/' + this.$store.state.currentChannel.id,
              {}, {typename: 'taskUpdate'})
          })
      }
    }
  }
</script>

<style>
  @import "~fullcalendar/dist/fullcalendar.min.css";

  .fc-title {
    text-align: center;
    color: white;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-shadow: -1px -1px 0 #2d2d2d,
    1px -1px 0 #2d2d2d,
    -1px 1px 0 #2d2d2d,
    1px 1px 0 #2d2d2d;
  }

  .fc-time {
    display: none;
  }

  .fc-content {
    text-align: center;
  }

  /* .fc-scroller{
    height: 100% !important;
  } */
</style>
