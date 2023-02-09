<template>
  <n-scrollbar style='max-height: 150px;' v-if='type === 1 || type === 2'>
    <div style='padding: 10px;'>
      <div v-if='type === 1'>{{value}}</div>
      <div v-html='value' v-else></div>
    </div>
  </n-scrollbar>
  <n-image width='150' height='150' object-fit='contain' :show-toolbar='false' :src='value' v-if='type === 3' />
</template>

<script>
  export default {
    props: {
      type: Number,
      value: String
    }
  }
</script>
