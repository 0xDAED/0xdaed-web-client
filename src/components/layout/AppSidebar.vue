<template>
  <v-navigation-drawer app permanent rail>
    <v-sheet class="d-flex flex-column" height="100%">
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/3.jpg"
          v-tooltip:end="'Владислав Кузин'"
        />
      </v-list>

      <v-divider />

      <v-list density="compact" nav class="flex-column">
        <template v-for="(group, gi) in navigation" :key="gi">
          <v-list-item
            v-for="item in group.items"
            v-tooltip:end="item.tooltip"
            :key="item.route"
            :prepend-icon="item.icon"
            :title="item.title"
            :to="{ name: item.route }"
          />
          <v-divider v-if="gi < navigation.length - 1" />
        </template>
      </v-list>

      <v-spacer />

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-cog-outline"
          title="Настройки"
          v-tooltip:end="'Настройки'"
          :to="{ name: 'accountSettings' }"
        />
        <v-list-item prepend-icon="mdi-exit-to-app" title="Выход" v-tooltip:end="'Выход'" />
      </v-list>
    </v-sheet>
  </v-navigation-drawer>
</template>

<script setup>
  import { navigation } from '@/constants/navigation';
</script>
