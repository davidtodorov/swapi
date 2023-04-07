import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as _ from 'lodash'
import axios from '../axios'
import { usePeopleStore } from './peopleStore'

export const useSearchStore = defineStore('search', () => {
  const peopleStore = usePeopleStore();
  let searchedValues = ref({});
  let searchText = ref("");

  const debouncSearch = _.debounce(async () => {
    searchPeoplePerPage(1)
  }, 200);

  function searchPeople(value) {
    searchText.value = value;
    debouncSearch(value);
  }

  async function searchPeoplePerPage(page) {
    let url = 'people/?search=' + searchText.value + '&page=' + page;
    if(!searchedValues.value[url]) {
      let result = await axios.get(url);
      searchedValues.value[url] = result.data
    }
    peopleStore.setCurrentPeople(searchedValues.value[url].results)
    peopleStore.setTotalPeopleLength(searchedValues.value[url].count)
  }

  return { searchedValues, searchPeople, searchPeoplePerPage }
});
