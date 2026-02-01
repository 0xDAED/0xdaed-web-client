<script setup>
    import { ref } from 'vue'

    const drawer = ref(null)
</script>



<template>
    <v-container fluid>
        <v-row justify="space-between" align="center">
            <v-col cols="2">
                <h1>asad</h1>
            </v-col>
            <v-col cols="1"
            >
                <v-btn  
                    variant="plain"
                    :icon="drawer ? 'mdi-arrow-right' : 'mdi-arrow-left'"
                    @click.stop="drawer = !drawer"
                ></v-btn>
            </v-col>
        </v-row>

        
    </v-container>


    <v-navigation-drawer
        v-model="drawer"
        location="right"
        permanent
        class="d-flex flex-column"
    >
    </v-navigation-drawer>

    
</template>

<style>

</style>