import axios from 'axios'

class InviteService {

  async invite(sender, channelId, recipients,channelName) {
    console.log(channelId)
    return await axios.post('/api/invite', {
      channel_id: channelId,
      sender: sender,
      recipients: recipients,
      channel_name:channelName
    })
  }
  sendMail(){
    
  }


}

export default new InviteService()
