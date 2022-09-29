<template>
  <div>
    <g-bar handle filter @handle='Edit' @reload='Load' />
    <g-table :columns='list_hd' :data='list_data' :loading='loading' />
    <n-pagination :page-size='20' :item-count='list_total' :page='list_index' @update:page='Load' />
    <g-form full title='楼盘信息' :grid='[7, 7, 10]' :loading='loading' @submit='CheckSubmit' ref='form'>
      <template #houseApartmentInfo>
        <n-dynamic-input :min='1' v-model:value='house_list' @create='AddHouse'>
          <template #default='{ value: item, index }'>
            <n-form style='width: 100%;' label-placement='left' :label-width='100'>
              <n-form-item label='户型名称'>
                <n-input v-model:value='item.name' />
              </n-form-item>
              <n-form-item label='户型价格'>
                <g-number :fixed='2' :min='0' v-model:value='item.totalPrice' />
              </n-form-item>
              <n-form-item label='户型图片'>
                <g-image-picker v-model:value='item.images' :ref='`photo_${index}`' @upload='Uploaded' />
              </n-form-item>
              <n-form-item label='户型标签'>
                <n-dynamic-tags v-model:value='item.tags' />
              </n-form-item>
              <n-form-item label='户型面积'>
                <n-input v-model:value='item.houseArea' />
              </n-form-item>
              <n-form-item label='户型朝向'>
                <n-radio-group v-model:value='item.orientation'>
                  <n-space>
                    <n-radio v-for='n in config.orientation' :value='n'>{{n}}</n-radio>
                  </n-space>
                </n-radio-group>
              </n-form-item>
            </n-form>
          </template>
        </n-dynamic-input>
      </template>
    </g-form>
  </div>
</template>

