<script setup>
defineProps({
  variant: { type: String, default: 'default' },
  size: { type: String, default: 'default' },
  type: { type: String, default: 'button' },
  disabled: Boolean,
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      variant === 'default'     && 'bg-gray-900 text-white hover:bg-gray-700 focus:ring-gray-900',
      variant === 'outline'     && 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      variant === 'ghost'       && 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      variant === 'destructive' && 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
      size === 'default' && 'h-10 px-4 py-2 text-sm',
      size === 'sm'      && 'h-8 px-3 text-xs',
      size === 'lg'      && 'h-11 px-8 text-base',
    ]"
  >
    <slot />
  </button>
</template>
