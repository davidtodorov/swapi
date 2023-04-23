import { ref } from 'vue'
import { defineStore } from 'pinia';
import axios from '../axios'
import { getDataPerPage } from '../utils';
import { usePlanetStore } from './planetsStore';

export const usePeopleStore = defineStore('people', () => {
  let planetStore = usePlanetStore();
  let currentPeople = ref([]);
  let fetchedPeople = ref([]);
  let totalPeopleLength = ref(0)

  function getPeoplePerPage(page = 1) {
    const data = getDataPerPage(fetchedPeople.value, page)
    setCurrentPeople(data);
  }

  async function getAllPeople(urlParam) {
    let url = urlParam || 'https://swapi.dev/api/people/?page=1';
    let result = await axios.get(url);
    totalPeopleLength.value = result.data.count;
    let people = result.data.results.map(person => {
      return {
        ...person,
        homeworldName: planetStore.planetsObj[person.homeworld].name
      }
    })
    fetchedPeople.value.push(...people);

    if (result.data.next) {
      let nextUrl = result.data.next;
      await getAllPeople(nextUrl)
    }
    return fetchedPeople.value;
  }

  function setCurrentPeople(peopleData) {
    currentPeople.value = peopleData
  }

  return {currentPeople, fetchedPeople, totalPeopleLength, getPeoplePerPage, setCurrentPeople, getAllPeople }
})
