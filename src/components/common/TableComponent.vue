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
        <td v-for="column in headers" :key="column.name" @click="column?.onClick(item)">
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
          <v-pagination v-model="page" :length="paginationLength"></v-pagination>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import LoadingComponent from './LoadingComponent.vue';
import { getStringValue, formatDate } from '../../utils'
import { computed } from 'vue';
import { usePeopleStore } from '../../stores/peopleStore';

let peopleStore = usePeopleStore();

let props = defineProps({
    headers: { type: Array, required: true },
    data: { type: Array, required: true },
    isLoading: { type: Boolean, default: false },
    currentPage: { type: Number, default: 1},
});

const emit = defineEmits(['update:currentPage'])

const itemsPerPage = 10;

let page = computed({
  get: () => props.currentPage,
  set: (val) => emit('update:currentPage', val)
})

let paginationLength = computed(() => {
  return Math.ceil(peopleStore.totalPeopleLength / itemsPerPage);
});

</script>

<style lang="">
</style>