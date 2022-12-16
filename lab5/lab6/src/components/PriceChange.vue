<template>
  <span v-if="value>0" class="font-semibold" style="color:#11d200">{{valueToString}}</span>
  <span v-else-if="value<0" class="font-semibold" style="color:red">{{valueToString}}<v-icon>mdi-menu-down</v-icon></span>
  <span v-else class="font-semibold" style="color:black">{{valueToString}}<v-icon>mdi-menu-up</v-icon></span>
</template>

<script>
export default {
  name: "PriceChange",
  data() {
    return {
      value: 0
    }
  },
  props: ['propValue'],
  watch: {
    propValue: function (newVal) {

      this.value = newVal
    }
  },
  computed:{
    valueToString() {
      if(this.value===undefined) return '-'
      return this.value.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD'
      })
  }
  }

}
</script>

<style scoped>

</style>