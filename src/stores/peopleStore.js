import { ref } from 'vue'
import { defineStore } from 'pinia';
import axios from '../axios'

export const usePeopleStore = defineStore('people', () => {
  let currentPeople = ref([]);
  let pageAndPeople = ref({});
  let totalPeopleLength = ref(0)

  async function getPeoplePerPage(page = 1) {
    let url = '/people/?page=' + page;
    let result = await axios.get(url);
    setPageAndPeople(page, result.data.results);
    return result;
  }

  function setPageAndPeople(page, peopleData) {
    setCurrentPeople(peopleData)
    pageAndPeople.value[page] = currentPeople.value;
  }

  function setCurrentPeople(peopleData) {
    currentPeople.value = peopleData
  }

  function setTotalPeopleLength(length) {
    totalPeopleLength.value = length;
  }

  return { currentPeople, pageAndPeople, totalPeopleLength, getPeoplePerPage, setPageAndPeople, setTotalPeopleLength, setCurrentPeople }
})
