import { ref } from 'vue'
import { defineStore } from 'pinia';
import axios from '../axios'

export const usePeopleStore = defineStore('people', () => {
  let currentPeople = ref([]);
  let pageAndPeople = ref({});
  let totalPeopleLength = ref(0)

  async function getPeoplePerPage(page = 1) {
    let result;
    let url = '/people/?page=' + page;
    if (!pageAndPeople.value[url]) {
      result = await axios.get(url);
      pageAndPeople.value[url] = result.data.results;
      totalPeopleLength.value = result.data.count;
    }
    setCurrentPeople(pageAndPeople.value[url]);
  }

  function setCurrentPeople(peopleData) {
    currentPeople.value = peopleData
  }

  return { currentPeople, pageAndPeople, totalPeopleLength, getPeoplePerPage, setCurrentPeople }
})
