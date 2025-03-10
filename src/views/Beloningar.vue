<script setup>
import { ref } from 'vue'
import { useChoreStore } from '../stores/ChoreStore'

const store = useChoreStore()
const points = ref(0)
const rewardName = ref('')
const description = ref('')
const form = ref(null)

const handleSubmit = async () => {
  if (!rewardName.value.trim()) return

  store.addReward({
    name: rewardName.value,
    description: description.value,
    points: points.value
  })

  rewardName.value = ''
  description.value = ''
  points.value = 0

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
        color="#f2ff3d"
        class="border-md border-purple rounded-btn black-text custom-btn d-flex justify-space-between align-center"
        max-width="400px"
      >
        <span class="black-text ml-2">Ny Belöning</span>
        <v-icon class="ml-7 black-text custom-icon" color="black">mdi-plus</v-icon>
      </v-btn>

      <v-dialog
        v-model="store.addRewardDialog"
        max-width="400px"
        :content-class="'auto-height-dialog'"
        class="d-flex align-start"
      >
        <v-card class="d-flex flex-column" style="min-height: 0">
          <v-form ref="form">
            <div class="container">
              <v-card-text
                class="flex-grow-0 title-card"
                style="overflow: visible; padding-bottom: 0"
              >
                <v-text-field
                  class="text"
                  variant="outlined"
                  v-model="rewardName"
                  placeholder="Titel"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-card-text>

              <v-card-text class="flex-grow-0" style="overflow: visible; padding-bottom: 0">
                <v-textarea
                  variant="outlined"
                  class="text"
                  auto-grow
                  style="height: 160px"
                  v-model="description"
                  placeholder="Beskrivning"
                  rows="2"
                ></v-textarea>
              </v-card-text>

              <v-card-text class="flex-grow-0 custom-card-text d-flex align-center">
                <div class="input-points">
                  <v-text-field
                    variant="none"
                    v-model="points"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    class="mc-3 text-center text"
                    style="max-width: 80px; text-align: center"
                    label="Poäng"
                    hide-details
                    single-line
                  ></v-text-field>

                  <div class="d-flex flex-column align-center mx-2">
                    <v-btn variant="flat" class="point-arrow" icon @click="increasePoints">
                      <v-icon>mdi-triangle</v-icon>
                    </v-btn>
                    <v-btn variant="flat" class="point-arrow" icon @click="decreasePoints">
                      <v-icon>mdi-triangle-down</v-icon>
                    </v-btn>
                  </div>
                </div>
                <span class="ml-2 points">Poäng</span>
                <v-icon class="m1-1 star" color="yellow darken-2 size=18">mdi-star</v-icon>
              </v-card-text>

              <v-card-text class="flex-grow-0" style="overflow: visible; padding-bottom: 0">
                <v-text-field
                  variant="outlined"
                  class="text"
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
* {
  margin: 0;
  padding: 0;
  font-size: large;
  color: #272727 !important;
}

.text {
  color: #272727;
  font-size: 20px;
}

.container {
  padding: 1.8rem;
  color: black;
}

.points-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: red;
}

.input-points {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #a4a4a4;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  /* mellanrum över url */
}

:v-deep(.v-text-field .v-input__details) {
  padding-inline: 0;
}

.point-arrow {
  display: flex;
  margin: 0.4rem;
  /* mellan arrows */
  width: 10px;
  height: 10px;
  font-size: 10px;
}

.rounded-btn {
  border-radius: 16px;
}

.add-btn {
  background-color: #97d395;
  font-size: 1.3rem;
  padding: 1rem 4rem !important;
  margin-bottom: 0.5rem;
  margin: 0 24px 0.5rem 24px;
  border-radius: 10px;
  height: unset !important;

  .v-btn__content {
    .black-text.rounded-btn {
      width: 100%;
    }
  }
}

.star {
  font-size: 30px;
  padding-left: 1rem;
}

.points {
  padding-left: 1rem;
  font-size: 20px;
  justify-content: center;
  align-items: center;
}

.custom-btn {
  padding: 2rem 1rem;
  width: 90vw;
  font-size: 1.2rem;
  position: relative;
}

.custom-btn span {
  flex-grow: 1;
}

.custom-icon {
  position: absolute;
  right: 1.5rem;
}
</style>
