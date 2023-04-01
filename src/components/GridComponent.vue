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
          v-for="item in people"
          :key="item.name"
        >
          <td>{{ item.name }}</td>
          <td>{{ item.height }}</td>
          <td>{{ item.mass }}</td>
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
import { ref, onMounted } from 'vue'
import axios from '@/axios';
let people = ref([]);
let planetsObj = ref({});
let currentPage = ref(1);
let paginationLength = ref(0);
const itemsPerPage = 10;

let pageAndPeople = ref({})

onMounted(async () => {
    let result = await axios.get('/people');
    getPaginationLength(result);
    setPageAndPeople(result, 1);

    let planetSet = new Set();
    people.value.forEach(person => {
      planetSet.add(person.homeworld);
    });

    planetSet.forEach(async (planet) => {
      let planetResult = await axios.get(planet);
      if (!planetsObj.value[planet]) {
        planetsObj.value[planet] = planetResult.data;
      }
    });
});

function getPaginationLength(result) {
  paginationLength.value = Math.ceil(result.data.count / itemsPerPage);
}

function setPageAndPeople(result, page) {
  people.value = result.data.results;
  pageAndPeople.value[page] = people.value;
}

function formatDate(dateString) {
  const date = new Date(dateString);  // Create a new Date object from the string

  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

</script>

<style lang="">

</style>
