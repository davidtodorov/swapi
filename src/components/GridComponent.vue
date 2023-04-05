<template>
  <v-table>
    <thead>
      <tr>
        <th v-for="item in headers"
        :key="item.displayName">{{ item.displayName }}</th>
      </tr>
    </thead>
    <tbody>
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
      <tr>
        <td colspan="6">
          <v-pagination v-model="currentPage" :length="paginationLength"></v-pagination>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from '@/axios';
import { getStringValue, formatDate } from '../utils'
import { usePlanetStore } from '../stores/planetsStore'

const planetStore = usePlanetStore();
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

let paginationLength = ref(0);
let currentPage = ref(1);
let currentPeople = ref([]);
let pageAndPeople = ref({});
const itemsPerPage = 10;

watch(currentPage, async (newPage)=> {
  //if data for the page was exists, load it
  if(pageAndPeople.value[newPage]) {
    setPageAndPeople(pageAndPeople.value[newPage], newPage)
  } else { //else get new data from server
    let result = await getUsers(newPage);
    setPageAndPeople(result.data.results, newPage);
  }
});

onMounted( async () => {
    await planetStore.getAllPlanets();
    let people = await getUsers();
    getPaginationLength(people);
    setPageAndPeople(people.data.results, 1);
});

function getPaginationLength(result) {
  paginationLength.value = Math.ceil(result.data.count / itemsPerPage);
}

function setPageAndPeople(peopleData, page) {
  currentPeople.value =  peopleData; //result.data. results;
  pageAndPeople.value[page] = currentPeople.value;
}

async function getUsers(page) {
  let url = '/people';
  if (page) {
    url +=`/?page=${page}`
  }
  let result = await axios.get(url);
  return result;
}

</script>

<style lang="">

</style>
