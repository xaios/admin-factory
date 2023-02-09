<template>
  <div>
    <g-bar handle filter @handle='Edit' @reload='Load' />
    <g-table :columns='list_hd' :data='list_data' :loading='loading' />
    <n-pagination :page-size='20' :item-count='list_total' :page='list_index' @update:page='Load' />
    <g-form title='文章信息' width='800px' :loading='loading' @submit='Submit' ref='form' />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list_hd: [{
          title: '文章标题',
          key: 'title'
        }, {
          title: '创建时间',
          width: 150,
          key: 'createTime'
        }, {
          title: '是否可见',
          width: 150,
          render: row => this.$switch({ cgi: 'Article/OnOffLine', id: row.id, value: row.status === 1, onUpdate: this.ReLoad })
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
      Edit(row = {}) {
        this.$refs.form.Init([{
          name: 'title',
          text: '文章标题',
          must: true,
          value: row.title
        }, {
          name: 'content',
          text: '文章内容',
          type: 'editor',
          must: true,
          value: row.content
        }])

        this.form_id = row.id
      },
      Del(id) {
        this.$dialog.confirm({ title: this.lang.warn_prompt, content: this.lang.sure_delete }).then(() => {
          this.$post('Article/Delete', { id }).then(this.ReLoad)
        })
      },
      ReLoad() {
        this.Load(this.list_index)
      },
      Submit(data) {
        this.loading = true
        data.id = this.form_id
        this.$post(`Article/${data.id ? 'Update' : 'Add'}`, data).then(data => {
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
        this.$post('Article/Index', { pageIndex: index, pageSize: 20, searchKey: this.search }).then(data => {
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
