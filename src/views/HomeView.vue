<template>
  <main>
    <div class="search-sort-container">
      <PeopleSearchComponent class="search" @searchUpdate="onSearchUpdate()"></PeopleSearchComponent>
      <PeopleSortComponent class="sort" :data="sortData" @sortUpdate="onSortUpdate()"></PeopleSortComponent>
    </div>
    <PeopleTableComponent
      ref="peopleTableComponent"
      v-model:currentPage="currentPage"
    ></PeopleTableComponent>
  </main>
</template>

<script setup>
import PeopleTableComponent from '../components/PeopleTableComponent.vue';
import PeopleSearchComponent from '../components/PeopleSearchComponent.vue';
import { onMounted, ref, watch } from 'vue';
import { useSearchStore } from '../stores/searchStore';
import { usePeopleStore } from '../stores/peopleStore';
import PeopleSortComponent from '../components/PeopleSortComponent.vue';

const searchStore = useSearchStore();
const peopleStore = usePeopleStore();
let peopleTableComponent = ref(null);
let currentPage = ref();
let sortData = ref([]);

onMounted(() => {
  sortData.value = peopleTableComponent.value.headers;
})

watch(currentPage, (newPage) => {
  loadContent(newPage);
})

function onSearchUpdate() {
  currentPage.value = 1;
  loadContent(currentPage.value)
}

function onSortUpdate() {
  currentPage.value = 1;
  if(searchStore.isSearchMode) {
    searchStore.searchPeople();
  }
  loadContent(currentPage.value);
}
function loadContent(page){
  searchStore.isSearchMode ? searchStore.searchPeoplePerPage(page) : peopleStore.getPeoplePerPage(page);
}
</script>

<style>
  .search-sort-container {
    display: flex; justify-content: space-between; align-items: center;
  }
  .sort {
    width: 300px
  }

  .search {
    flex: 1;
    color: black
  }
</style>