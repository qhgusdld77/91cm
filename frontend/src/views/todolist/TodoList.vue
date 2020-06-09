<template>
  <div >
     <div class="container-fluid">
        <div class="page-header">
            <div class="row align-items-end">
                <div class="col-lg-8">
                    <div class="page-header-title">
                        <i class="ik ik-server bg-blue"></i>
                        <div class="d-inline">
                            <h5>Taskboard</h5>
                            <span>해당 채널 이름을 넣어줍시다</span>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <nav class="breadcrumb-container" aria-label="breadcrumb">
                       <ol class="breadcrumb" style="display: flex;align-items: center;">
                           
                           <li class="breadcrumb-item"> 리스트 생성</li>
                            <li class="breadcrumb-item" @click="addTaskList">
                                <i class="ik ik-plus-circle" style="font-size:1.8rem;cursor: pointer;"></i>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>


        <div class="row">
            <draggable :disabled="isSmallWidth || this.$store.state.isCreateListActive" :list="getTaskBoard" v-bind="dragOptions" @change="tasklistEventHandler" style="width: 100%;flex-direction: row;display: flex;flex-wrap: wrap;">
                <div class="col-md-4" v-for="item in getTaskBoard" :key="item.id">
                    <TaskList :taskList="item" @closeTaskList="closeTaskList"></TaskList>
                </div>
            </draggable>
  
        </div>
    </div>

  </div>
</template>
<script>
  import TaskList from "../../components/TaskList"
  import draggable from 'vuedraggable'
  import Loading from "../main/Loading";
  import {mapGetters} from "vuex";

  export default {
    name: 'Todolist',
    components: {
      Loading,
      TaskList,
      draggable
    },
    watch: {
      getCurrentChannel: function () {
        this.$http.get('/api/tasklist/get/' + this.$store.state.currentChannel.id)
          .then(res => {
            this.taskList = res.data
            this.$store.commit('setTaskBoard', this.taskList)
          })
      },
      getTaskBoard: function () {
        this.taskList = this.$store.state.taskBoard
      }
    },
    computed: {
      ...mapGetters({
        getTaskBoard: 'getTaskBoard',
        isSmallWidth: 'getIsSmallWidth'
      }),
      getAllTaskList: function () {
        for (let i = 0; i < this.taskList.length; i++) {
          this.taskList[i].position = i;
        }
        return this.taskList
      },
      getCurrentChannel: function () {
        return this.$store.state.currentChannel
      },
      dragOptions() {
        return {
          animation: "200",
          group: "todo"
        }
      }
    },
    activated() {
      this.taskSubscribe=this.$store.state.stompClient.subscribe('/sub/todo/' + this.$store.state.currentChannel.id, (res) => {
        if (res.headers.typename == 'taskUpdate') {
          this.$store.dispatch('updateTaskBoard')
        }
      })
    },
    deactivated() {
      this.taskSubscribe.unsubscribe()
      this.taskSubscribe = null
    },
    created() {
      this.$http.get('/api/tasklist/get/' + this.$store.state.currentChannel.id)
        .then(res => {
          this.taskList = res.data
          this.$store.commit('setTaskBoard',this.taskList)
        })
      this.$eventBus.$on('deleteTaskList', data => {
        this.taskList.splice(this.taskList.indexOf(data), 1)
      })
    },
    data() {
      return {
      
        taskSubscribe: null,
        connetionCheck: false,
        taskList: [],
        taskListItem: {
          id: '',
          name: '',
          channel_id: this.$store.state.currentChannel.id,
          position: '',
          tasks: []
        },
      }
    },
    methods: {
      closeTaskList: function(){
        this.taskList.pop()
        this.$store.commit('setCreateListActive', false)
      },
      
      addTaskList: function () {
        if(!this.$store.state.isCreateListActive){
          this.taskList.push(JSON.parse(JSON.stringify(this.taskListItem)))
          this.$store.commit('setCreateListActive', true)
        }
      },
      tasklistEventHandler: function ({added, moved, removed}) {
        if (moved) {
          this.$http.post('/api/tasklist/update/position', {
            tasklistOldIndex: moved.oldIndex,
            tasklistNewIndex: moved.newIndex,
            tasklistId: moved.element.id,
            channelId : this.$store.state.currentChannel.id
          }).then(res => {
            console.log(res.data,'position')
            if(res.data) this.$store.state.stompClient.send('/sub/todo/' + this.$store.state.currentChannel.id, {}, {typename: 'taskUpdate'})
            else this.$alertModal('alert', '위치 변경에 실패했습니다.')            
          }).catch(error => {
            console.error(error)
          })
        }
      }
    }
  }
</script>
<style scoped>
  .btn:hover {
    background-color: #BDBDBD;
  }

  .task-board-enter-active, .task-board-leave-active {
    transition: all 1s;
  }

  .task-board-enter, .task-board-leave-to {
    opacity: 0;
    transform: translateX(50px);
  }

  .task-board-move {
    transition: transform 1s;
  }

  .scrolling-wrapper {
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .breadcrumb-item + .breadcrumb-item::before {
    display: inline-block;
    padding-right: 0.5rem;
    color: #6c757d;
    content: "";
    }
</style>
