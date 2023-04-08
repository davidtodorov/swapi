<template>
  <v-text-field bg-color="rgba(255, 255, 255, 0.7)" variant="outlined" v-model="searchText"></v-text-field>
  <v-data-table
    :custom-filter="searchByName"
    :items-per-page="10"
    :headers="headers"
    :items="isSearchMode ? searchStore.currentPeople : peopleStore.currentPeople"
    :search="searchText"
    :loading="true"
    class="elevation-1"
  >
    <template v-slot:item.height="{ item }">
      <span>{{ getStringValue(item.value.height) }}</span>
    </template>
    <template v-slot:item.mass="{ item }">
      <span>{{ getStringValue(item.value.mass) }}</span>
    </template>
    <template v-slot:item.created="{ item }">
      <span>{{ formatDate(item.value.created) }}</span>
    </template>
    <template v-slot:item.edited="{ item }">
      <span>{{ formatDate(item.value.edited) }}</span>
    </template>
    <template v-slot:item.homeworld="{ item }">
      <button class="planet" v-on:click="test(item.value)">
        <span>{{ extractPlanetName(item.value.homeworld) }}</span>
      </button>
    </template>
  </v-data-table>
  <PlanetDialog v-model="openPlanetDialog" :planet="selectedPlanet"></PlanetDialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePlanetStore } from '../stores/planetsStore'
import { usePeopleStore } from '../stores/peopleStore';
import { useSearchStore } from '../stores/searchStore'
import { formatDate, getStringValue } from '../utils';
import PlanetDialog from './PlanetDialog.vue'

const planetStore = usePlanetStore();
const peopleStore = usePeopleStore();
const searchStore = useSearchStore();
const headers = [
  {
    title: 'Name',
    key: 'name'
  },
  {
    title: 'Height',
    key: 'height',
    formatter: getStringValue
  },
  {
    title: 'Mass',
    key: 'mass',
    formatter: getStringValue
  },
  {
    title: 'Created',
    key: 'created',
    formatter: formatDate
  },
  {
    title: 'Edited',
    key: 'edited',
    formatter: formatDate
  },
  {
    title: 'Planet Name',
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
let isSearchMode = false;

onMounted( async () => {
  isLoading.value = true;
  await peopleStore.getAllPeople();
  await planetStore.getAllPlanets();
  isLoading.value = false;
});

function searchByName(value, query, item) {
  return value != null &&
          query != null &&
          typeof value === 'string' &&
          item.columns.name.toLocaleLowerCase().indexOf(query) !== -1
  
}

function extractPlanetName(value) {
  return getStringValue(planetStore.planetsObj[value]?.name);
}

function test(item) {
  selectedPlanet.value = planetStore.planetsObj[item.homeworld];
  openPlanetDialog.value = true;
}

</script>
<style>
.planet {
  height: 100%;
  width: 100%;
}
</style>
