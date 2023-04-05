import { ref } from 'vue'
import { defineStore } from 'pinia';
import axios from '../axios'

export const usePlanetStore = defineStore('planets', () => {  
  let planetsObj = ref({});

  async function getPlanet(planetUrl){
    let res = await axios.get(planetUrl);
    if (res) {
      res.data.results.forEach((planet) => {
        planetsObj.value[planet.url] = planet;
      });
  
      if(res.data.next) {
        const url = res.data.next;
        await getPlanet(url);
      }
    }
  }

  async function getAllPlanets() {
    await getPlanet('/planets')
  }

  return { planetsObj, getAllPlanets }
})
