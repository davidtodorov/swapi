<template>
    <div style="display: flex; justify-content: space-between; align-items: center;">
    <div style="flex: 1">
      <v-text-field bg-color="rgba(255, 255, 255, 0.7)" variant="outlined" v-model="searchText"></v-text-field>
    </div>
    <div style="width: 300px">
      <v-select
        label="SORT BY"
        :items="[defaultSort, ...headers]"
        item-title="displayName"
        item-value="key"
        variant="solo"
        v-model="sorted"
      ></v-select>
    </div>  
  </div>
  <TableComponent ref="tableComponent"
    :headers="headers" 
    :data="isSearchMode ? searchStore.currentPeople : peopleStore.currentPeople"
    :is-loading="isLoading"
    :total-people-length="isSearchMode ? searchStore.totalPeopleLength : peopleStore.totalPeopleLength"
    v-model:currentPage="currentPage">
  </TableComponent>
  <PlanetDialog v-model="openPlanetDialog" :planet="selectedPlanet"></PlanetDialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { usePlanetStore } from '../stores/planetsStore'
import { usePeopleStore } from '../stores/peopleStore';
import { useSearchStore } from '../stores/searchStore'
import TableComponent from './common/TableComponent.vue';
import PlanetDialog from './PlanetDialog.vue';
import { sortData } from '../utils';

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

let defaultSort = { displayName: 'Default', key: 'url'}
let sorted = ref(defaultSort);
let isLoading = ref(false);
let selectedPlanet = ref({});
let openPlanetDialog = ref(false);
let searchText = ref("");
let totalPeopleLength = ref(0);
let isSearchMode = false;
let currentPage = ref(1);

onMounted( async () => {
  isLoading.value = true;
  await planetStore.getAllPlanets();
  await peopleStore.getAllPeople();
  await peopleStore.getPeoplePerPage(currentPage.value)
  totalPeopleLength.value = peopleStore.totalPeopleLength;
  isLoading.value = false;
});

watch(currentPage, (newPage) => {
    loadContent(newPage);
})

watch(searchText, async (val) => {
  currentPage.value = 1;
  if (val) {
    isSearchMode = true;
      isLoading.value = true;
      searchStore.searchPeople(val);
      isLoading.value = false;
  } else {
    isSearchMode = false;
  }
  loadContent(currentPage.value);
})

watch(sorted, (newSort) => {
  let type = newSort !== 'url' ? headers.find(x => x.key === newSort).type : 'text';
  peopleStore.fetchedPeople = sortData(peopleStore.fetchedPeople, newSort, type)
  currentPage.value = 1;
  if(isSearchMode) {
    searchStore.searchPeople(searchText.value);
  }
  loadContent(currentPage.value);
})

async function loadContent(page){
  if(!isSearchMode) {
      isLoading.value = true
      await peopleStore.getPeoplePerPage(page);
      isLoading.value = false;
    } else {
        isLoading.value = true
        await searchStore.searchPeoplePerPage(page);
        isLoading.value = false;
    }
}
</script>

<style>
</style>
