<template>
  <v-dialog
      v-model="dialog"
      width="500"
  ><v-card class="panel">
    <Line ref="line" :data="chartData" :options="chartOptions"/>
    <v-text-field type="number" placeholder="Количество акций" v-model="amount"></v-text-field>
    <div class="flex justify-around">
      <v-btn color="green" @click="buy">КУПИТЬ</v-btn>
      <v-btn color="red" @click="sell">ПРОДАТЬ</v-btn>
    </div>

  </v-card>
    </v-dialog>


  <div class="panel flex justify-between items-center px-10">
    <span>Текущая дата: {{currentDate}}</span>
    <span>Доступные средства: {{funds}}</span>
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
        </tr>
        </tbody>
      </v-table>
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
      SocketService.connect(store.username)
      SocketService.stocks((data) => {
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
      })
      console.log("connected")
    }
    else {
      router.push('/login')
    }
    console.log('mounted')
  },
  beforeUnmount() {
    SocketService.disconnect()
  },
  data(){
      return{
        stocks:[],
        currentDate:'',
        funds:'',
        totalPrice:'',
        dialog:false,
        chartArray:[],
        amount:1,
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
    buy(){
      SocketService.socketConnection.emit('operation', {code:this.dialog,quantity:+this.amount})
    },
    sell(){
      SocketService.socketConnection.emit('operation', {code:this.dialog,quantity:-this.amount})
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