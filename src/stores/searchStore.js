import { ref } from 'vue'
import { defineStore } from 'pinia'
import { usePeopleStore } from './peopleStore';
import { getDataPerPage } from '../utils';

export const useSearchStore = defineStore('search', () => {
  let searchedValues = ref({});
  let totalPeopleLength = ref(0);
  let currentPeople = ref([]);
  let result = ref([]);
  let peopleStore = usePeopleStore()

  async function searchPeople(value) {
    result.value = peopleStore.fetchedPeople
        .filter(person => person.name.toLowerCase().indexOf(value) !== -1);
    totalPeopleLength.value = result.value.length;
  }

  async function searchPeoplePerPage(page) {
    currentPeople.value =  getDataPerPage(result.value, page);
  }

  return { currentPeople, totalPeopleLength, searchedValues, searchPeople, searchPeoplePerPage }
});
