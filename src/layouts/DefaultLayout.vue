<template>
  <v-app>
    <AppSidebar />

    <v-main class="fill-height ma-4">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import AppSidebar from "@/components/layout/AppSidebar.vue";
</script>
