<template>
  <div style="position: relative;" v-if="$store.state.isSearchMode">
    <i style="position:absolute;left: 15px;top: calc(50% - 12px);" class="im im-magnifier"></i>
    <template v-if="searchResultList!=null">
      <a @click="up"><i style="position: absolute; right: 50px; top: calc(50% - 12px);" class="im im-angle-up"></i></a>
      <a @click="down"><i style="position: absolute; right: 15px; top: calc(50% - 12px);" class="im im-angle-down"></i></a>
    </template>
    <b-form-input
      @keydown.esc.exact="toggleSearchMode"
      @keydown.enter.exact="search"
      placeholder="Search..."
      style="height: 80px;padding-left: 50px; padding-right: 90px;"
      autofocus
    ></b-form-input>
  </div>
</template>
<script>
  import {mapGetters} from "vuex";

  export default {
    props: ['cursorPoint'],
    name: 'SearchInput',
    data() {
      return {
        searchResultList: null,
        offset: 0,
        index: 0,
        oldlength: 0,
        isGetMsgByUp: false
      }
    },
    mounted() {
      //자식의 mounted가 먼저 실행되기때문에 따로 요소를 다시한번 가져옴
      this.$nextTick(() => {
        this.wrapperEl = document.querySelector('.c-c-wrapper')
      })
      this.$store.watch(() => this.$store.getters.getSearchMode, isSearchMode => {
        if (!isSearchMode) {
          this.$store.commit('setSearchText', '')
          this.index = 0
          this.oldlength = 0
          this.searchResultList = null
        }
      })
    },
    methods: {
      search(e) {
        this.index = 0
        this.oldlength = 0
        e.preventDefault()
        if (e.target.value == '') {
          alert('검색어를 입력해주세요.')
        } else {
          this.$store.commit('setSearchText', e.target.value)
          this.$nextTick(() => {
            this.searchStart()
          })
        }
      },
      toggleSearchMode(e) {
        // searchText값이 바뀌면 contentWrapper에 있는 필터가 실행되는데 (msgarray가 바뀌어도 실행됨)
        // 실행되면 span태그가 추가된것들이 초기화되고 다시 filter를 진행한다.
        this.$store.commit('setSearchText', '')
        this.index = 0
        this.oldlength = 0
        this.$store.state.isSearchMode = !this.$store.state.isSearchMode
      },
      up: function () {
        if (0 < this.index) {
          this.index -= 1;
          this.scrollToSearchEl(this.index + 1, this.index)
        } else {
          this.GetMsg('up')
        }
      },
      down() {
        if (this.searchResultList.length - 1 > this.index) {
          this.index += 1;
          this.scrollToSearchEl(this.index - 1, this.index)
        }
      },
      GetMsg(by) {
        if (this.cursorPoint.empty == false) {
          this.oldlength = this.searchResultList.length;
          this.isGetMsgByUp = true
          this.$emit('getMessage')
        } else {
          if (by == null) {
            alert('검색 결과가 없습니다.')
          }
        }
      },
      searchStart() {
        this.searchResultList = document.querySelectorAll(".highlight")
        //첫번째 블록(처음 가져온 12개의 메시지) 중에 검색결과가 없다면
        if (this.searchResultList.length === 0) {
          this.GetMsg()
        } else { // 첫번째 블록에 검색결과가 있을 때
          //검색 결과가 있어 처음 index값을 할당해줄 때
          if (this.oldlength === 0) {
            this.index = this.searchResultList.length - 1
            this.scrollToSearchEl(null, this.index)
          } else { // up함수에 의해 메시지가 추가돼서 다시 검색을 시작할 때
            if (this.searchResultList.length == this.oldlength) {
              this.GetMsg('up')
            } else {
              this.index = this.searchResultList.length - this.oldlength - 1
              this.scrollToSearchEl(this.index + 1, this.index)
            }
          }
        }
      },
      scrollToSearchEl(oldIdx, newIdx) {
        if (oldIdx != null) {
          this.searchResultList[oldIdx].classList.remove("addhighlight");
        }
        this.offset = this.searchResultList[newIdx].offsetTop
        this.searchResultList[newIdx].classList.add("addhighlight")
        this.wrapperEl.scrollTo(0, this.offset - (this.wrapperEl.clientHeight / 2))
      }
    },
    watch: {
      msgArray: function () {
        if (this.$store.state.isSearchMode && this.isGetMsgByUp) {
          this.isGetMsgByUp = false
          this.searchStart()
        }
      }
    },
    computed: {
      //  getSearchMode () {
      //    return this.$store.getters.getSearchMode
      //  }
      ...mapGetters({
        msgArray: 'getMsgArray'
      })
    }
  }
</script>
