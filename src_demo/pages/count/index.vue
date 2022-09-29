<template>
  <div>
    <g-bar filter @reload='Load'>
      <template #right>
        <n-date-picker style='margin-right: 10px;' v-model:value='search_time' @update:value='ReLoad' />
      </template>
    </g-bar>
    <g-table :columns='list_hd' :data='list_data' :loading='loading' />
    <n-pagination :page-size='20' :item-count='list_total' :page='list_index' @update:page='Load' />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list_hd: [{
          title: '楼盘名称',
          key: 'name'
        }, {
          title: '拨打手机次数',
          key: 'callNum'
        }, {
          title: 'PV',
          key: 'pv'
        }, {
          title: 'UV',
          key: 'uv'
        }, {
          title: '日期',
          width: 150,
          key: 'date'
        }],
        list_data: [],
        list_total: 0,
        list_index: 1,
        search_time: Date.now(),
        loading: false
      }
    },
    computed: mapState(['lang']),
    methods: {
      ReLoad() {
        this.Load(this.list_index)
      },
      Load(index, sort, search) {
        this.sort = sort === undefined ? this.sort : sort
        this.search = search === undefined ? this.search : search
        this.list_index = index

        this.loading = true
        this.$post('HouseCount/Index', { pageIndex: index, pageSize: 20, searchKey: this.search, date: this.$time(this.search_time, 'yyyy-MM-dd') }).then(data => {
          this.list_data = data.list
          this.list_total = data.totalNum
          this.loading = false
          this.$backtop()
        }).catch(() => this.loading = false)
      }
    },
    created() {
      this.Load(1)
    }
  }
</script>
