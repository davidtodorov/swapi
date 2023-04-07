import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as _ from 'lodash'
import axios from '../axios'

export const useSearchStore = defineStore('search', () => {
  let searchedValues = ref({});
  let searchText = ref("");
  let totalPeopleLength = ref(0);
  let currentPeople = ref([])

  function searchPeople(value) {
    searchText.value = value;
    _.debounce(async () => {
      await searchPeoplePerPage(1)
    }, 250)();
  }

  async function searchPeoplePerPage(page) {
    let url = 'people/?search=' + searchText.value + '&page=' + page;
    if(!searchedValues.value[url]) {
      let result = await axios.get(url);
      searchedValues.value[url] = result.data
    }
    currentPeople.value = searchedValues.value[url].results;
    totalPeopleLength.value = searchedValues.value[url].count;
  }

  return { currentPeople, totalPeopleLength, searchedValues, searchPeople, searchPeoplePerPage }
});
