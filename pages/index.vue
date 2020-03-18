<template>
    <v-app>
        <v-container :style="`background:url(${require('~/assets/ingame.jpg')}) no-repeat center;height:100%;`">
            <v-overlay absolute :value="true" z-index="5" >
                <v-row align="center" justify="center">
                    <v-col class="text-center" cols="12">
                        <h1 class="display-3 font-weight-thin mb-4 black--text">Multipolio</h1>
                        <h4 class="subtitle-2">Un juego multijugador de monopolio en línea.</h4>
                        <h6 class="caption font-italic font-weight-medium red--text text--accent-4">@chrislaive</h6>
                    </v-col>
                </v-row>
            </v-overlay>
        </v-container>
    </v-app>
</template>

<style lang="scss" scoped>
.container{
    max-width: 100%;
}
</style>