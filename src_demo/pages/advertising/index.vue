<template>
  <div>
    <g-bar handle @handle='Edit' @reload='Load' />
    <g-table :columns='list_hd' :data='list_data' :loading='loading' />
    <n-pagination :page-size='20' :item-count='list_total' :page='list_index' @update:page='Load' />
    <g-form title='广告信息' :loading='loading' @submit='Submit' ref='form' />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list_hd: [{
          title: '图片',
          width: 150,
          render: row => this.$image(row.image)
        }, {
          title: '跳转类型',
          width: 100,
          render: row => h('span', ['', '不跳转', '楼盘详情', '文章详情', '公众号文章'][row.type])
        }, {
          title: '生效时间',
          render: row => h('span', `${row.startTime} - ${row.endTime}`)
        }, {
          title: '是否可见',
          width: 100,
          render: row => this.$switch({ cgi: 'HomePopUp/OnOffLine', id: row.id, value: row.status == 1, onUpdate: this.ReLoad })
        }, {
          title: '创建时间',
          width: 150,
          key: 'createTime'
        }, {
          title: '操作',
          width: 150,
          render: row => [
            this.$button({ onClick: () => this.Edit(row) }, '编辑'),
            this.$button({ type: 'error', onClick: () => this.Del(row.id) }, '删除')
          ]
        }],
        list_data: [],
        list_total: 0,
        list_index: 1,
        loading: false
      }
    },
    computed: mapState(['lang']),
    methods: {
      async Edit(row = {}) {
        this.$spin.show()
        let building_data = (await this.$post('House/Index', { pageIndex: 1, pageSize: 1000 })).list
        let article_data = (await this.$post('Article/Index', { pageIndex: 1, pageSize: 1000 })).list

        this.$refs.form.Init([{
          name: 'image',
          text: '图片',
          type: 'image',
          must: true,
          value: row.image
        }, {
          name: 'type',
          text: '跳转类型',
          type: 'select',
          list: [
            { value: 1, label: '不跳转' },
            { value: 2, label: '楼盘详情' },
            { value: 3, label: '文章详情' },
            { value: 4, label: '公众号文章' }
          ],
          value: row.type || 1
        }, {
          name: 'infoId2',
          text: '跳转楼盘',
          type: 'select',
          list: building_data.map(i => ({ label: i.name, value: i.id })),
          Check: model => model.type == 2,
          must: true,
          value: row.type == 2 ? row.infoId : undefined
        }, {
          name: 'infoId3',
          text: '跳转文章',
          type: 'select',
          list: article_data.map(i => ({ label: i.title, value: i.id })),
          Check: model => model.type == 3,
          must: true,
          value: row.type == 3 ? row.infoId : undefined
        }, {
          name: 'url',
          text: '文章地址',
          Check: model => model.type == 4,
          must: true,
          value: row.url
        }, {
          name: 'time',
          text: '生效时间',
          type: 'date',
          mode: 'datetimerange',
          must: true,
          value: row.id ? [+new Date(row.startTime), +new Date(row.endTime)] : [Date.now(), Date.now()]
        }])

        this.form_id = row.id
        this.$spin.hide()
      },
      Del(id) {
        this.$dialog.confirm({ title: this.lang.warn_prompt, content: this.lang.sure_delete }).then(() => {
          this.$post('HomePopUp/Delete', { id }).then(this.ReLoad)
        })
      },
      ReLoad() {
        this.Load(this.list_index)
      },
      Submit(data) {
        this.loading = true
        this.$post(`HomePopUp/${this.form_id ? 'Update' : 'Add'}`, {
          id: this.form_id,
          image: data.image,
          type: data.type,
          infoId: data.type == 2 ? data.infoId2 : data.type == 3 ? data.infoId3 : undefined,
          url: data.type == 4 ? data.url : undefined,
          startTime: this.$time(data.time[0]),
          endTime: this.$time(data.time[1])
        }).then(data => {
          this.ReLoad()
          this.$refs.form.Hide()
          this.$message.success(this.lang.submit_success)
        }).catch(() => this.loading = false)
      },
      Load(index, sort, search) {
        this.sort = sort === undefined ? this.sort : sort
        this.search = search === undefined ? this.search : search
        this.list_index = index

        this.loading = true
        this.$post('HomePopUp/Index', { pageIndex: index, pageSize: 20 }).then(data => {
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
