import { ref } from 'vue'
import { defineStore } from 'pinia';
import axios from '../axios'

export const usePeopleStore = defineStore('people', () => {
  let currentPeople = ref([]);
  let pageAndPeople = ref({});
  let totalPeopleLength = ref(0)

  async function getPeople(planetUrl){
    let res = await axios.get(planetUrl);
    if (res) {
      res.data.results.forEach((planet) => {
        currentPeople.value.push(planet);
      });
  
      if(res.data.next) {
        const url = res.data.next;
        await getPeople(url);
      }
    }
  }

  async function getAllPeople() {
    await getPeople('/people')
  }

  return { currentPeople, pageAndPeople, totalPeopleLength, getAllPeople }
})
