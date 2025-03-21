<script setup>
import { ref } from 'vue'
import { useChoreStore } from '../stores/ChoreStore'
import RewardCard from '../components/RewardCard.vue'

const store = useChoreStore()
const points = ref(1)
const rewardName = ref('')
const description = ref('')
const imgSrc = ref('')
const form = ref(null)
const openAddRewardDialog = () => {
  store.addRewardDialog = true
}

const handleSubmit = async () => {
  if (!rewardName.value.trim()) {
    return
  }
  if (points.value <= 0) {
    return
  }
  try {
    await store.addReward(rewardName.value, description.value, points.value, imgSrc.value)
    rewardName.value = ''
    description.value = ''
    points.value = 0
    imgSrc.value = ''
    store.addRewardDialog = false
  } catch (error) {
    console.error('Något gick fel vid skapandet av belöningen:', error)
  }
}

const increasePoints = () => {
  if (points.value < 100) points.value++
}

const decreasePoints = () => {
  if (points.value < 100 && points.value > 0) points.value--
}

const rules = {
  required: (value) => (value?.trim() ? true : 'Du måste ange en titel')
}
</script>

<template>
  <div class="rewards-container">
    <RewardCard />
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
            <div class="form-container">
              <v-card-text class="flex-grow-0 pb-0" style="overflow: visible">
                <v-text-field
                  variant="outlined"
                  v-model="rewardName"
                  placeholder="Titel"
                  :rules="[rules.required]"
                ></v-text-field>

                <div class="v-messages error--text" role="alert">
                  <div class="v-messages__wrapper"></div>
                </div>
              </v-card-text>

              <v-card-text class="flex-grow-0 py-0" style="overflow: visible">
                <v-textarea
                  variant="outlined"
                  v-model="description"
                  placeholder="Beskrivning"
                  rows="3"
                  :no-resize="true"
                  :hide-details="true"
                ></v-textarea>
              </v-card-text>

              <v-card-text
                class="flex-grow-0 custom-card-text d-flex align-center justify-space-between py-4"
              >
                <div class="input-points d-flex align-center">
                  <v-text-field
                    v-model="points"
                    class="mc-3 text-center"
                    style="text-align: center"
                    label="Poäng"
                    type="number"
                    hide-details
                    :hide-spin-buttons="true"
                    single-line
                  ></v-text-field>

                  <div class="d-flex flex-column align-center mx-2">
                    <v-btn icon variant="flat" class="point-arrow d-flex" @click="increasePoints">
                      <v-icon>mdi-chevron-up</v-icon>
                    </v-btn>
                    <v-btn icon variant="flat" class="point-arrow d-flex" @click="decreasePoints">
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                  </div>
                </div>
                <div class="counter-label">
                  <span class="ml-2">Poäng</span>
                  <v-icon class="m1-1" color="yellow darken-2" size="30">mdi-star</v-icon>
                </div>
              </v-card-text>

              <v-card-text class="flex-grow-0 py-0" style="overflow: visible">
                <v-text-field
                  variant="outlined"
                  v-model="imgSrc"
                  placeholder="URL till bild (t.ex. Unsplash)"
                  :hide-details="true"
                ></v-text-field>
              </v-card-text>

              <v-card-actions class="justify-center flex-grow-0 px-4 pt-4 pb-2">
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
            </div>
          </v-form>
        </v-card>
      </v-dialog>
    </section>
  </div>
</template>

<style scoped>
.rewards-container {
  width: 100%;
}

.input-points {
  border: 1px solid #a4a4a4;
  border-radius: 6px;
  width: 13rem;
}

::v-deep(.input-points .v-field__overlay) {
  display: none !important;
}

::v-deep(.input-points .v-field__outline) {
  display: none !important;
}

::v-deep(.v-input__details) {
  padding-bottom: 6px;
}

::v-deep(.error--text) {
  display: none !important;
}

.counter-label {
  font-size: 1rem;
}

.point-arrow {
  margin: 0.4rem;
  width: 0.625rem;
  height: 0.625rem;
  font-size: 1rem;
}

.rounded-btn {
  border-radius: 16px;
}

.add-btn {
  background-color: #26a69a;
  font-size: 1.3rem;
  padding: 1rem 4rem !important;
  margin-bottom: 0.5rem;
  margin: 0 24px 0.5rem 24px;
  border-radius: 6px;
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

:deep(.v-btn__content) {
  justify-content: space-between;
  width: 100%;
}
</style>
