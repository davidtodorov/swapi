import { ref } from 'vue'
import { defineStore } from 'pinia'
import { usePeopleStore } from './peopleStore';

export const useSearchStore = defineStore('search', () => {
  let searchedValues = ref({});
  let totalPeopleLength = ref(0);
  let currentPeople = ref([]);
  let result = ref([]);
  let peopleStore = usePeopleStore()

  async function searchPeople(value) {
    if(peopleStore.fetchedPeople.length !== peopleStore.totalPeopleLength) {
      await peopleStore.getAllPeople();
    }

    result.value = peopleStore.fetchedPeople
        .filter(person => person.name.toLowerCase().indexOf(value) !== -1);
    totalPeopleLength.value = result.value.length;
  }

  async function searchPeoplePerPage(page) {
    currentPeople.value = result.value.slice((page-1)*10, page*10);
  }

  return { currentPeople, totalPeopleLength, searchedValues, searchPeople, searchPeoplePerPage }
});
