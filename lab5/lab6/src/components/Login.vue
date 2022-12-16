<template>
  <div class="flex justify-center items-center w-full h-full">
    <div class="panel">
      <div class="flex flex-col">
        <div class="m-5">
          <v-combobox
              style="width: 300px"
              label="Имя пользователя"
              :items="userList"
              v-model="selectedUser"
          ></v-combobox>
        </div>
        <div class="m-5 flex justify-center">
          <v-btn @click="login">Войти</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from '../router/index.ts'
import store from '@/store'
export default {
  name: "Login",
  data() {
    return {
      userList:[],
      selectedUser:''
    }
  },
  created() {
    axios.get('http://localhost:3100/api/brokers/all').then((x)=>{
      this.userList=x.data.map(t=>t.name)
    })
  },
  methods:{
    login(){
      if(this.selectedUser!=='') {
        router.push('/market')
        store.username = this.selectedUser
        console.log(this.selectedUser)
      }

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