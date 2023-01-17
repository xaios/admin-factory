<template>
  <div class='f_vertically' style='margin-bottom: 10px;'>
    <n-button ghost type='primary' @click='ReLoad'>{{lang.reload}}</n-button>
    <n-button type='primary' @click='Handle' v-if='handle_btn'>{{handle_btn}}</n-button>
    <slot />
    <div style='flex-shrink: 0;margin-left: auto;'>
      <slot name='right' />
    </div>
    <n-input-group style='width: auto;' v-if='filter'>
      <n-select style='width: 200px;margin-right: 10px;' filterable :options='sortList' v-model:value='sort' @update:value='ReLoad' v-if='sortList' />
      <n-input style='width: 200px;' :placeholder='lang.search_input' v-model:value='search' @keyup.enter='ReLoad' />
      <n-button type='primary' @click='ReLoad'>{{lang.search}}</n-button>
    </n-input-group>
  </div>
</template>

<script>
  export default {
    props: {
      handle: String,
      filter: Boolean,
      sortList: Array
    },
    emits: ['handle', 'reload'],
    data: () => ({
      sort: undefined,
      search: ''
    }),
    computed: {
      ...mapState(['lang']),
      handle_btn() {
        return this.handle === undefined ? '' : (this.handle || this.lang.create)
      }
    },
    watch: {
      sortList: {
        immediate: true,
        handler(list) {
          this.sort = list?.[0]?.value
        }
      }
    },
    methods: {
      ReLoad() {
        this.$emit('reload', 1, this.sort, this.search.trim())
      },
      Handle() {
        this.$emit('handle')
      }
    }
  }
</script>
