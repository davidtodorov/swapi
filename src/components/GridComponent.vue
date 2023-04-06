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
        v-for="item in currentPeople"
        :key="item.name"
      >
        <td>{{ item.name }}</td>
        <td>{{ getStringValue(item.height) }}</td>
        <td>{{ getStringValue(item?.mass) }}</td>
        <td>{{ formatDate(item.created) }}</td>
        <td>{{ formatDate(item.edited) }}</td>
        <td>{{ getStringValue(planetStore.planetsObj[item.homeworld]?.name) }}</td>
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
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { getStringValue, formatDate } from '../utils'
import { usePlanetStore } from '../stores/planetsStore'
import { usePeopleStore } from '../stores/peopleStore';
import LoadingComponent from './LoadingComponent.vue'

const planetStore = usePlanetStore();
const peopleStore = usePeopleStore();

const { currentPeople, pageAndPeople } = storeToRefs(peopleStore);
const { getPeoplePerPage, setPageAndPeople } = peopleStore;

let headers = [
  {
    displayName: 'Name'
  },
  {
    displayName: 'Height'
  },
  {
    displayName: 'Mass'
  },
  {
    displayName: 'Created'
  },
  {
    displayName: 'Edited'
  },
  {
    displayName: 'Planet Name'
  }
];
const itemsPerPage = 10;

let isLoading = ref(false);
let paginationLength = ref(0);
let currentPage = ref(1);


onMounted( async () => {
  isLoading.value = true;
  //await planetStore.getAllPlanets();
  let result = await getPeoplePerPage();
  getPaginationLength(result);
  isLoading.value = false;
});

watch(currentPage, async (newPage)=> {
  //if data for the page was exists load it
  if(pageAndPeople[newPage]) {
    setPageAndPeople(newPage, pageAndPeople[newPage])
  } else { //else get new data from server
      isLoading.value = true;
      await getPeoplePerPage(newPage);
      isLoading.value = false;
  }
});

function getPaginationLength(result) {
  paginationLength.value = Math.ceil(result.data.count / itemsPerPage);
}

</script>

<style lang="css">

</style>
