<template>
  <div class="flex flex-col p-2 justify-center relative md:flex-row md:text-left">
    <IconButton
      class="flex-none leading-none p-3 top-0 right-0 text-2xl absolute"
      icon="carbon:close"
      @click="$emit('close')"
    />
    <div>
      <Icon class="p-4 text-8xl" :icon="icon" />
    </div>
    <div class="rounded-md bg-gray-200 md:w-2/5 dark:(bg-transparent border-1) ">
      <div class="relative">
        <button
          class="rounded-md bg-[#329672] text-white py-2 px-2 transform transition top-2 right-2 absolute dark:(bg-transparent border-1) hover:scale-105 active:scale-95 "
          @click="copy()"
        >
          <span class="iconify" data-icon="ion:copy" />
        </button>
      </div>
      <p class="p-3" id="code">
        import 'package:iconify_flutter/iconify_flutter.dart';
        <br />
        import 'package:{{ thisCollection?.palette ? "colorful_iconify_flutter" : "iconify_flutter" }}/icons/{{ iconSetNameFile() }}.dart';
        <br />
        <br />
        Iconify({{ iconSetName() }}.{{ iconName() }}) // widget
      </p>
    </div>

    <Notification :value="copied">
      <Icon icon="mdi:check" class="font-xl mr-2 inline-block align-middle" />
      <span class="align-middle">Copied</span>
    </Notification>
  </div>
</template>

<script setup lang='ts'>
import copyText from 'copy-text-to-clipboard'
import { CollectionMeta, getMeta } from '../data'
import { getTransformedId } from '../store'
const reservedWords = ['assert', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default', 'do', 'else', 'enum', 'extends', 'false', 'final', 'finally', 'for', 'if', 'in', 'is', 'new', 'null', 'rethrow', 'return', 'super', 'switch', 'this', 'throw', 'true', 'try', 'var', 'void', 'while', 'with', 'async', 'hide', 'on', 'show', 'sync', 'abstract', 'as', 'covariant', 'deferred', 'dynamic', 'export', 'extension', 'external', 'factory', 'function', 'get', 'implements', 'import', 'interface', 'library', 'mixin', 'operator', 'part', 'set', 'static', 'typedef', 'await', 'yield']

const thisCollection = ref<CollectionMeta | null>(null)


const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  showCollection: {
    type: Boolean,
    required: true,
  }

})

const copied = ref(false)

const transformedId = computed(() => getTransformedId(props.icon))
function iconsetid() {
  return transformedId.value.split(":")[0]
}

function iconSetNameFile() {
  return transformedId.value.split(':')[0].replace(/-/g, '_')
}

function iconSetName() {
  return transformedId.value.split(':')[0].split('-').map(string => string.charAt(0).toUpperCase() + string.slice(1)).join('')
}

function iconName() {
  let newName = transformedId.value.replace(/-/g, '_')
  newName = newName.split(':')[1]
  if (newName === iconSetName() || /^\W|^\d/gm.test(newName) || reservedWords.includes(newName))
    newName = `i_${newName}`
  return newName
}

const copy = async () => {
  const text = document.getElementById('code')?.innerText
  if (!text) return

  copied.value = copyText(text)
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

watch(transformedId, async () => {
  thisCollection.value = (await getMeta(iconsetid()))
  console.log(thisCollection.value?.palette)

})



</script>
