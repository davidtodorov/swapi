<template>
  <v-text-field bg-color="rgba(255, 255, 255, 0.7)" variant="outlined" v-model="searchText"></v-text-field>
  <TableComponent ref="tableComponent"
    :headers="headers" 
    :data="currentPeople"
    :is-loading="isLoading"
    :total-people-length="totalPeopleLength"
    v-model:currentPage="currentPage">
  </TableComponent>
  <PlanetDialog v-model="openPlanetDialog" :planet="selectedPlanet"></PlanetDialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlanetStore } from '../stores/planetsStore'
import { usePeopleStore } from '../stores/peopleStore';
import { useSearchStore } from '../stores/searchStore'
import TableComponent from './common/TableComponent.vue';
import PlanetDialog from './PlanetDialog.vue';

const planetStore = usePlanetStore();
const peopleStore = usePeopleStore();
const searchStore = useSearchStore();
const { currentPeople } = storeToRefs(peopleStore);
const { getPeoplePerPage } = peopleStore;
const headers = [
  {
    displayName: 'Name',
    key: 'name'
  },
  {
    displayName: 'Height',
    key: 'height'
  },
  {
    displayName: 'Mass',
    key: 'mass'
  },
  {
    displayName: 'Created',
    key: 'created',
    formatDate: true
  },
  {
    displayName: 'Edited',
    key: 'edited',
    formatDate: true
  },
  {
    displayName: 'Planet Name',
    key: 'homeworld',
    formatter: extractPlanetName,
    onClick: (item) => {
      selectedPlanet.value = planetStore.planetsObj[item.homeworld];
      openPlanetDialog.value = true;
    }
  }
];

let isLoading = ref(false);
let selectedPlanet = ref({});
let openPlanetDialog = ref(false);
let searchText = ref("");
let totalPeopleLength = ref(0);
let isSearchMode = false;
let currentPage = ref(1);

onMounted( async () => {
  isLoading.value = true;
  //await planetStore.getAllPlanets();
  await getPeoplePerPage(1);
  totalPeopleLength.value = peopleStore.totalPeopleLength;
  isLoading.value = false;
});

watch(currentPage, (newPage) => {
    loadContent(newPage);
})

watch(searchText, (val) => {
  currentPage.value = 1;
  if (val) {
    isSearchMode = true;
    searchStore.searchPeople(val);
    totalPeopleLength.value = searchStore.totalPeopleLength;
  } else {
    isSearchMode = false;
  }
  loadContent(currentPage.value);
})

function extractPlanetName(value) {
  return planetStore.planetsObj[value]?.name;
}

async function loadContent(page){
  if(!isSearchMode) {
      isLoading.value = true
      await peopleStore.getPeoplePerPage(page);
      totalPeopleLength.value = peopleStore.totalPeopleLength;
      isLoading.value = false;
    } else {
        isLoading.value = true
        await searchStore.searchPeoplePerPage(page);
        totalPeopleLength.value = searchStore.totalPeopleLength;
        isLoading.value = false;
    }
}
</script>

<style>
</style>
