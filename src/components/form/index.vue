<template>
  <n-modal preset='card' :auto-focus='false' v-model:show='show' :style='modal_style'>
    <n-form class='form_content' :class="{ 'g-form-10': readonly }" require-mark-placement='left' label-placement='left' :label-width='labelWidth' :model='model' :rules='rules' ref='model'>
      <n-grid :cols='24' :x-gap='20'>
        <n-grid-item :span='item.span' v-for='item in config'>
          <n-scrollbar style='padding-right: 14px;' :style="{ maxHeight: full ? 'calc(100vh - 112px)' : '' }">
            <template v-for='n in item.list'>
              <n-form-item :label='n.text' :path='n.name' v-if='!n.Check || n.Check(model)' :ref='n.name'>
                <g-number v-model:value='model[n.name]' :min='n.min' :max='n.max' :fixed='n.fixed' :placeholder='n.holder' v-if="n.type == 'number'" />
                <g-editor v-model:value='model[n.name]' :placeholder='n.placeholder || `${lang.input}${n.text}`' @update:value='Check(n.name)' @upload='Uploaded' :ref='`component_${n.name}`' v-else-if="n.type == 'editor'" />
                <g-image-picker v-model:value='model[n.name]' :crop='n.crop' :width='n.width' :height='n.height' :readonly='n.readonly' @update:value='Check(n.name)' @upload='Uploaded' :ref='`component_${n.name}`' v-else-if="n.type == 'image'" />
                <n-rate v-model:value='model[n.name]' v-else-if="n.type == 'rate'" />
                <n-date-picker v-model:value='model[n.name]' :clearable='!!n.clearable' :type="n.mode || 'date'" v-else-if="n.type == 'date'" />
                <n-input v-model:value='model[n.name]' type='textarea' show-count :rows='5' :disabled='n.disabled' :maxlength='n.max' :placeholder='n.holder' v-else-if="n.type == 'textarea'" />
                <n-input v-model:value='model[n.name]' type='password' show-password-on='click' :input-props="{ autocomplete: 'new-password' }" :placeholder='lang.holder' v-else-if="n.type == 'password'" />
                <n-select v-model:value='model[n.name]' filterable :multiple='n.multiple' :options='n.list' v-else-if="n.type == 'select'" />
                <n-switch v-model:value='model[n.name]' v-else-if="n.type == 'switch'" />
                <n-dynamic-tags v-model:value='model[n.name]' v-else-if="n.type == 'tags'" />
                <slot :name='n.name' v-else-if="n.type == 'slot'" />
                <span v-else-if="n.type == 'text'">{{`${model[n.name]}` || lang.nothing}}</span>
                <n-input v-model:value='model[n.name]' separator='-' :pair='n.pair' :disabled='n.disabled' :placeholder='n.holder' v-else />
              </n-form-item>
            </template>
          </n-scrollbar>
        </n-grid-item>
      </n-grid>
    </n-form>
    <template #footer>
      <div style='text-align: right;' v-if='!readonly'>
        <n-button @click='Hide'>{{lang.cancel}}</n-button>
        <n-button type='primary' :loading='loading' @click='Submit'>{{lang.confirm}}</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script>
  export default {
    props: {
      full: Boolean,
      loading: Boolean,
      readonly: Boolean,
      grid: { type: Array, default: [24] },
      width: { type: String, default: '600px' },
      labelWidth: { type: Number, default: 100 }
    },
    emits: ['update:show', 'submit'],
    data: () => ({
      model: {},
      rules: {},
      config: [],
      show: false
    }),
    computed: {
      ...mapState(['lang']),
      modal_style() {
        return {
          width: this.full ? '100vw' : this.width,
          height: this.full ? '100vh' : undefined
        }
      },
      map_preset() {
        return {
          sort: {
            name: 'sort',
            text: this.lang.sort,
            type: 'number',
            min: 0,
            fixed: 0,
            must: true
          }
        }
      }
    },
    methods: {
      Init(list) {
        let model = {}
        let rules = {}
        let config = this.grid.map(i => ({ span: i, list: [] }))

        list.forEach(item => {
          let i = Object.assign({}, this.map_preset[item.preset] || {}, item)

          config[i.grid || 0].list.push(i)

          if (i.rule || i.must)
            rules[i.name] = [{
              required: !!i.must,
              type: this.GetType(i),
              trigger: ['input', 'blur'],
              validator: i.rule ? (rule, value) => i.rule(value, model) : undefined,
              message: i.rule ? undefined : `${i.type == 'select' ? this.lang.select : this.lang.input}${i.text}`
            }]

          if (i.type == 'number')
            model[i.name] = isNaN(+i.value) ? null : +i.value
          else if (i.type != 'slot')
            model[i.name] = i.value === undefined ? i.type == 'switch' ? false : i.type == 'select' ? i.multiple ? [] : undefined : '' : i.value
          else if (i.must)
            model[i.name] = 'value'
        })

        this.list = list
        this.model = model
        this.rules = rules
        this.config = config
        this.show = true
      },
      Hide() {
        this.show = false
      },
      GetType(item) {
        if (typeof item.value == 'number' || item.type == 'number')
          return 'number'
        else if (item.type == 'switch')
          return 'boolean'
        else if (item.type == 'select' && typeof item.list[0].value == 'number')
          return 'number'
        else if (item.multiple || Array.isArray(item.value))
          return 'array'
        else
          return 'string'
      },
      Check(name) {
        this.$refs[name][0].validate()
      },
      Uploaded() {
        if (++this.load != this.load_need) return
        this.EmitSubmit()
        this.$spin.hide()
      },
      Submit() {
        this.list.forEach(i => {
          if (typeof this.model[i.name] == 'string')
            this.model[i.name] = this.model[i.name].trim()
        })

        this.$refs.model.validate(err => {
          if (err) return this.$message.warning(this.lang.check_error)

          let list = this.list.filter(i => (i.type == 'image' || i.type == 'editor') && (!i.Check || i.Check(this.model)))

          if (list.length) {
            this.$spin.show()
            this.load = 0
            this.load_need = list.length
            list.forEach(i => this.$refs[`component_${i.name}`][0].Upload())
          } else {
            this.EmitSubmit()
          }
        })
      },
      EmitSubmit() {
        let data = JSON.parse(JSON.stringify(this.model))
        this.list.forEach(i => {
          if (i.type == 'slot')
            delete data[i.name]
        })

        this.$emit('submit', data)
      }
    }
  }
</script>