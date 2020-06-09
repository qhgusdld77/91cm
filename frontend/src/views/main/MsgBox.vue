<template>
  <li class="list-unstyled chat-message">
    <div class="icon">
      <slot name="m-icon">
        <img src="../../assets/images/default-user-picture.png" width="40" height="40"/>
      </slot>
    </div>
    <!-- flex에서 벗어나기 위해 감쌈  -->
    <div>
      <div class="verti-align">
        <slot name="m-info">
          <strong>username</strong>
          <span style="font-size: 11px; margin-left:3px;">&nbsp;&nbsp;11:09 AM May 9</span>
        </slot>

      </div>
      <!-- 채팅메세지내용 -->
      <div class="verti-align">
        <slot name="m-content"></slot>
      </div>
      <!-- 채팅메시지내용끝 -->
    </div>
  </li>
</template>
<script>
  export default {
    name: 'MsgBox'
  }
</script>
