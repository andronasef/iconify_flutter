<template>
  <footer class="text-center text-sm pt-8 pb-6">
    <p class="text-gray-500">
      built by
      <a
        class="opacity-75 hover:opacity-100"
        href="https://github.com/antfu"
        target="_blank"
      >@antfu</a>, powered by
      <a
        class="opacity-75 hover:opacity-100"
        href="https://iconify.design"
        target="_blank"
      >Iconify</a>
      modified by
      <a
        class="opacity-75 hover:opacity-100"
        href="https://github.com/andronasef"
        target="_blank"
      >@andronasef</a>
    </p>
    <a
      class="font-light text-gray-500 hover:opacity-100"
      href="https://github.com/andronasef/iconify_flutter"
      target="_blank"
    >
      <Icon icon="carbon:code" class="text-lg inline-block align-middle" />Source Code
    </a>
    <div
      class="font-light mt-1 opacity-75 text-gray-500 italic hover:opacity-100"
    >Last update: {{ buildTime }}</div>
  </footer>
</template>

<script setup lang="ts">

// eslint-disable-next-line no-undef
const buildTime = __BUILD_TIME__
</script>
