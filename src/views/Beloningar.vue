<template>
  <div>
    <section class="create-new-section d-flex justify-center flex-column align-center">
      <v-btn
        @click="openAddRewardDialog"
        color="purple-lighten-4"
        class="border-md border-purple rounded-btn black-text custom-btn d-flex justify-space-between align-center"
        max-width="400px"
      >
        <span class="black-text">Ny Belöning</span>
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
              >
            </v-text-field>
              <div class="v-messages error--text" role="alert">
                <div class="v-messages__wrapper">
                </div>
              </div>
            </v-card-text>
            <v-card-text class="flex-grow-0" style="overflow: visible; padding-bottom: 0">
            <textarea
            v-model="description"
            placeholder="Beskrivning"
            rows="4"
            cols="50"
            ></textarea>
          </v-card-text>

          <v-card-text class="flex-grow-0 custom-card-text">
              <v-slider
                v-model="points"
                min="0"
                max="100"
                step="1"
                label="Poäng"
                thumb-label
                tick-labels
                class="my-3"
              >

              </v-slider>
            </v-card-text>

          <v-card-text class="flex-grow-0" style="overflow: visible; padding-bottom: 0">
              <v-text-field
                placeholder="URL till bild (t.ex. Unsplash)"
              >
              </v-text-field>
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
  </div>
</template>

<script setup>
import { useChoreStore } from '../stores/ChoreStore';

const store = useChoreStore()

const openAddRewardDialog = () => {
  store.addRewardDialog = true
}

const rules = {
  required: (value) => !!value || 'Du måste ange en titel'
}
</script>

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
</style>
