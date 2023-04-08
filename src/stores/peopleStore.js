import { ref } from 'vue'
import { defineStore } from 'pinia';
import axios from '../axios'
import { getDataPerPage } from '../utils';

export const usePeopleStore = defineStore('people', () => {
  let currentPeople = ref([]);
  let fetchedPeople = ref([]);
  let totalPeopleLength = ref(0)

  async function getPeoplePerPage(page = 1) {
    const data = getDataPerPage(fetchedPeople.value, page)
    setCurrentPeople(data);
  }

  async function getAllPeople(urlParam) {
    let url = urlParam || 'https://swapi.dev/api/people/?page=1';
    let result = await axios.get(url);

    totalPeopleLength.value = result.data.count;
    fetchedPeople.value.push(...result.data.results);

    if (result.data.next) {
      let nextUrl = result.data.next;
      await getAllPeople(nextUrl)
    }
    getPeoplePerPage(1);
    return fetchedPeople.value;
  }

  function setCurrentPeople(peopleData) {
    currentPeople.value = peopleData
  }

  return { currentPeople, fetchedPeople, totalPeopleLength, getPeoplePerPage, setCurrentPeople, getAllPeople }
})
