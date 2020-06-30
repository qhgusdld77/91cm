import axios from 'axios'
import store from '../store'
class AboutChannel{
    // 임시로 제가 만든 채널리스트 가져오는 api입니다.
    // 추후에 코드 합치고나서 만들어주신 api 쓸 예정입니다.
    getChannelList () {
        return axios.get('/api/channel/list')
    }

    createChannel (channelTitle,email) {
        return axios.post('/api/channel/create', {
            name: channelTitle,
            member_email: email
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
    }
/*
    updateChannelAPI (currentChannel) {
      return axios.post('/api/channel/update', currentChannel,
      {
        headers: {'Content-Type': 'application/json'}
      })
    }

    deleteChannelAPI (currentChannel) {
      return axios.post('/api/channel/delete', currentChannel,
      {
        headers: {'Content-Type': 'application/json'}
      })
    }
*/
    updateLastAccessDate (currentId,oldId) {
      return axios.put('/api/channel/update/lastaccessdate',
      {
        oldChannelId: oldId,
        currentChannelId: currentId,
        userEmail: store.state.currentUser.email
      }
      )
    }

    updateLastAccessStatus (oldVal,newVal) {
      if(store.state.currentChannel!=null){
        if(oldVal == 'main' && newVal != 'main' ){
          this.updateLastAccessDate(store.state.currentChannel.id)
        }
      }
    }
}

export default new AboutChannel()
