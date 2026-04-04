<script setup>
defineProps({
  type: { type: String, default: 'text' },
  placeholder: String,
  modelValue: String,
  disabled: Boolean,
  error: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    :disabled="disabled"
    @input="$emit('update:modelValue', $event.target.value)"
    :class="[
      'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
      error
        ? 'border-red-400 focus:ring-red-400'
        : 'border-gray-300 focus:ring-gray-900'
    ]"
  />
</template>
