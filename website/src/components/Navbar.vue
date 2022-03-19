<template>
  <nav
    class="bg-white border-b flex flex-none border-gray-200 p-2 z-10 dragging relative dark:bg-dark-100 dark:border-dark-200"
    :class="$route.path !== '/' ? 'md:hidden' : ''"
  >
    <!-- In Collections -->
    <template v-if="$route.path !== '/'">
      <IconButton
        class="flex-none my-auto mx-3 text-xl non-dragging"
        icon="carbon:arrow-left"
        @click="$router.replace('/')"
      />
    </template>

    <!-- Homepage Only -->
    <template v-else>
      <div class="flex-none my-auto mx-3 mr-4">
        <select
          v-model="categoryFilter"
          class="bg-white font-normal outline-none text-current w-auto opacity-50 dark:bg-dark-100 focus:outline-none"
        >
          <option :value="undefined">All</option>
          <option
            v-for="category of categories"
            :key="category"
            :value="category"
          >{{ category.split('/')[0].trim() }}</option>
        </select>
      </div>
      <h1
        class="flex-auto font-light m-auto text-xl text-center py-1"
        style="letter-spacing: 2px"
      >Iconify</h1>
      <router-link class="flex-none my-auto mx-3 text-xl non-dragging" to="/collection/all">
        <IconButton icon="carbon:search" style="padding-bottom: 3px" />
      </router-link>
      <a
        class="flex-none my-auto mx-3 text-xl non-dragging"
        href="https://github.com/andronasef/iconify_flutter"
        target="_blank"
      >
        <IconButton icon="codicon:github" style="padding-bottom: 3px" />
      </a>
      <div class="flex-none my-auto mx-3 text-xl non-dragging">
        <DarkSwitcher />
      </div>
    </template>

    <!-- Searching -->
    <div v-if="collection" class="flex">
      <input
        v-model="search"
        class="bg-transparent flex-auto outline-none m-0 text-base w-full py-2 px-4"
        placeholder="Search..."
      />
    </div>
  </nav>
</template>

<script lang="ts">
import { getSearchResults, isDark } from '../store'
import { categories, categoryFilter } from '../data'

export default defineComponent(() => ({
  ...getSearchResults(),
  isDark,
  categories,
  categoryFilter,
}))
</script>
