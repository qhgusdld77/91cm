<template>
  <b-card style="max-width: 20rem;" class="mb-2">
    <b-card-text>
      <div id="clock text">
        <p class="date">{{date}}</p>
        <p class="time">{{time}}</p>
      </div>
    </b-card-text>
  </b-card>
</template>

<script>
  const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  export default {
    name: 'Clock',
    data() {
      return {
        time: '',
        date: ''
      }
    },
    methods: {
      updateTime: function () {
        const currentDate = new Date()
        this.time = this.zeroPadding(currentDate.getHours(), 2) + ':' + this.zeroPadding(currentDate.getMinutes(), 2) + ':' + this.zeroPadding(currentDate.getSeconds(), 2)
        this.date = this.zeroPadding(currentDate.getFullYear(), 4) + '-' + this.zeroPadding(currentDate.getMonth() + 1, 2) + '-' + this.zeroPadding(currentDate.getDate(), 2) + ' ' + week[currentDate.getDay()]
      },
      zeroPadding: function (num, digit) {
        let zero = ''
        for (let i = 0; i < digit; i++) {
          zero += '0'
        }
        return (zero + num).slice(-digit)
      }
    },
    created() {
      setInterval(this.updateTime, 1000)
    }
  }
</script>

<style scoped>
  p {
    margin: 0;
    padding: 0;
  }

  #clock {
    font-family: 'Share Tech Mono', monospace;
    color: #ffffff;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .time {
    letter-spacing: 0.05em;
    font-size: 3.5vw;
    padding: 5px 0;
  }

  .date {
    letter-spacing: 0.1em;
    font-size: 1.5vw;
  }

  .text {
    letter-spacing: 0.1em;
    padding: 20px 0 0;
  }

</style>
