<template>
  <n-input-number style='width: 200.8px;' :show-button='false' :min='min' :max='max' :value='value' @blur='Fixed' @update:value='Change' />
</template>

<script>
  export default {
    props: {
      value: Number,
      min: Number,
      max: Number,
      fixed: Number
    },
    emits: ['update:value'],
    methods: {
      Change(value) {
        this.$emit('update:value', value)
      },
      Fixed() {
        if (this.max !== undefined && this.value > this.max)
          return this.$emit('update:value', this.max)

        if (this.min !== undefined && this.value < this.min)
          return this.$emit('update:value', this.min)

        if (typeof this.fixed != 'number' || typeof this.value != 'number') return
        this.$emit('update:value', +this.value.toFixed(this.fixed))
      }
    }
  }
</script>
