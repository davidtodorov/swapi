<template>
    <v-table>
    <thead>
      <tr>
        <th v-for="item in headers"
        :key="item.displayName">{{ item.displayName }}</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="isLoading">
        <tr>
          <td :colspan="headers.length">
            <LoadingComponent></LoadingComponent>
          </td>
        </tr>
      </template>
      <template v-else>
        <tr
        v-for="item in data"
        :key="item.name"
      >
        <td v-for="column in headers" :key="column.name">
          <template v-if="column?.formatDate">
            {{ formatDate(item[column.key]) }}
          </template>
          <template v-else-if="column?.formatter">
            {{ getStringValue(column.formatter(item[column.key])) }}
          </template>
          <template v-else>
            {{ getStringValue(item[column.key]) }}
          </template>
        </td>
      </tr>
      </template>
      <tr>
        <td :colspan="headers.length">
          <v-pagination v-model="currentPage" :length="paginationLength"></v-pagination>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import LoadingComponent from './LoadingComponent.vue';
import { getStringValue, formatDate } from '../../utils'
import { ref, watch, computed } from 'vue';
import { usePeopleStore } from '../../stores/peopleStore';

let peopleStore = usePeopleStore();
let currentPage = ref(1);

defineProps({
    headers: { type: Array, required: true },
    data: { type: Array, required: true },
    isLoading: { type: Boolean, default: false }
})

const itemsPerPage = 10;
const emit = defineEmits(['pageChanged'])

watch(currentPage, (newPage) => {
  emit('pageChanged', newPage);
})

let paginationLength = computed(() => {
  return Math.ceil(peopleStore.totalPeopleLength / itemsPerPage);
})
</script>

<style lang="">
</style>