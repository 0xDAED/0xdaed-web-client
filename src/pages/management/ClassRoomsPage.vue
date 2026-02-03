<script setup>
  import '../../assets/css/classRoom.css';
  import profile from '../../../public/favicon.ico';

  import { useComputer, useComputers } from '@/composables/useComputer';
  import { ref, onMounted, computed } from 'vue';

  const { computers, activeComputers, computersCount, addComputer } = useComputers();

  /**
   * @type {import('vue').ComputedRef<Array<{id: string, computerActive: boolean, computerName: string, computerMacAddress: string, lastTimeActive: string}>>}
   */
  const computersArray = computed(() =>
    Object.entries(computers.value).map(([id, comp]) => ({ id, ...comp }))
  );

  const macAddress = '34-5A-60-E6-5B-BB';
  onMounted(() => {
    addComputer(macAddress, {
      computerActive: false,
      computerName: 'DESKTOP-MIRON',
      computerMacAddress: macAddress,
      lastTimeActive: '5 дней назад',
    });
  });

  const drawer = ref(null);
  const items = [
    { symbol: '🍎', name: 'Apple' },
    { symbol: '🍌', name: 'Banana' },
    { symbol: '🍇', name: 'Grapes' },
    { symbol: '🍉', name: 'Watermelon' },
    { symbol: '🍓', name: 'Strawberry' },
    { symbol: '🥝', name: 'Kiwi' },
  ];

  const selected = ref([].map((v) => items.find((item) => item.name === v)));
</script>

<style></style>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="auto">
        <h3>ПОДКЛЮЧЕННЫЕ КЛИЕНТЫ</h3>
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-col cols="12" md="5">
        <h4 class="mb-1">Найти компьютер</h4>
        <v-form>
          <v-text-field
            name="searchComputer"
            label="Введите название компьютера / процесса"
            id="searchComputerInput"
            variant="solo"
          ></v-text-field>
        </v-form>
      </v-col>

      <v-col cols="auto" md="auto">
        <v-row class="classroom-container" justify="center" align-content="center">
          <v-col cols="auto" class="text-center">
            <h6 class="classroom-placeholder">Аудитории</h6>
            <div class="classroom-group">
              <v-btn class="btn-classroom" color="green"></v-btn>
              <v-btn class="btn-classroom" color="blue-lighten-1"></v-btn>
              <v-btn class="btn-classroom" color="deep-purple"></v-btn>
              <v-btn class="btn-classroom" color="deep-orange-lighten-1"></v-btn>
            </div>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="8" md="5">
        <h4 class="mb-1">Фильтры</h4>
        <v-combobox
          v-model="selected"
          :items="items"
          item-title="name"
          item-value="name"
          chips
          closable-chips
          multiple
          class="fixed-height-combobox"
          placeholder="Фильтры"
          variant="solo"
        >
          <template v-slot:chip="{ props, item }">
            <v-chip v-bind="props" label>
              <template v-slot:prepend>
                <div class="me-1">{{ item.raw.symbol }}</div>
              </template>
              <template v-slot:close>
                <v-icon icon="$close" size="14"></v-icon>
              </template>
            </v-chip>
          </template>
        </v-combobox>
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-col cols="12" md="3" sm="6" lg="2" v-for="comp in computersArray" :key="comp.id">
        <v-card class="card-computer-custom mx-auto" max-width="250">
          <v-row class="mt-1" justify="space-between" style="padding: 5px">
            <v-col cols="8" justify="center">
              <v-row class="ml-2">
                <div class="card-profile">
                  <img :src="profile" class="mt-1" />
                </div>
                <div
                  class="card-lifestyle ml-4 mt-5"
                  :class="comp.computerActive ? 'green' : 'red'"
                  v-tooltip:top="!comp.computerActive ? comp.lastTimeActive : null"
                ></div>
              </v-row>
            </v-col>
            <v-col cols="3" class="mr-2">
              <div class="card-button">
                <img :src="profile" width="15" v-tooltip:top="'Сохранить'" /></div
            ></v-col>
          </v-row>

          <v-card-item class="mt-2">
            <h6 v-text="comp.computerMacAddress" style="opacity: 0.7"></h6>
            <h3 v-text="comp.computerName"></h3>
          </v-card-item>

          <v-card-text class="py-0">
            <v-row align="center" no-gutters> </v-row>
          </v-card-text>

          <!--div class="d-flex py-3 justify-space-between">
            <v-list-item
              density="compact"
              prepend-icon="mdi-weather-windy"
            >
              <v-list-item-subtitle>123 km/h</v-list-item-subtitle>
            </v-list-item>

            <v-list-item
              density="compact"
              prepend-icon="mdi-weather-pouring"
            >
              <v-list-item-subtitle>48%</v-list-item-subtitle>
            </v-list-item>
          </div--->
        </v-card>
      </v-col>
    </v-row>

    <v-btn
      variant="plain"
      :icon="drawer ? 'mdi-arrow-right' : 'mdi-arrow-left'"
      @click.stop="drawer = !drawer"
    ></v-btn>

    <v-navigation-drawer
      v-model="drawer"
      location="right"
      app
      temporary
      expand-on-hover
      :width="350"
    >
      <v-container>
        <v-row justify="end" style="padding: 0px 10px 0px 0px">
          <v-col cols="1">
            <v-btn
              variant="plain"
              :icon="drawer ? 'mdi-arrow-right' : 'mdi-arrow-left'"
              @click.stop="drawer = !drawer"
            ></v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>
  </v-container>
</template>
