<template>
  <div class="card task-board">
    <div v-if="taskList.name != ''">
      <draggable :list="getTasks" :group="'tasks'" @change="taskEventHandler" draggable=".item"
                 :disabled="disableCheck"
                 :scroll-sensitivity="200"
                 :force-fallback="true"
      >
        <div class="card-header">
          <div v-if="!edit">
            <h3>{{taskList.name}}</h3>
            <div class="card-header-right">
              <ul class="list-unstyled card-option">
                <!-- <i class="ik ik-chevron-up"></i> -->
                <li><i class="ik ik-chevron-left action-toggle"></i></li>
                <li><i class="ik ik-chevron-up minimize-card"></i></li>
                <li @click="msgBox"><i class="ik ik-x close-card"></i></li>
                <li @click="editToggle"><i class="ik ik-edit-2"></i></li>
                <li @click="createFormToggle"><i class="ik ik-plus"></i></li>
              </ul>
            </div>
          </div>
          <template v-else>
            <b-form-input
              @keydown.enter.exact="editTaskListName"
              @keydown.esc="editToggle"
              v-model="editTaskListNameVal"
              autofocus></b-form-input>
            <li class="list-unstyled" @click="editToggle"><i class="ik ik-x close-card" style="cursor: pointer;"></i>
            </li>
            <li class="list-unstyled" @click="editTaskListName"><i class="ik ik-plus" style="cursor: pointer;"></i></li>
          </template>
        </div>
      </draggable>
    </div>
    <div v-else>
      <div class="card-header">

        <b-form-input placeholder="내용을 입력해주세요" v-model="taskListName" autofocus @keydown.enter.exact="setTaskListName"
                      @keydown.esc="closeTaskList"></b-form-input>
        <li class="list-unstyled" @click="closeTaskList"><i class="ik ik-x close-card" style="cursor: pointer;"></i>
        </li>
        <li class="list-unstyled" @click="setTaskListName"><i class="ik ik-plus" style="cursor: pointer;"></i></li>
      </div>
    </div>

    <div class="card-body">
      <div v-if="create">
        <li class="dd-item list-unstyled">
          <div class="dd-handle">
            <TaskEdit @createFormToggle="createFormToggle" :color="color" :date="date"
                      :tasks="getTasks" :task-list-id="taskList.id"></TaskEdit>
          </div>
        </li>
      </div>

      <ol class="dd-list" name="task-list">
        <draggable :list="getTasks" :group="'tasks'" @change="taskEventHandler" draggable=".item"
                   :scroll-sensitivity="200"
                   :force-fallback="true"
                   :disabled="disableCheck">
          <li class="dd-item item" v-for="(task,index) in getTasks" :key="index">

            <div class="dd-handle" v-if="index != editSelector">
              <div>
                <div style="display: flex; align-items: center;">
                  <span class="small text-muted" v-if="task.start_date">{{getDateFormat(task.start_date)}} ~ {{getDateFormat(task.end_date)}}</span>
                  <div class="dropdown d-inline-block" style="position: absolute;right: 0;">
                    <a class="nav-link dropdown-toggle" href="#" id="moreDropdown" role="button" data-toggle="dropdown"
                       aria-haspopup="true" aria-expanded="false"><i class="ik ik-more-horizontal"></i></a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="moreDropdown"
                         x-placement="bottom-end"
                         style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-140px, 30px, 0px);">
                      <a class="dropdown-item" @click="editFormToggle(index)">Edit</a>
                      <a class="dropdown-item" v-if="task.state" @click="editTask(task,false)">Done</a>
                      <a class="dropdown-item" v-else @click="editTask(task,true)">Revoke</a>
                      <a class="dropdown-item" @click="deleteTask(task,index)" style="color:red;">Delete</a>
                    </div>
                  </div>

                </div>

                <p id="content" style="margin:0">{{task.content}}</p>
                <footer style="display: flex;justify-content: flex-end;">
                  <small>created by {{channelUsers.find(user => user.email ==
                    task.member_email).name}}</small>
                  <!-- 채널 옮길때마다 아래 name에서 error 일어나는 것 같음 -->
                </footer>
              </div>
              <div class="task-color" :style="{'background-color':task.color}"></div>

            </div>
            <div class="dd-handle" v-else>
              <TaskEdit @editFormToggle="editFormToggle" :color="color" :date="date"
                        :tasks="getTasks" :task-list-id="taskList.id" :index="index"></TaskEdit>
            </div>
          </li>
        </draggable>
      </ol>

    </div>


  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
  import VSwatches from 'vue-swatches'
  import 'vue-swatches/dist/vue-swatches.css'
  import {mapGetters} from "vuex";
  import TaskEdit from "../views/todolist/TaskEdit";

  export default {
    name: 'TaskList',
    props: ["taskList"],
    computed: {
      ...mapGetters({
        channelUsers: 'getChannelUsers',
        currentChannel: 'getCurrentChannel',
        isSmallWidth: 'getIsSmallWidth'
      }),
      getTasks: function () {
        return this.taskList.tasks
      },
      disableCheck: function () {
        if (this.$store.state.isSmallWidth || this.$store.state.isCreateListActive) {
          return true
        } else {
          return false
        }
      }
    },
    watch: {
      getTasks: function (newVal, oldVal) {
        this.taskList.tasks.forEach(task => {
          task.position = this.taskList.tasks.indexOf(task)
        })
      }
    },
    components: {
      TaskEdit,
      draggable,
      DatePicker,
      VSwatches
    },
    data() {
      return {
        color: '#A463BF',
        date: [],
        updateTask: {
          taskOldIndex: null,
          taskNewIndex: null,
          tasklistOldId: null,
          tasklistNewId: null,
          taskId: null
        },
        editSelector: -1,
        taskListName: '',
        create: false,
        edit: false,
        editTaskListNameVal:''
      }
    },
    methods: {
      closeTaskList: function () {
        this.$emit('closeTaskList')
      },
      taskEventHandler: function ({added, moved, removed}) {
        let updateTaskItem = {
          taskOldIndex: null,
          taskNewIndex: null,
          tasklistOldId: null,
          tasklistNewId: null,
          tasklistId: null,
          taskId: null
        }
        if (added) {
          added.element.tasklist_id = this.taskList.id
        }
        if (moved) {
          updateTaskItem.taskNewIndex = moved.newIndex
          updateTaskItem.taskOldIndex = moved.oldIndex
          updateTaskItem.tasklistId = this.taskList.id
          updateTaskItem.taskId = moved.element.id
          this.$http.post('/api/task/update/position', updateTaskItem)
            .then(res => {
              this.$store.state.stompClient.send('/sub/todo/' + this.currentChannel.id, {}, {typename: 'taskUpdate'})
            }).catch(error => {
            console.error(error)
          })
        }
        if (removed) {
          updateTaskItem.taskOldIndex = removed.oldIndex
          updateTaskItem.taskNewIndex = removed.element.position
          updateTaskItem.tasklistOldId = this.taskList.id
          updateTaskItem.tasklistNewId = removed.element.tasklist_id
          updateTaskItem.taskId = removed.element.id
          this.$http.post('/api/task/update/position', updateTaskItem)
            .then(res => {
              this.$store.state.stompClient.send('/sub/todo/' + this.currentChannel.id, {}, {typename: 'taskUpdate'})
            }).catch(error => {
            console.error(error)
          })
        }
      },
      checkTask: function (evt) {
        evt.draggedContext.element.tasklist_id = this.taskList.id
        evt.draggedContext.element.position = evt.draggedContext.index
      },
      deleteTaskList: function () {
        this.$http.post('/api/tasklist/delete', {
          id: this.taskList.id,
          position: this.taskList.position,
          channel_id: this.currentChannel.id
        })
          .then(res => {
            this.$eventBus.$emit('deleteTaskList', this.taskList)
            this.$store.state.stompClient.send('/sub/todo/' + this.currentChannel.id, {}, {typename: 'taskUpdate'})
          })
          .catch(error => {

          })
      },
      editToggle: function () {
        this.editTaskListNameVal = JSON.parse(JSON.stringify(this.taskList.name))
        this.edit = !this.edit
      },
      editTaskListName: function () {
        console.log('?1')
        this.$http.post('/api/tasklist/update/name', {
          id: this.taskList.id,
          name: this.editTaskListNameVal
        }).then(res => {
          this.taskList.name = JSON.parse(JSON.stringify(this.editTaskListNameVal))
          this.editTaskListNameVal = ''
          this.$store.state.stompClient.send('/sub/todo/' + this.currentChannel.id, {}, {typename: 'taskUpdate'})
          this.$store.commit('setCreateListActive', false)
          this.editToggle()
        }).catch(error => {
          console.error(error)
        })
      },
      editTask: function (task, state) {
        task.state = state
        this.$http.post('/api/task/update/content', task)
          .then(res => {
            this.$store.state.stompClient.send('/sub/todo/' + this.currentChannel.id, {}, {typename: 'taskUpdate'})
          }).catch(error => {
          console.error(error)
        })
      },
      deleteTask: function (task, index) {
        // 현저 유저와 작성자가 같은지 비교해서 삭제할 수 있도록 변경 필요
        this.$http.post('/api/task/delete', task)
          .then(res => {
            this.$store.state.stompClient.send('/sub/todo/' + this.currentChannel.id, {}, {typename: 'taskUpdate'})
            this.taskList.tasks.splice(index, 1)
          }).catch(error => {
          console.error(error)
        })
      },
      createFormToggle: function () {
        this.create = !this.create
        this.taskContent = ''
      },
      editFormToggle: function (index) {
        this.editSelector = index
      },
      setTaskListName: function () {
        console.log('??!!')
        if (this.taskListName == '' || this.taskListName == null) {
          this.$_alert('내용을 입력해주세요.')
        } else {
          this.taskList.channel_id = this.currentChannel.id
          this.taskList.name = this.taskListName
          this.$http.post('/api/tasklist/insert', JSON.stringify(this.taskList), {
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then(res => {
              this.taskList.id = res.data.id
              this.$store.state.stompClient.send('/sub/todo/' + this.currentChannel.id, {}, {typename: 'taskUpdate'})
              this.$store.commit('setCreateListActive', false)
            })
            .catch(error => {
              console.error(error)
            })
        }
      },
      getDateFormat: function (dateData) {
        const date = new Date(dateData)
        let dateToString = ''
        dateToString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        return dateToString
      },
      msgBox: async function () {
        await this.$bvModal.msgBoxConfirm("정말로 이 TaskList를 삭제하시겠습니끼?", {
          title: '확인',
          okTitle: '확인',
          okVariant: 'danger',
          buttonSize: 'sm',
          cancelTitle: '취소'
        })
          .then(value => {
            if (value) {
              this.deleteTaskList()
            }
          })
      }

    }
  }
</script>
<style scoped>

  .v-application ol {
    padding: 0px !important;
  }

  .task-list-enter-active, .task-list-leave-active {
    transition: all 1s;
  }

  .task-list-enter, .task-list-leave-to {
    opacity: 0;
    transform: translateX(50px);
  }

  .task-list-move {
    transition: transform 1s;
  }

  i {
    margin-left: 10px;
  }

  .im-pencil {
    opacity: 0.3;
  }

  .im-trash-can {
    opacity: 0.3;
  }

  .im-pencil:hover {
    opacity: 1;
    color: white;
  }

  .im-trash-can:hover {
    opacity: 1;
    color: red;
  }

  #content {
    overflow: hidden;
    word-wrap: break-word;
  }

  .task-color {
    width: 5px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .dd-handle {
    overflow: visible;
  }

</style>
