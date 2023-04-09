<template>
    <div style="flex: 1">
      <v-text-field bg-color="rgba(255, 255, 255, 0.7)" variant="outlined" v-model="searchText"></v-text-field>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useSearchStore } from '../../stores/searchStore';
const searchStore = useSearchStore();
let searchText = ref("");
const emit = defineEmits(['searchUpdate'])

watch(searchText, async (val) => {
  searchStore.searchText = val;
  if (val) {
    searchStore.isSearchMode = true;
    searchStore.searchPeople();
  } else {
    searchStore.isSearchMode = false;
  };
  emit('searchUpdate')
});

</script>
<style>
    
</style>