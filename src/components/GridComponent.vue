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
        v-for="item in peopleStore?.currentPeople"
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
import { getStringValue, formatDate } from '../utils'
import { usePlanetStore } from '../stores/planetsStore'
import { usePeopleStore } from '../stores/peopleStore';

const planetStore = usePlanetStore();
const peopleStore = usePeopleStore();
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

const itemsPerPage = 10;

onMounted( async () => {
    await planetStore.getAllPlanets();
    let result = await peopleStore.getPeoplePerPage();
    getPaginationLength(result);
});

watch(currentPage, async (newPage)=> {
  //if data for the page was exists load it
  if(peopleStore.pageAndPeople[newPage]) {
    peopleStore.setPageAndPeople(newPage, peopleStore.pageAndPeople[newPage])
  } else { //else get new data from server
      await peopleStore.getPeoplePerPage(newPage);
  }
});

function getPaginationLength(result) {
  paginationLength.value = Math.ceil(result.data.count / itemsPerPage);
}


</script>

<style lang="">

</style>
