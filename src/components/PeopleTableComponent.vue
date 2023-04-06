<template>
  <TableComponent ref="tableComponent"
    :headers="headers" 
    :data="currentPeople"
    :is-loading="isLoading"
    @page-changed="changePage">
  </TableComponent>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlanetStore } from '../stores/planetsStore'
import { usePeopleStore } from '../stores/peopleStore';
import TableComponent from './common/TableComponent.vue';

const planetStore = usePlanetStore();
const peopleStore = usePeopleStore();
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
    formatter: extractPlanetName
  }
];

let isLoading = ref(false);

onMounted( async () => {
  isLoading.value = true;
  await planetStore.getAllPlanets();
  let result = await getPeoplePerPage();
  setTotalPeopleLength(result.data.count);
  isLoading.value = false;
});

function extractPlanetName(value) {
  return planetStore.planetsObj[value].name;
}

async function changePage(newPage) {
  //if data for the page was exists load it
  if(pageAndPeople.value[newPage]) {
    setPageAndPeople(newPage, pageAndPeople.value[newPage])
  } else { //else get new data from server
      isLoading.value = true;
      await getPeoplePerPage(newPage);
      isLoading.value = false;
  }
}
</script>

<style>
</style>
