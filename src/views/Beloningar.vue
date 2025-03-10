<script setup>
import { ref } from 'vue'
import { useChoreStore } from '../stores/ChoreStore'
import beloningCard from '../components/beloningCard.vue'

const store = useChoreStore()
const points = ref(0)
const rewardName = ref('')
const description = ref('')
const form = ref(null)
const imageUrl = ref('')

const handleSubmit = async () => {
  if (!rewardName.value.trim()) return

  store.addReward({
    name: rewardName.value,
    description: description.value,
    points: points.value,
    imageUrl: imageUrl.value
  })

  rewardName.value = ''
  description.value = ''
  points.value = 0
  imageUrl.value = ''

  store.closeAddRewardDialog()
}

const increasePoints = () => {
  if (points.value < 100) points.value++
}

const decreasePoints = () => {
  if (points.value < 100) points.value--
}

const openAddRewardDialog = () => {
  store.addRewardDialog = true
}

const rules = {
  required: (value) => (value?.trim() ? true : 'Du måste ange en titel')
}
</script>

<template>
  <div>
    <section class="create-new-section d-flex justify-center flex-column align-center">
      <v-btn
        @click="openAddRewardDialog"
        color="purple-lighten-4"
        class="border-md border-purple rounded-btn black-text custom-btn d-flex justify-space-between align-center"
        max-width="400px"
      >
        <span class="black-text ml-2 text-body-1">Ny Belöning</span>
        <v-icon class="ml-7 black-text" color="black">mdi-plus</v-icon>
      </v-btn>

      <v-dialog
        v-model="store.addRewardDialog"
        max-width="400px"
        :content-class="'auto-height-dialog'"
        class="d-flex align-start"
      >
        <v-card class="d-flex flex-column" style="min-height: 0">
          <v-form ref="form">
            <v-card-text class="flex-grow-0" style="overflow: visible; padding-bottom: 0">
              <v-text-field
                v-model="rewardName"
                placeholder="Titel"
                :rules="[rules.required]"
              ></v-text-field>

              <div class="v-messages error--text" role="alert">
                <div class="v-messages__wrapper"></div>
              </div>
            </v-card-text>

            <v-card-text class="flex-grow-0" style="overflow: visible; padding-bottom: 0">
              <v-textarea
                v-model="description"
                placeholder="Beskrivning"
                rows="2"
                class="custom-text-area"
              ></v-textarea>
            </v-card-text>

            <v-card-text class="flex-grow-0 custom-card-text d-flex align-center">
              <v-text-field
                v-model="points"
                type="number"
                min="0"
                max="100"
                step="1"
                class="mc-3 text-center"
                style="max-width: 80px; text-align: center"
                label="Poäng"
                hide-details
                single-line
              ></v-text-field>

              <div class="d-flex flex-column align-center mx-2">
                <v-btn icon @click="increasePoints">
                  <v-icon>mdi-chevron-up</v-icon>
                </v-btn>
                <v-btn icon @click="decreasePoints">
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </div>
              <span class="ml-2">Poäng</span>
              <v-icon class="m1-1" color="yellow darken-2 size=18">mdi-star</v-icon>
            </v-card-text>

            <v-card-text class="flex-grow-0" style="overflow: visible; padding-bottom: 0">
              <v-text-field
                v-model="imageUrl"
                placeholder="URL till bild (t.ex. Unsplash)"
              ></v-text-field>
            </v-card-text>

            <!--Lägg till button section-->
            <v-card-actions class="justify-center flex-grow-0 mt-5">
              <v-btn
                color="green"
                @click="handleSubmit(rewardName)"
                size="large"
                class="add-btn"
                block
              >
                <span class="black-text rounded-btn">Lägg Till</span>
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </section>
    <beloningCard />
  </div>
</template>

<style scoped>
.rounded-btn {
  border-radius: 16px;
}

.black-text {
  color: #000;
  text-transform: none;
  font-weight: 400;
}

.add-btn {
  background-color: #26a69a;
  font-size: 1.3rem;
  padding: 1rem 4rem !important;
  margin-bottom: 0.5rem;
  margin: 0 24px 0.5rem 24px;
  border-radius: 16px;
  height: unset !important;
  .v-btn__content {
    .black-text.rounded-btn {
      width: 100%;
    }
  }
}

.custom-btn {
  padding: 2rem 1rem;
  margin-bottom: 1rem;
  width: 90%;
  font-size: 1.1rem;
}

.border-purple {
  color: #6a1b9a;
}

.custom-text-area {
  background: #f5f5f5;
  border-radius: 4px;
  padding: 10px;
  width: 300px;
  min-height: 300px;
  max-width: 500px;
  max-height: 250px;
}
</style>
