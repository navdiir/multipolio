<template>
    <v-app>
        <v-container :style="`background:url(${require('~/assets/ingame.jpg')}) no-repeat center;height:100%;`">
            <v-overlay absolute :value="true" z-index="1" opacity="0.1">
                <v-row align="center" justify="center">
                    <v-col class="text-center" cols="12">
                        <h1 class="display-3 font-weight-thin mb-4 black--text">Multipolio</h1>
                        <h4 class="subtitle-2">Un juego multijugador de monopolio en línea.</h4>
                        <h6 class="caption font-italic font-weight-medium red--text text--accent-4">@chrislaive</h6>
                    </v-col>
                    <v-dialog v-model="dialog" persistent max-width="600px">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" rounded v-on="on">Empezar el juego</v-btn>
                        </template>
                        <v-card>
                            <v-card-title class="indigo lighten-1">
                                <span class="headline white--text">Creación del juego</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="8">
                                            <v-text-field v-model="name" label="Nombre" :rules="rules" hide-details="auto" counter maxlength="15" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field type="number" :error="errorPlayers.state" :error-messages="errorPlayers.val" hide-details="auto" v-model="players" label="Cantidad jugadores"  />
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="dialog = false">Cancelar</v-btn>
                                <v-btn color="blue darken-1" text :disabled="!name || name.length<3 || players>6 || players<2?true:false" @click="confirmDialog= true;">Empezar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="confirmDialog" persistent max-width="450">
                        <v-card>
                            <v-card-title class="headline">New Multipolio's game!</v-card-title>
                            <v-card-text class="pt-2">
                                ¡Hola <strong>{{nameUC}}</strong>! <br> <br> 
                                Estas por iniciar un nuevo juego de Multipolio para <strong>{{players}} jugadores</strong>.
                                Recuerda que una vez aceptes tendrás un link para poder invitar al resto de jugadores para que se sumen al juego, una vez todos
                                esten dentro solo tú podrás iniciar el juego y si una persona extraña se une a tu sala podrás retirarla antes de iniciar. <br>
                                Recuerda que esta plataforma está aún en desarrollo y de existir cualquier problema no dudes en informarnos. <br><br>
                                ¡Disfruta tu partida!
                            </v-card-text>
                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green darken-1" text @click="confirmDialog = false;">Cancelar</v-btn>
                            <v-btn color="green darken-1" text @click="startGame">Ir a sala</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-row>
            </v-overlay>
        </v-container>
    </v-app>
</template>

<script>
import {mapActions} from 'vuex';

export default {
    data:()=>({
        dialog: false,
        confirmDialog: false,
        name: null,
        players: 2,
        rules: [
            value => !!value || 'Requerido.',
            value => (value && value.length >= 3) || 'Mínimo 3 caracteres.',
        ],
        rules2: [
            value => !!value || 'Requerido (Solo números).',
            value => Number(value) == NaN|| 'Solo números.',
            value => Number(value)<2  || 'Mínimo 2 jugadores.',
            value => Number(value)>6  || 'Máximo 6 jugadores.'
        ]
    }),
    methods:{
        async startGame(){
            await Promise.all([this.setName(this.name),this.setCantPlayers(Number(this.players-1))]);
            this.$router.push({name:'game-id',params:{id:'123'}});
        },
        ...mapActions({
            setName: 'player/setName',
            setCantPlayers: 'game/setCantPlayers'
        })
    },
    computed:{
        nameUC(){
            return this.name?this.name.toUpperCase():this.name
        },
        errorPlayers(){
            return !this.players?{state:true,val:'Requerido.'}:Number(this.players)==NaN?{state:true,val:'Solo números.'}:Number(this.players)<2?{state:true,val:'Mínimo 2 jugadores'}:Number(this.players)>5?{statue:true,val:'Máximo 6 jugadores'}:{statue:false,val:''}
        }
    }
}
</script>

<style lang="scss" scoped>
.container{
    max-width: 100%;
}
</style>