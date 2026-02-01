<template>
  <v-container fluid class="fill-height d-flex justify-center align-center">
    <v-row class="text-center" align="center" justify="center">
      <v-fade-transition appear
        ><v-col cols="12" md="6">
          <v-icon color="error" size="120">mdi-alert-circle-outline</v-icon>

          <h1 class="display-1 font-weight-bold my-4">404</h1>

          <p class="subtitle-1 mb-6">Упс! Страница не найдена.</p>

          <v-btn
            color="primary"
            large
            @click="$router.push({ name: 'disciplines' })"
          >
            Вернуться на главную
          </v-btn>
        </v-col>
      </v-fade-transition>
    </v-row>
  </v-container>
</template>
