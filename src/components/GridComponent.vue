<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">
          Name
        </th>
        <th class="text-left">
          Height
        </th>
        <th class="text-left">
          Mass
        </th>
        <th class="text-left">
          Created
        </th>
        <th class="text-left">
          Edited
        </th>
        <th class="text-left">
          Planet Name
        </th>
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
        <td>{{ planetsObj[item.homeworld]?.name }}</td>
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

let paginationLength = ref(0);
let currentPage = ref(1);
let currentPeople = ref([]);
let pageAndPeople = ref({});
let planetsObj = ref({});
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

watch(currentPeople, async (newCurrentPeople) => {
  getPlanetsForPeople(newCurrentPeople);
})


onMounted( async () => {
    let result = await getUsers();
    getPaginationLength(result);
    setPageAndPeople(result.data.results, 1);
});

function getPaginationLength(result) {
  paginationLength.value = Math.ceil(result.data.count / itemsPerPage);
}

function setPageAndPeople(peopleData, page) {
  currentPeople.value =  peopleData; //result.data. results;
  pageAndPeople.value[page] = currentPeople.value;
}

function formatDate(dateString) {
  const date = new Date(dateString);  // Create a new Date object from the string

  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function getStringValue(value) {
  return value !== 'unknown' ? value : ' - '
}

async function getUsers(page) {
  let url = '/people';
  if (page) {
    url +=`/?page=${page}`
  }
  let result = await axios.get(url);
  return result;
}

function getPlanetsForPeople(peopleData) {
  let planetsSet = new Set();
  peopleData.forEach(person => {
    planetsSet.add(person.homeworld);
  });

  planetsSet.forEach(async (planet) => {
    if (!planetsObj.value[planet]) {
      let planetResult = await axios.get(planet);
      planetsObj.value[planet] = planetResult.data;
    }
  });
}

</script>

<style lang="">

</style>
