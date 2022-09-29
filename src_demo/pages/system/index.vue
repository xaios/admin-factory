<template>
  <div>
    <g-bar handle @handle='Edit' @reload='Load' />
    <g-table :columns='list_hd' :data='list_data' :loading='loading' />
    <g-form :title='lang.system_config' width='800px' :label-width='120' :loading='loading' @submit='Submit' ref='form' />
  </div>
</template>

<script>
  import component_desc from './desc.vue'

  export default {
    data: () => ({
      list_data: [],
      loading: false
    }),
    computed: {
      ...mapState(['lang']),
      list_hd() {
        return [{
         title: this.lang.config_type,
         width: 150,
         render: row => h('span', ['', this.lang.text, this.lang.rich_text, this.lang.editor_image][row.type])
       }, {
         title: this.lang.config_id,
         width: 150,
         key: 'key'
       }, {
         title: this.lang.config_name,
         width: 150,
         key: 'title'
       }, {
         title: this.lang.config_content,
         render: row => h(component_desc, { type: row.type, value: row.value })
       }, {
         title: this.lang.handle,
         width: 100,
         render: row => this.$button({ onClick: () => this.Edit(row) }, this.lang.edit)
       }]
      }
    },
    methods: {
      Edit(row = {}) {
        this.$refs.form.Init([{
          name: 'key',
          text: this.lang.config_id,
          must: true,
          value: row.key,
          disabled: !!row.id
        }, {
          name: 'title',
          text: this.lang.config_name,
          must: true,
          value: row.title
        }, {
          name: 'type',
          text: this.lang.config_type,
          type: 'select',
          list: [
            { value: 1, label: this.lang.text },
            { value: 2, label: this.lang.rich_text },
            { value: 3, label: this.lang.editor_image }
          ],
          must: true,
          value: row.type
        }, {
          name: 'value_1',
          text: this.lang.config_content,
          must: true,
          value: row.value,
          Check: model => model.type == 1
        }, {
          name: 'value_2',
          text: this.lang.config_content,
          type: 'editor',
          must: true,
          value: row.value,
          Check: model => model.type == 2
        }, {
          name: 'value_3',
          text: this.lang.config_content,
          type: 'image',
          must: true,
          value: row.value,
          Check: model => model.type == 3
        }])

        this.form_id = row.id
      },
      Submit(data) {
        this.loading = true

        data.id = this.form_id
        data.value = data[`value_${data.type}`]
        delete data.value_1
        delete data.value_2
        delete data.value_3

        this.$post(`SystemConfig/${data.id ? 'Update' : 'Add'}`, data).then(data => {
          this.ReLoad()
          this.$refs.form.Hide()
          this.$message.success(this.lang.submit_success)
        }).catch(() => this.loading = false)
      },
      ReLoad() {
        this.Load()
      },
      Load() {
        this.loading = true
        this.$post('SystemConfig/Index', { pageIndex: 1, pageSize: 100 }).then(data => {
          this.list_data = data
          this.loading = false
          this.$backtop()
        }).catch(() => this.loading = false)
      }
    },
    created() {
      this.Load()
    }
  }
</script>
