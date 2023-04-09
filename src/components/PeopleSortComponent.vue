<template>
    <div class="sortContainer">
      <v-select
        label="SORT BY"
        :items="[defaultSort, ...headers]"
        item-title="displayName"
        item-value="key"
        variant="solo"
        v-model="sorted"
      ></v-select>
    </div>  
</template>

<script setup>
import { ref, watch } from 'vue';
import { usePeopleStore } from '../stores/peopleStore';
import { sortData } from '../utils';
let data = ref([]);
let defaultSort = { displayName: 'Default', key: 'url'}
let sorted = ref(defaultSort);
const peopleStore = usePeopleStore();
const emit = defineEmits(['sortUpdate'])

const headers = [
  {
    displayName: 'Name',
    key: 'name',
    type: 'text'
  },
  {
    displayName: 'Height',
    key: 'height',
    type: 'number'
  },
  {
    displayName: 'Mass',
    key: 'mass',
    type: 'number'
  },
  {
    displayName: 'Created',
    key: 'created',
    formatDate: true,
    type: 'date'
  },
  {
    displayName: 'Edited',
    key: 'edited',
    formatDate: true,
    
  },
  {
    displayName: 'Planet Name',
    key: 'homeworldName',
    type: 'text',
  }
]

defineProps({
    data: { type: Array, required: true }
})

watch(data, (val) => {
    console.log(val)
})

watch(sorted, (newSort) => {
  let type = newSort !== 'url' ? headers.find(x => x.key === newSort).type : 'text';
  peopleStore.fetchedPeople = sortData(peopleStore.fetchedPeople, newSort, type);
  emit('sortUpdate');
})
</script>

<style>
    
</style>