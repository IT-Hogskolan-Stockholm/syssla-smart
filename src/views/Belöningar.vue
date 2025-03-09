<script setup>
import { ref } from 'vue'
import { useChoreStore } from '../stores/ChoreStore'
import RewardCard from '../components/RewardCard.vue'

const store = useChoreStore()
const points = ref(0)
const rewardName = ref('')
const description = ref('')
const imgSrc = ref('')
const form = ref(null)

const handleSubmit = async () => {
  if (!rewardName.value.trim()) return
  await store.addReward(rewardName.value, description.value, points.value, imgSrc.value)
  rewardName.value = ''
  description.value = ''
  points.value = 0
  imgSrc.value = ''

  store.closeAddRewardDialog()
}

const increasePoints = () => {
  if (points.value < 100) points.value++
}

const decreasePoints = () => {
  if (points.value < 100 && points.value > 0) points.value--
}

const openAddRewardDialog = () => {
  store.addRewardDialog = true
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
              <v-card-text class="flex-grow-0" style="overflow: visible; padding-bottom: 0">
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

              <v-card-text class="flex-grow-0" style="overflow: visible; padding-bottom: 0">
                <v-textarea
                  variant="outlined"
                  v-model="description"
                  placeholder="Beskrivning"
                  rows="2"
                  class="custom-text-area"
                ></v-textarea>
              </v-card-text>

              <v-card-text class="flex-grow-0 custom-card-text d-flex align-center">
                <div class="input-points">
                  <v-text-field
                    v-model="points"
                    class="mc-3 text-center"
                    style="max-width: 80px; text-align: center"
                    label="Poäng"
                    hide-details
                    single-line
                  ></v-text-field>

                  <div class="d-flex flex-column align-center mx-2">
                    <v-btn icon variant="flat" class="point-arrow" @click="increasePoints">
                      <v-icon>mdi-chevron-up</v-icon>
                    </v-btn>
                    <v-btn icon variant="flat" class="point-arrow" @click="decreasePoints">
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                  </div>
                </div>
                <span class="ml-2">Poäng</span>
                <v-icon class="m1-1" color="yellow darken-2 size=18">mdi-star</v-icon>
              </v-card-text>

              <v-card-text class="flex-grow-0" style="overflow: visible; padding-bottom: 0">
                <v-text-field
                  variant="outlined"
                  v-model="imgSrc"
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
  margin-top: 2rem;
}

.form-container {
  padding: 1.8rem;
  color: black;
}

.input-points {
  display: flex;
  align-items: center;
  border: 1px solid #a4a4a4;
  border-radius: 6px;
}

::v-deep(.input-points .v-field__overlay) {
  display: none !important;
}

::v-deep(.input-points .v-field__outline) {
  display: none !important;
}

.point-arrow {
  display: flex;
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

:deep(.v-card-actions) {
  padding: 16px 24px !important;
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
