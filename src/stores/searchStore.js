import { ref } from 'vue'
import { defineStore } from 'pinia'
import { usePeopleStore } from './peopleStore';
import { getDataPerPage } from '../utils';

export const useSearchStore = defineStore('search', () => {
  let totalPeopleLength = ref(0);
  let currentPeople = ref([]);
  let result = ref([]);
  let peopleStore = usePeopleStore()
  let isSearchMode = ref();
  let searchText = ref("");

  async function searchPeople() {
    result.value = peopleStore.fetchedPeople
        .filter(person => person.name.toLocaleLowerCase().indexOf(searchText.value.toLocaleLowerCase()) !== -1);
    totalPeopleLength.value = result.value.length;
  }

  async function searchPeoplePerPage(page) {
    currentPeople.value =  getDataPerPage(result.value, page);
  }

  return { searchText, isSearchMode, currentPeople, totalPeopleLength, searchPeople, searchPeoplePerPage }
});
