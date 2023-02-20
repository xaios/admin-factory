<style scoped lang='stylus' src='./index.styl'></style>

<template>
  <n-image-group>
    <n-space>
      <div class='item' v-for='(n, i) in list' @click='ChooseImage(i)'>
        <n-image width='68' height='68' object-fit='contain' :src='n' v-if='n' />
        <n-icon class='p_middle add' size='24' :component='IconAdd' v-else />
        <template v-if='!readonly'>
          <div class='mask' :style="{ cursor: n ? 'default' : 'pointer' }"></div>
          <div class='f_middle del' @click.stop='DelItem(i)' v-if='!is_single && n'>
            <n-icon color='#fff' :component='IconDel' />
          </div>
        </template>
      </div>
      <n-empty :show-icon='false' v-if='readonly && !list.length' />
    </n-space>
  </n-image-group>
</template>

<script>
  import IconDel from '@vicons/tabler/X'
  import IconAdd from '@vicons/tabler/Plus'

  export default {
    props: {
      value: [String, Array],
      crop: Boolean,
      width: Number,
      height: Number,
      readonly: Boolean
    },
    emits: ['update:value', 'upload'],
    data: () => ({
      IconAdd: markRaw(IconAdd),
      IconDel: markRaw(IconDel),
      list: []
    }),
    computed: {
      ...mapState(['lang']),
      is_single() {
        return typeof this.value === 'string'
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          let list = (this.is_single ? [val] : val).filter(i => i)

          if (!this.readonly && (!list[0] || !this.is_single))
            list.push('')

          this.list = list
        }
      }
    },
    methods: {
      ChooseImage(index) {
        if (this.readonly) return
        this.$photo(this.width, this.height, this.crop).then(file => this.AddItem(file, index))
      },
      AddItem(file, index) {
        let src = URL.createObjectURL(file)

        if (index === this.list.length - 1)
          this.list.splice(this.list.length - 1, 0, src)
        else
          this.list[index] = src

        this.image_map[src] = file
        this.Update()
      },
      DelItem(index) {
        this.list.splice(index, 1)
        this.Update()
      },
      Update() {
        this.$emit('update:value', this.is_single ? this.list[0] || '' : this.list.filter(i => i))
      },
      Upload() {
        let Load = this.$preload(this.list.length, () => {
          this.Update()
          this.$emit('upload')
        })

        this.list.forEach(async (i, index) => {
          if (i && i[0] !== 'h')
            this.list[index] = await this.$upload(this.image_map[i])

          Load()
        })
      }
    },
    created() {
      this.image_map = {}
    }
  }
</script>
