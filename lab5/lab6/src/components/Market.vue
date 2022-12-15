<template>
  <v-dialog
      v-model="dialog"
      width="500"
  ><v-card class="panel">
    <Line ref="line" :data="chartData" :options="chartOptions"/>
    <p>Ваши лоты: <span class="font-semibold">{{lots}}</span></p>
    <p>Стоимость: <span class="font-semibold">{{stockPrice}}</span></p>
    <p>Прибыль: <PriceChange :prop-value="profit"/></p>
    <v-text-field type="number" placeholder="Количество акций" v-model="amount"></v-text-field>
    <div class="flex justify-around ">
      <v-btn color="green" @click="buy">КУПИТЬ</v-btn>
      <v-btn color="red" @click="sell">ПРОДАТЬ</v-btn>
    </div>

  </v-card>
    </v-dialog>
    <v-dialog
        v-model="errorDialog"
        width="300"
      >
        <v-card class="p-10">
          <div class="flex justify-center my-5">
            <p>{{errorMessage}}</p>
          </div>
          <div class="flex justify-center my-5">
            <v-btn color="blue" @click="errorDialog=false">ОК</v-btn>
          </div>

        </v-card>
    </v-dialog>

  <div v-if="!running" class="h-full">
    <div class="flex justify-center items-center h-full">
      <h1 class="text-4xl">Торги остановлены</h1>
    </div>
  </div>
  <div v-if="running">
  <div  class="panel flex justify-between items-center pr-10">
    <div class="flex gap-10 items-center">
      <RouterLink to="/admin"><v-btn fab>Админ</v-btn></RouterLink>
      <span id="date">Текущая дата: {{currentDate}}</span>
    </div>
    <span id="funds">Доступные средства: {{funds}}</span>
    <span>Стоимость акций: {{totalPrice}}</span>
  </div>
  <div class="flex justify-center">
    <div style="width:min(800px, 100vw)">
      <v-table>
        <thead>
        <tr>
          <th class="text-center">
            Инструмент
          </th>
          <th class="text-center">
            Цена
          </th>
          <th class="text-center">
            Изменение
          </th>
          <th class="text-center">
            Прибыль
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="stock in stocks"
            :key="stock.code"
            @click="stockClick(stock.code)"
            class="cursor-pointer"
        >
          <td>
            <p class="font-semibold" style="font-size:13px">{{stock.code}}</p>
            <p style="font-size:12px">{{stock.name}}</p>
          </td>
          <td class="text-center font-semibold">{{ stock.price.toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD'
          }) }}</td>
          <td class="text-center"><PriceChange :prop-value="stock.change"/></td>
          <td class="text-center"><PriceChange :prop-value="getProfit(stock.code)"/></td>
        </tr>
        </tbody>
      </v-table>
    </div>
  </div>
  </div>
</template>

<script>

import SocketService from "@/services/socket.service";
import PriceChange from "@/components/PriceChange.vue";

import 'chart.js/auto'
import { Line } from 'vue-chartjs'
import store from "@/store";
import router from "@/router";

export default {
  name: "Market",
  components: {PriceChange,Line},
  mounted(){
    if (store.username) {
      SocketService.connect(store.username,(x)=>{
        if(x!=="running") {
          this.running=false
        }
      })
      SocketService.stocks((data) => {
        this.running=!data.last
        this.setCurrentDate(data.date)
        this.stocks = data.stocks
        if (this.dialog) {
          let stock = data.stocks.find(x => x.code === this.dialog)
          this.chartArray.push({date: new Date(data.date).toLocaleDateString(), price: stock.price})
        }
      })
      SocketService.userinfo((data) => {
        this.funds = data.funds.toLocaleString(undefined, {
          style: 'currency',
          currency: 'USD'
        })
        this.totalPrice = data.total.toLocaleString(undefined, {
          style: 'currency',
          currency: 'USD'
        })
        console.log(data)
        this.brokerStocks = data.stocks
      })
      console.log("connected")
    }
    else {
      router.push('/login')
    }
    console.log('mounted')
  },
  beforeRouteLeave() {
    console.log('unmount')
    SocketService.disconnect()
  },
  data(){
      return{
        stocks:[],
        currentDate:'',
        funds:'',
        running:false,
        totalPrice:'',
        dialog:false,
        chartArray:[],
        amount:1,
        brokerStocks:[],
        errorDialog:false,
        errorMessage:'',
        chartOptions: {
            elements: {
              point:{
                radius: 0
              }
            }
          }
      }
  },
  watch:{
    amount(){
      if(this.amount<0) this.amount=0
    }
  },
  computed:{
    stockPrice(){
      let t = this.brokerStocks.find(x=>x.code===this.dialog)
        return t?t.price.toLocaleString(undefined, {
          style: 'currency',
          currency: 'USD'
        }):'0'
    },
    lots(){
      let t = this.brokerStocks.find(x=>x.code===this.dialog)
      return t?t.amount:'0'
    },
    profit(){
      let t = this.brokerStocks.find(x=>x.code===this.dialog)
      return t?t.profit:0
    },
    chartData() {
      return {
        labels: this.chartArray.map(x=>x.date),
        datasets: [{
          backgroundColor: 'rgb(255, 99, 132)',
          label: `История изменений ${this.dialog}`,
          data: this.chartArray.map(x=>x.price),
          borderColor: 'rgb(255, 99, 132)'
        }]
      }
    }
  },
  methods:{
    getProfit(code){
      let t = this.brokerStocks.find(x=>x.code===code);
      return (t!==undefined)?t.profit:undefined
    },
    buy(){
      SocketService.socketConnection.emit('operation', {code:this.dialog,quantity:+this.amount},(x)=>{
        if(x) {
          this.errorDialog=true
          this.errorMessage=x.message
        }

      })
    },
    sell(){
      SocketService.socketConnection.emit('operation', {code:this.dialog,quantity:-this.amount},(x)=>{
        if(x) {
          this.errorDialog=true
          this.errorMessage=x.message
        }
      })
    },
    setCurrentDate(date){
      this.currentDate= new Date(date).toLocaleDateString(undefined,{
        year: 'numeric', month: 'long', day: 'numeric',weekday:"short"
      })
      console.log(date)
    },
    stockClick(code){
      SocketService.socketConnection.emit('stock',code,x=>{
        this.chartArray=x.map(t=>{
          return {
            date:t.date,
            price:t.open
          }
        })
      })

      this.dialog = code
      console.log("clicked")
    }
  }
}
</script>

<style scoped>
  .panel {
    background-color: #E7E7E7;
    padding: 10px;
  }
</style>