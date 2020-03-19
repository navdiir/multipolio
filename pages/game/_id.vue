<template>
    <v-app>
        <v-container fill-height fluid>
            <v-row align="center" >
                <v-col cols="2" align="center">
                    <span class="headline">Multipolio #{{$route.params.id}}</span>
                </v-col>
                <v-col cols="6" offset="1">
                    <v-card color="grey">
                        <v-container class="py-0" fluid>
                            <v-row>
                                <v-col cols="6" align="center"> <v-btn small>Tirar dados</v-btn> </v-col>
                                <v-col cols="6" align="center"> <v-btn small>Rendirse</v-btn> </v-col>
                            </v-row>
                        </v-container>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="2">
                    <v-card height="100%" color="teal lighten-1">
                        <v-container>
                            <v-card color="teal lighten-5" :class="indexPlayer!=0?'mt-3':''" v-for="(player,indexPlayer) in players" :key="indexPlayer">
                                <v-list-item two-line>
                                    <v-list-item-content>
                                        <v-list-item-title class="text-no-wrap title mb-1">Player Namedddd</v-list-item-title>
                                        <v-list-item-subtitle>Jugador N°{{indexPlayer+1}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-avatar tile size="55" class="my-2"><v-img :src="require('~/assets/avatars/dog.png')" /></v-list-item-avatar>
                                </v-list-item>
                                <v-card-text class="pt-0">
                                    <v-row align="center">
                                        <v-col class="py-0" cols="9"><v-icon color="success">mdi-cash</v-icon> {{(indexPlayer+1)*200*8}} - {{indexPlayer+1}} Propiedades</v-col>
                                        <v-col class="py-0" cols="2"><v-btn x-small fab color="red darken-1" class="white--text"><v-icon>mdi-home-outline</v-icon></v-btn></v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-container>
                    </v-card>
                </v-col>
                <v-col cols="8">
                    <v-img contain :aspect-ratio="16/9" :src="require('~/assets/ingame.jpg')"></v-img>
                </v-col>
                <v-col cols="2">
                    <v-card height="100%" color="amber lighten-4">
                        <v-container>
                            <v-sheet class="orange lighten-3 text-center title font-weight-black">CHAT</v-sheet>
                        </v-container>
                        <v-container class="py-0" style="height:90%">
                            <v-card height="100%" color="white">
                                <v-container style="height:90%">
                                    <!-- Messages -->
                                </v-container>
                                <v-card-actions><v-text-field append-icon="mdi-send" class="mt-n2" color="dark" label="Enviar mensaje ..." filled rounded></v-text-field></v-card-actions>
                            </v-card>
                        </v-container>
                        </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-card color="indigo darken-1">
                        <v-container fluid class="py-0">
                            <v-row align="center">
                                <v-col cols="2" class="d-flex">
                                    <v-avatar size="60"><v-img :src="require('~/assets/avatars/cat.png')" /></v-avatar>
                                    <p class="ml-6 text-center ma-0 white--text"><span class="headline font-weight-bold">{{name.toUpperCase()}}</span> <br> <span><v-icon large color="success">mdi-cash</v-icon> 234000</span></p>
                                </v-col>
                                <v-col cols="8" class="py-0">
                                    <p class="text-center subtitle-1 mb-0 white--text font-weight-black">PROPIEDADES</p>
                                    <v-slide-group class="px-4" center-active show-arrows prev-icon="mdi-arrow-left-bold-circle" next-icon="mdi-arrow-right-bold-circle">
                                        <v-slide-item v-for="n in 20" :key="n" v-slot:default="{ active, toggle }" >
                                            <v-card :color="active ? 'teal lighten-4' : 'white'" class="ma-4" height="50" width="121" @click="toggle" >
                                                <v-row class="fill-height" align="center" justify="center" >
                                                    Propiedad {{n}}
                                                </v-row>
                                            </v-card>
                                        </v-slide-item>
                                    </v-slide-group>
                                </v-col>
                                <v-col align="center" cols="2" class="py-0">
                                    <p class="mb-0 white--text">1 <v-icon color="white" large>mdi-human-handsup</v-icon> <br> Salga libre de la carcel</p> 
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
import {mapState} from 'vuex';

export default {
    computed:{
        ...mapState({
            players: state => state.game.cantPlayers,
            name: state => state.player.name
        })
    }
}
</script>

<style lang="scss">
.v-slide-group__prev{
    .v-icon{
        color:white;
    }
}
.v-slide-group__next{
    .v-icon{
        color:white;
    }
}
</style>