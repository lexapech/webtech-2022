<template>
  <v-dialog
      v-model="dialog"
      width="500"
  ><v-card class="panel">
    <p class="text-center font-semibold">Лоты</p>
    <v-table v-if="brokers.find(x=>x.name===openBroker).stocks.length">
      <thead>
      <tr>
        <th class="text-center">
          Инструмент
        </th>
        <th class="text-center">
          Количество
        </th>
        <th class="text-center">
          Стоимость
        </th>
        <th class="text-center">
          Прибыль
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="stock in brokers.find(x=>x.name===openBroker).stocks"
          :key="stock.code"
          @click="stockClick(stock.code)"
          class="cursor-pointer"
      >
        <td>
          <p class="font-semibold" style="font-size:13px">{{stock.code}}</p>
        </td>
        <td class="text-center font-semibold">{{ stock.amount}}</td>
        <td class="text-center font-semibold">{{ stock.price.toLocaleString(undefined, {
          style: 'currency',
          currency: 'USD'
        }) }}</td>
        <td class="text-center"><PriceChange :prop-value="stock.profit"/></td>
      </tr>
      </tbody>
    </v-table>
    <div v-else class="text-center"> У брокера нет акций</div>

  </v-card>
  </v-dialog>

  <div v-if="!running" class="h-full">
    <div class="flex justify-center items-center h-full">
      <h1 class="text-4xl">Торги остановлены</h1>
    </div>
  </div>
  <div v-if="running">
    <div  class="panel flex justify-between items-center px-10">
      <span>Текущая дата: {{currentDate}}</span>
    </div>
    <div class="flex justify-center">
      <div style="width:min(800px, 100vw)">
        <div v-for="broker of brokers">
          <div class="panel my-2">
            <p class="font-semibold">{{ broker.name }}</p>
            <div class ="flex justify-between">
              <p>Объем средств: {{ broker.funds.toLocaleString(undefined, {
                style: 'currency',
                currency: 'USD'
              })  }}</p>
              <p>Стоимость акций: {{ broker.total.toLocaleString(undefined, {
                style: 'currency',
                currency: 'USD'
              })  }}</p>
              <v-btn color="blue" @click="dialog=true;openBroker=broker.name">Список акций</v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SocketService from "@/services/socket.service"
import PriceChange from "@/components/PriceChange.vue";
export default {
  components:{PriceChange},
  name: "Admin",
  data() {
    return {
      brokers:[],
      openBroker: undefined,
      running:false,
      currentDate:''
    }
  },
  created() {
    SocketService.connect('admin',(x)=>{
      if(x!=="running") {
        this.running=false
      }
    })
    SocketService.stocks((data)=>{
      this.running=!data.last
      this.setCurrentDate(data.date)
    })
    SocketService.brokers((data)=>{
      this.running=true
      this.brokers = data
      console.log(data)
    })
  },
  methods:{
    setCurrentDate(date){
      this.currentDate= new Date(date).toLocaleDateString(undefined,{
        year: 'numeric', month: 'long', day: 'numeric',weekday:"short"
      })
      console.log(date)
    },
  }

}
</script>

<style scoped>
  .panel {
    background-color: #E7E7E7;
    padding: 10px;
  }
</style>