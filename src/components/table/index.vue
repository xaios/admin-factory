<template>
  <n-data-table :single-line='false' :row-props='rowProps' :row-key='n => n.id'>
    <template #empty>
      <n-empty :description='lang.no_data' />
    </template>
  </n-data-table>
</template>

<script>
  export default {
    props: {
      rowProps: Object
    },
    computed: mapState(['lang'])
  }
</script>
