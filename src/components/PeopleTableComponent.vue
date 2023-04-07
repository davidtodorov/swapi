<template>
  <v-text-field bg-color="rgba(255, 255, 255, 0.7)" variant="outlined" v-model="searchText"></v-text-field>
  <TableComponent ref="tableComponent"
    :headers="headers" 
    :data="currentPeople"
    :is-loading="isLoading"
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
const { currentPeople, pageAndPeople } = storeToRefs(peopleStore);
const { getPeoplePerPage, setPageAndPeople, setTotalPeopleLength } = peopleStore;
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
  let result = await getPeoplePerPage(1);
  totalPeopleLength.value = result.data.count;
  setTotalPeopleLength(totalPeopleLength.value);
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
  } else {
    isSearchMode = false;
    setTotalPeopleLength(totalPeopleLength.value);
    loadContent(currentPage.value);
  }
})

function extractPlanetName(value) {
  return planetStore.planetsObj[value]?.name;
}

async function loadContent(page){
  if(!isSearchMode) {
      //if data for the page was exists load it
      if(pageAndPeople.value[page]) {
        setPageAndPeople(page, pageAndPeople.value[page])
      } else { //else get new data from server
        isLoading.value = true;
        await getPeoplePerPage(page);
        isLoading.value = false;
      }
    } else {
      isLoading.value = true
      await searchStore.searchPeoplePerPage(page);
      isLoading.value = false;
    }
}


</script>

<style>
</style>
