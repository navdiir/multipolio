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
                                            <v-text-field style="width:10rem" type="number" :error="errorPlayers.state" :error-messages="errorPlayers.val" hide-details="auto" v-model="players" label="Cantidad jugadores"  />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4" align="center">
                                            <div style="position:relative;">
                                                <v-avatar class="mb-3 pa-2" color="amber lighten-4" size="120"> <v-img contain :aspect-ratio="16/9" :src="require(`~/assets/avatars/${avatar}.png`)" /> </v-avatar>
                                                <v-dialog max-width="400px">
                                                    <template v-slot:activator="{ on }"> <v-btn v-on="on" fab x-small absolute right top><v-icon>mdi-magnify-plus-outline</v-icon></v-btn> </template>
                                                    <v-card>
                                                        <v-img contain :aspect-ratio="16/9" :src="require(`~/assets/avatars/${avatar}.png`)" />
                                                        <v-sheet color="grey lighten-2" class="text-center headline">{{avatars.filter(e=>e.num==avatar)[0].text}}</v-sheet>
                                                    </v-card>
                                                </v-dialog>
                                            </div>
                                            <v-menu>
                                                <template v-slot:activator="{ on }"> <v-btn small color="primary" v-on="on" > Escoger avatar </v-btn> </template>
                                                <v-list>
                                                    <v-list-item v-for="(item, index) in avatars" :key="index" @click="avatar=item.num">
                                                        <v-list-item-avatar> <v-img contain :aspect-ratio="16/9" :src="require(`~/assets/avatars/${item.num}.png`)"></v-img> </v-list-item-avatar>
                                                         <v-list-item-content> <v-list-item-title class="" v-text="item.text" /> </v-list-item-content>
                                                    </v-list-item>
                                                </v-list>
                                            </v-menu>
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
        avatar: '1',
        avatars:[
            {num:"1",text:"Barco"},
            {num:"2",text:"Auto"},
            {num:"3",text:"Gato"},
            {num:"4",text:"Helicóptero"},
            {num:"5",text:"Dinosaurio"},
            {num:"6",text:"Perro"},
            {num:"7",text:"Pato"},
            {num:"8",text:"Plancha"},
            {num:"9",text:"Guitarra"},
            {num:"10",text:"Sombrero"},
            {num:"11",text:"Cesto"},
            {num:"12",text:"Pingüino"},
            {num:"13",text:"Anillo"},
            {num:"14",text:"Robot"},
            {num:"15",text:"Zapato"}
        ],
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
            const res = await this.setupGame({name:this.name,players:this.players,avatar:this.avatar,id:this.$socket.client.id});
            this.$router.push({name:'game-id',params:{id:res.id}});
        },
        ...mapActions({
            setupGame: 'game/setupGame'
        })
    },
    computed:{
        nameUC(){
            return this.name?this.name.toUpperCase():this.name
        },
        errorPlayers(){
            return !this.players?{state:true,val:'Requerido.'}:Number(this.players)==NaN?{state:true,val:'Solo números.'}:Number(this.players)<2?{state:true,val:'Mínimo 2 jugadores'}:Number(this.players)>6?{statue:true,val:'Máximo 6 jugadores'}:{statue:false,val:''}
        }
    }
}
</script>

<style lang="scss" scoped>
.container{
    max-width: 100%;
}
</style>