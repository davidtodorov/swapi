<template>
    <div class="sortContainer">
      <v-select
        label="SORT BY"
        :items="items"
        item-title="displayName"
        item-value="key"
        variant="solo"
        v-model="sorted"
      ></v-select>
    </div>  
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { usePeopleStore } from '../../stores/peopleStore';
import { sortData } from '../../utils';
let defaultSort = { displayName: 'Default', key: 'url'}
let sorted = ref(defaultSort);
const peopleStore = usePeopleStore();
const emit = defineEmits(['sortUpdate'])

let items = computed(() => {
    return [defaultSort, ...props.data]
})

const props = defineProps({
    data: { type: Array, required: true }
})

watch(sorted, (newSort) => {
  let type = newSort !== 'url' ? items.value.find(x => x.key === newSort).type : 'text';
  peopleStore.fetchedPeople = sortData(peopleStore.fetchedPeople, newSort, type);
  emit('sortUpdate');
})
</script>

<style>
    
</style>