<script>
  import { NImage, NTag, NSpace } from 'naive-ui'

  export default {
    data() {
      return {
        list_hd: [{
          title: '列表图片',
          render: row => h(NImage, { width: 80, showToolbar: false, src: row.listCover })
        }, {
          title: '楼盘名称',
          key: 'name'
        }, {
          title: '销售姓名',
          key: 'saleUserName'
        }, {
          title: '用途',
          key: 'use'
        }, {
          title: '区域',
          key: 'zoom'
        }, {
          title: '参考均价',
          key: 'unitPrice'
        }, {
          title: '户型',
          key: 'apartment',
          render: row => h(NSpace, { justify: 'center' }, { default: () => row.apartment.map(i => h(NTag, {}, { default: () => i })) })
        }, {
          title: '建筑面积',
          key: 'houseArea'
        }, {
          title: '开盘时间',
          key: 'openTime'
        }, {
          title: '创建时间',
          key: 'createTime'
        }, {
          title: '是否可见',
          width: 70,
          render: row => this.$switch({ cgi: 'House/OnOffLine', id: row.id, value: row.status ==  1, onUpdate: this.ReLoad })
        }, {
          title: '操作',
          width: 70,
          render: row => [
            this.$button({ onClick: () => this.Edit(row) }, '编辑'),
            h('div', { style: { margin: '5px 0' } }),
            this.$button({ type: 'error', onClick: () => this.Del(row.id) }, '删除')
          ]
        }],
        list_data: [],
        list_total: 0,
        list_index: 1,
        house_list: [],
        config: '',
        loading: false
      }
    },
    computed: mapState(['lang']),
    methods: {
      async Edit(row = {}) {
        this.$spin.show()

        this.config = await this.$get('SystemConfig/HouseConfig')
        row = row.id ? await this.$post('House/Detail', { id: row.id }) : {}

        this.$refs.form.Init([{
          name: 'name',
          text: '楼盘名称',
          must: true,
          value: row.name
        }, {
          name: 'use',
          text: '用途',
          type: 'select',
          list: this.config.use.map(i => ({ label: i, value: i })),
          must: true,
          value: row.use
        }, {
          name: 'zoom',
          text: '区域',
          type: 'select',
          list: this.config.zoom.map(i => ({ label: i, value: i })),
          must: true,
          value: row.zoom
        }, {
          name: 'longitude',
          text: '经度',
          must: true,
          value: row.longitude
        }, {
          name: 'latitude',
          text: '纬度',
          must: true,
          value: row.latitude
        }, {
          name: 'address',
          text: '地址',
          must: true,
          value: row.address
        }, {
          name: 'apartment',
          text: '户型',
          type: 'tags',
          must: true,
          value: row.apartment || []
        }, {
          name: 'houseArea',
          text: '建筑面积',
          pair: true,
          must: true,
          holder: ['从', '到'],
          value: row.houseArea ? row.houseArea.split(' - ') : [undefined, undefined]
        }, {
          name: 'unitPrice',
          text: '参考均价',
          type: 'number',
          min: 0,
          fixed: 2,
          must: true,
          value: row.unitPrice
        }, {
          name: 'totalPrice',
          text: '总价',
          pair: true,
          must: true,
          holder: ['从', '到'],
          value: row.totalPrice ? row.totalPrice.split(' - ') : [undefined, undefined]
        }, {
          name: 'tags',
          text: '标签',
          type: 'tags',
          value: row.tags || []
        }, {
          name: 'importInfo',
          text: '亮点与卖点',
          type: 'tags',
          value: row.importInfo || []
        }, {
          name: 'openTime',
          text: '开盘时间',
          must: true,
          value: row.openTime
        }, {
          grid: 1,
          name: 'saleHeadimg',
          text: '销售员头像',
          type: 'image',
          width: 100,
          height: 100,
          must: true,
          value: row.saleHeadimg
        }, {
          grid: 1,
          name: 'saleUserName',
          text: '销售员名称',
          must: true,
          value: row.saleUserName
        }, {
          grid: 1,
          name: 'saleTelephone',
          text: '销售员手机',
          must: true,
          value: row.saleTelephone
        }, {
          grid: 1,
          name: 'listCover',
          text: '列表封面图',
          type: 'image',
          width: 640,
          height: 360,
          must: true,
          value: row.listCover
        }, {
          grid: 1,
          name: 'cover',
          text: '详情轮播图',
          type: 'image',
          width: 640,
          height: 360,
          must: true,
          value: row.cover || []
        }, {
          grid: 1,
          name: 'images',
          text: '美图展示',
          type: 'image',
          width: 720,
          height: 540,
          must: true,
          value: row.images || []
        }, {
          grid: 2,
          name: 'houseApartmentInfo',
          type: 'slot'
        }])

        this.house_list = row.apartmentInfo || [this.AddHouse()]

        this.form_id = row.id
        this.$spin.hide()
      },
      AddHouse() {
        return { name: '', images: [], tags: [], totalPrice: null, houseArea: '', orientation: '' }
      },
      Del(id) {
        this.$dialog.confirm({ title: this.lang.warn_prompt, content: this.lang.sure_delete }).then(() => {
          this.$post('House/Delete', { id }).then(this.ReLoad)
        })
      },
      ReLoad() {
        this.Load(this.list_index)
      },
      Uploaded() {
        ++this.load == this.load_need && this.Submit(this.save_data)
      },
      CheckSubmit(data) {
        if (this.house_list.some(i => !i.name || !i.images.length || !i.houseArea || !i.orientation))
          return this.$message.warning('存在未配置完成的户型信息')

        this.load = 0
        this.save_data = data
        this.load_need = this.house_list.length

        this.house_list.forEach((n, i) => this.$refs[`photo_${i}`].Upload())
      },
      Submit(data) {
        this.loading = true

        data.id = this.form_id
        data.houseArea = data.houseArea.join(' - ')
        data.totalPrice = data.totalPrice.join(' - ')
        data.houseApartmentInfo = this.house_list

        this.$post(`House/${data.id ? 'Update' : 'Add'}`, data).then(data => {
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
        this.$post('House/Index', { pageIndex: index, pageSize: 20, searchKey: this.search }).then(data => {
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
