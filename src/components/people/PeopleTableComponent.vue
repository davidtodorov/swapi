<template>
  <TableComponent ref="tableComponent"
    :headers="headers" 
    :data="data"
    :is-loading="isLoading"
    :total-people-length="totalPeopleLength"
    v-model:currentPage="page">
  </TableComponent>
  <PlanetDialog v-model="openPlanetDialog" :planet="selectedPlanet"></PlanetDialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePlanetStore } from '../../stores/planetsStore'
import { usePeopleStore } from '../../stores/peopleStore';
import { useSearchStore } from '../../stores/searchStore'
import TableComponent from '../common/TableComponent.vue';
import PlanetDialog from '../planets/PlanetDialog.vue';

const planetStore = usePlanetStore();
const peopleStore = usePeopleStore();
const searchStore = useSearchStore();
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
    onClick: (item) => {
      selectedPlanet.value = planetStore.planetsObj[item.homeworld];
      openPlanetDialog.value = true;
    }
  }
];

let isLoading = ref(false);
let selectedPlanet = ref({});
let openPlanetDialog = ref(false);
let currentPage = ref(1);
let page = computed({
  get: () => props.currentPage,
  set: (val) => emit('update:currentPage', val)
})

const props = defineProps({
    currentPage: { type: Number },
});
const emit = defineEmits(['update:currentPage'])
defineExpose({headers});

onMounted( async () => {
  isLoading.value = true;
  await planetStore.getAllPlanets();
  await peopleStore.getAllPeople();
  await peopleStore.getPeoplePerPage(currentPage.value)
  isLoading.value = false;
});

const data = computed(() => {
  return searchStore.isSearchMode ? searchStore.currentPeople : peopleStore.currentPeople;
});

const totalPeopleLength = computed(() => {
  return searchStore.isSearchMode ? searchStore.totalPeopleLength : peopleStore.totalPeopleLength
})
</script>

<style>
</style>
