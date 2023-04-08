<template>
<div class="text-center">
    <v-dialog
    v-model="showDialog"
    width="auto"
    >
        <v-card>
            <v-card-text>
            <div>
                <span>Name: </span> {{ planet.name }}
            </div>
                <div><span>Diameter: </span> {{ planet.diameter }}</div>
                <div><span>Climate: </span> {{ planet.climate }}</div>
                <div><span>Population: </span> {{ planet.population }}</div>
            </v-card-text>
            <v-card-actions>
            <v-btn color="primary" block @click="showDialog = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: { type: Boolean },
    planet: { type: Object, required: true }
})
const emit = defineEmits(['update:modelValue'])

const showDialog = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<style lang="css" scoped>
    span {
        font-weight: bold;
    }
</style>
