<template>
    <v-app>
        <v-container v-if="game.name" fill-height fluid>
            <v-row align="center" >
                <v-col cols="2" align="center">
                    <span class="headline">¡Multipolio!</span>
                </v-col>
                <v-col cols="6" offset="1">
                    <v-card color="grey">
                        <v-container class="py-0" fluid>
                            <v-row align="center" v-if="!game.start">
                                <v-col v-if="game.creator" cols="12">
                                    <v-text-field label="Invita a tus amigos" class="white" id="urlFriends" @click:append="copyUrl" :value="`${baseUrl}/game/${$route.params.id}`" append-icon="mdi-content-copy" filled dense :hide-details="true" readonly />
                                </v-col>
                                <v-col align="center" cols="2" class="inputSwitch">
                                    <v-switch color="green accent-3" dense :hide-details="true" class="mt-0" v-model="active" label="Estoy listo" />
                                </v-col>
                                <v-col v-if="!game.creator" align="center" cols="8">
                                    <v-sheet>{{game.players.map(e=>e.active).indexOf(false)==-1 && active?'Esperando a que el creador inicie el juego.':'Esperando a que los demás jugadores estén listos.'}}</v-sheet>
                                </v-col>
                                <v-col v-if="game.creator" align="center" cols="8" class="pt-0">
                                    <v-btn @click="startGame" :disabled="!active || game.players.map(e=>e.active).indexOf(false)!=-1 || game.players.length==0" small>Empezar juego</v-btn>
                                </v-col>
                            </v-row>
                            <v-row v-else>
                                <v-col cols="4" align="center"> <v-btn @click="infoUser= !infoUser" small>Ver info</v-btn> </v-col>
                                <v-col cols="4" align="center"> <v-btn :disabled="!canRoll" @click.stop="rollDice" small>Tirar dados</v-btn> </v-col>
                                <v-col cols="4" align="center"> <v-btn @click="gg" small>Rendirse</v-btn> </v-col>
                            </v-row>
                        </v-container>
                    </v-card>
                </v-col>
                <v-col v-if="game.start" cols="2" offset="1">
                    <v-sheet class="red accent-3 text-center white--text font-weight-black">Turno de {{turnWho}}</v-sheet>
                    Turno {{turn}} - Ronda {{round}}
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="2">
                    <v-card height="100%" color="teal lighten-1">
                        <v-container>
                            <v-card color="teal lighten-5" :class="indexPlayer!=0?'mt-3':''" v-for="(player,indexPlayer) in game.players" :key="indexPlayer">
                                <v-list-item two-line>
                                    <v-list-item-content>
                                        <v-list-item-title class="text-no-wrap title mb-1">{{player.name}}</v-list-item-title>
                                        <v-list-item-subtitle>Jugador N°{{indexPlayer+1}} {{player.loss?` - Perdió`:''}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-avatar tile size="55" class="my-2"><v-img contain :aspect-ratio="16/9" :src="require(`~/assets/avatars/${player.image}.png`)" /></v-list-item-avatar>
                                </v-list-item>
                                <v-card-text class="pt-0">
                                    <v-row v-if="game.start" align="center">
                                        <v-col class="py-0" cols="9"><v-icon color="success">mdi-cash</v-icon> {{player.cash}} - {{player.properties.length}} Propiedades</v-col>
                                        <v-col class="py-0" cols="2"><v-btn x-small fab color="red darken-1" class="white--text"><v-icon>mdi-home-outline</v-icon></v-btn></v-col>
                                    </v-row>
                                    <v-row v-else align="center">
                                        <v-col class="py-0 inputSwitch" cols="9"><v-switch readonly color="green accent-3" dense :hide-details="true" class="mt-0" v-model="player.active" label="Estoy listo" /></v-col>
                                        <v-col class="py-0" cols="2" v-if="game.creator"><v-btn x-small @click="removePlayer(player.idPlayer)" fab color="red darken-1" class="white--text"><v-icon>mdi-close</v-icon></v-btn></v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-container>
                    </v-card>
                </v-col>
                <v-col cols="8">
                    <board-game :positions="positions" />
                </v-col>
                <v-col cols="2">
                    <v-card height="100%" color="amber lighten-4">
                        <v-container>
                            <v-sheet class="orange lighten-3 text-center title font-weight-black">CHAT</v-sheet>
                        </v-container>
                        <v-container class="py-0" style="height:90%">
                            <v-card height="100%" color="white">
                                <v-container style="height:85%;position:relative;">
                                    <ul style="float:left;height:100%;list-style:none;overflow-y: scroll;position:absolute;width:90%;" class="text-left pl-0" id="messages"></ul>
                                </v-container>
                                <v-card-actions class="pt-8"><v-text-field @keyup.enter="submit" autocomplete="off" @click:append="submit" v-model="text" append-icon="mdi-send" class="mt-n2" color="dark" label="Enviar mensaje ..." filled rounded></v-text-field></v-card-actions>
                            </v-card>
                        </v-container>
                        </v-card>
                </v-col>
            </v-row>
            <v-bottom-sheet v-model="infoUser" inset max-width="90%">
                <v-card color="indigo darken-1">
                    <v-container fluid class="py-0">
                        <v-row align="center">
                            <v-col cols="2" class="d-flex">
                                <v-avatar size="60"><v-img contain :aspect-ratio="16/9" :src="require(`~/assets/avatars/${game.image}.png`)" /></v-avatar>
                                <p class="ml-6 text-center ma-0 white--text"><span class="headline font-weight-bold">{{game.name.toUpperCase()}}</span> <br> <span><v-icon large color="success">mdi-cash</v-icon> {{game.cash}}</span></p>
                            </v-col>
                            <v-col align="center" cols="8" class="py-0">
                                <p class="text-center subtitle-1 mb-0 white--text font-weight-black">PROPIEDADES</p>
                                <v-slide-group class="px-4" center-active show-arrows prev-icon="mdi-arrow-left-bold-circle" next-icon="mdi-arrow-right-bold-circle">
                                    <v-slide-item v-for="n in game.properties" :key="n" v-slot:default="{ active, toggle }" >
                                        <v-card :color="active ? 'teal lighten-4' : 'white'" class="ma-4" height="50" width="121" @click="toggle" >
                                            <v-row class="fill-height" align="center" justify="center" >
                                                Propiedad {{n}}
                                            </v-row>
                                        </v-card>
                                    </v-slide-item>
                                    <v-sheet width="100%" v-if="game.properties.length==0" class="transparent white--text text-center">Ninguna al momento.</v-sheet>
                                </v-slide-group>
                            </v-col>
                            <v-col align="center" cols="2" class="py-0">
                                <p class="mb-0 white--text"><span class="font-weight-bold headline">{{game.freePass}}</span> <v-icon color="white" large>mdi-human-handsup</v-icon> <br> Salga libre de la carcel</p> 
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-bottom-sheet>
        </v-container>
        <v-snackbar v-model="snackbar" color="info" :timeout="1000"> {{ logSnackbar }} </v-snackbar>
        <v-dialog max-width="300px" v-model="dices">
            <v-container style="height:200px;" class="lime lighten-3">
                <v-sheet class="text-center title font-weight-bold">¡Resultado de dados!</v-sheet>
                <v-sheet class="text-center headline">{{sumdices}}</v-sheet>
                <v-row id="dicesbox" class="ml-11 mt-n3 text-center" ></v-row>
            </v-container>
        </v-dialog>
        <client-only>
            <v-dialog v-model="dialog" persistent max-width="600px">
                <v-card>
                    <v-card-title class="indigo lighten-1">
                        <span class="headline white--text">Uniendose al juego</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="6" md="8">
                                    <v-text-field v-model="name" label="Nombre" :rules="rules" hide-details="auto" counter maxlength="15" />
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
                        <v-btn color="blue darken-1" text @click="leaveGame">Abandonar</v-btn>
                        <v-btn color="blue darken-1" text :disabled="!name || name.length<3?true:false" @click="confirmDialog= true;">Empezar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="confirmDialog" persistent max-width="450">
                <v-card>
                    <v-card-title class="headline">New Multipolio's game!</v-card-title>
                    <v-card-text class="pt-2">
                        ¡Hola <strong>{{nameUC}}</strong>! <br> <br> 
                        Estas por iniciar un nuevo juego de Multipolio.<br>
                        Recuerda que esta plataforma está aún en desarrollo y de existir cualquier problema no dudes en informarnos. <br><br>
                        ¡Disfruta tu partida!
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="confirmDialog = false;">Cancelar</v-btn>
                    <v-btn color="green darken-1" text @click="joinGame">Ir a sala</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog persistent v-model="dialogProperty" max-width="320">
                <property :data="propertyData" @buyProperty="buyProperty" />
            </v-dialog>
        </client-only>
    </v-app>
</template>

<script>
import {mapState,mapActions} from 'vuex';
import Cookie from 'universal-cookie';
import properties from '~/assets/properties.json';
import boardGame from '~/components/board';
import property from '~/components/property';

export default {
    components:{
        'board-game': boardGame,
        'property': property
    },
    data: () => ({
        baseUrl: process.env.baseUrl,
        soundLoss:null,
        snackbar: false,
        active: false,
        dialog: false,
        confirmDialog: false,
        name: null,
        avatar: "1",
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
        logSnackbar: null,
        text:null,
        dices:false,
        sumdices:null,
        turn: 1,
        round: 1,
        positions: [],
        partialResults: [],
        dobleDice: 0,
        infoUser: false,
        properties,
        dialogProperty: false,
        propertyData: null
    }),
    beforeMount(){
        if(!this.game.name){
            this.avatars = this.avatars.filter(e=>this.avatarsUsed.indexOf(e.num)==-1);
            this.avatar = this.avatars[0].num;
            this.dialog=true;
        } else if(this.game.returning){
            this.$socket.client.emit('joinGame', {room:this.$route.params.id,name:this.game.name});
        }
        this.soundLoss = new Audio('./../losssong.mp3');
    },
    sockets: {
        getMessage({name,message}){
            let $message = document.getElementById('messages');
            $message.insertAdjacentHTML('beforeend',`<li><span class="subtitle-1 font-weight-bold">${name}</span>: ${message}</li>`);
            $message.scrollTop = $message.scrollHeight;
        },
        removeGame({idGame}){
            const cookies = new Cookie();
            cookies.remove('id',{path:'/'});
            this.logSnackbar = 'El creador de la sala te ha expulsado.';
            this.snackbar = true;
            this.$router.push({name:'index'});
            this.$socket.client.emit('activeStatus', {room:this.$route.params.id});
        },
        setPartials({dices,turn}){
            this.partialResults.push({turn,sum:dices});
        },
        askTR({name,room}){
            this.$socket.client.emit('answerTR', {name,room,turn:this.turn,round:this.round,positions:this.positions});
        },
        answerTR({name,turn,round,positions}){
            if(name==this.game.name){
                this.turn=turn;
                this.round=round;
                this.positions=[...positions]
            }
        },
        lossGame(id){
            this.soundLoss.play();
            setTimeout(()=>{
                this.$swal({
                    imageUrl: 'https://i.imgur.com/4uLgZl6.gif',
                    imageWidth: 400,
                    imageHeight: 200,
                    title: 'Alguien se rindió',
                    html: `El jugador ${this.game.players.filter(e=>e.idPlayer==id)[0].name.toUpperCase()} se rindió. <br> F en el chat.`,
                    onClose: () => {
                        this.soundLoss.pause();
                        this.soundLoss.currentTime = 0;
                    }
                })
            },2800)
        },
        someoneBuy({name,player}){
            this.$swal({
                toast:true,
                position: 'top',
                showConfirmButton: false,
                timer: 4000,
                icon: 'success',
                title: `¡${player.toUpperCase()} ha comprado ${name}!`
            });
            if(this.totalTurns==this.turn){
                this.turn=1;
                this.round=this.round+1;
            } else {
                this.turn=this.turn+1;
            }
            this.sumdices=null;
        },
        someoneNoBuy({room}){
            if(this.totalTurns==this.turn){
                this.turn=1;
                this.round=this.round+1;
            } else {
                this.turn=this.turn+1;
            }
            this.sumdices=null;
        },
        updateTurns({players}){
            this.$swal({
                position: 'center',
                showConfirmButton: false,
                timer: 4000,
                icon: 'info',
                title: 'Nuevos turnos',
                html: players
            })
        },
        getRollD({dices}){
            this.$swal({
                toast:true,
                position: 'top',
                showConfirmButton: false,
                timer: 4000,
                icon: 'warning',
                title: '¡Dobles! Se volverá a tirar'
            })
            this.dices=true;
            let $dicebox = document.getElementById('dicesbox');
            const response = (val) => { 
                this.sumdices=this.sumdices+val[0]+val[1];
            }
            if($dicebox){
                this.rollADie({element:$dicebox,numberOfDice:2,callback:response,delay:2500,values:[...dices]});
            } else {
                setTimeout(()=>{
                    $dicebox = document.getElementById('dicesbox');
                    this.rollADie({element:$dicebox,numberOfDice:2,callback:response,delay:2500,values:[...dices]});
                },100);            
            }
        },
        getRoll({dices,playerId}){
            this.dices=true;
            let $dicebox = document.getElementById('dicesbox');
            const response = (val) => { 
                this.sumdices=this.sumdices+val[0]+val[1];
                setTimeout(()=>{
                    this.dices=false;
                    if(this.round!=1){
                        let myPosition = this.positions.map(e=>e.id).indexOf(playerId);
                        let newPositions = this.newPosition(this.positions[myPosition],this.sumdices);
                        this.positions[myPosition].row=newPositions.row;
                        this.positions[myPosition].column=newPositions.column;
                    }
                    if(this.round==1){
                        if(this.totalTurns==this.turn){
                            this.turn=1;
                            this.round=this.round+1;
                        } else {
                            this.turn=this.turn+1;
                        }
                    }
                    this.sumdices=null;
                },2500);
            }
            if($dicebox){
                this.rollADie({element:$dicebox,numberOfDice:2,callback:response,delay:2500,values:[...dices]});
            } else {
                setTimeout(()=>{
                    $dicebox = document.getElementById('dicesbox');
                    this.rollADie({element:$dicebox,numberOfDice:2,callback:response,delay:2500,values:[...dices]});
                },100);            
            }
        },
        gameStarted({room}){
            this.positions = this.game.players.map(e=>{return {id:e.idPlayer,img:e.image,row:10,column:10}});
            const cookies = new Cookie();
            this.positions.push({id:cookies.get('id'),row:10,column:10,img:this.game.image});
            this.$swal({
                toast:true,
                position: 'top',
                showConfirmButton: false,
                timer: 4000,
                icon: 'info',
                title: 'El juego ha empezado, en esta ronda seleccionaremos los turnos.'
            })
        }
    },
    middleware: 'validgame',
    methods:{
        newPosition(position,dices,go){
            if(position.row == 0){
                if(position.column + dices > 10){
                    return this.newPosition({row:1,column:10},(dices+position.column-11),go)
                } else {
                    return {row:position.row,column:(position.column + dices),passGo:go}                   
                }
            } else if(position.row == 10){
                if(position.column - dices < 0){
                    return this.newPosition({row:9,column:0},(dices-position.column-1),go)
                } else {
                    return {row:position.row,column:(position.column - dices),passGo:go}
                }
            } else {
                if(position.column == 0){
                    if(position.row - dices < 0){
                        return this.newPosition({row:0,column:1},(dices-position.row-1),go)
                    } else {
                        return {row:(position.row-dices),column:position.column,passGo:go}
                    }
                } else if(position.column == 10) {
                    if(position.row + dices > 10 ){
                        return this.newPosition({row:10,column:9},(dices+position.row-11),true)
                    } else {
                        return {row:(position.row+dices),column:position.column,passGo:position.row+dices==10}
                    }
                }
            }
        },
        kindPlace(row,column){
            if(row==0){
                if(column==0){
                    return null
                } else if(column==2){
                    return 'chance'
                } else if(column==5){
                    return 'train'
                } else if(column==8){
                    return 'service'
                } else if(column==10){
                    return null
                } else {
                    return 'property'
                }
            } else if(row==10){
                if(column==0){
                    return null
                } else if(column==3){
                    return 'chance'
                } else if(column==5){
                    return 'train'
                } else if(column==6){
                    return 'tax'
                } else if(column==8){
                    return 'arc'
                } else if(column==10){
                    return null
                } else {
                    return 'property'
                }
            } else {
                if(column==0){
                    if(row==3){
                        return 'arc'
                    } else if(row==5){
                        return 'train'
                    } else if(row==8){
                        return 'service'
                    } else {
                        return 'property'
                    }
                } else if(column==10){
                    if(row==3){
                        return 'arc'
                    } else if(row==5){
                        return 'train'
                    } else if(row==6){
                        return 'chance'
                    } else if(row==8){
                        return 'tax1'
                    } else {
                        return 'property'
                    }
                }
            }
        },
        belongSomeone(row,column){
            let number = this.properties.filter(e=>e.row==row && e.col==column)[0].number;
            return this.game.players.map(e=>e.properties.map(r=>r.idProperty)).flat().indexOf(number) != -1
        },
        async buyProperty(val){
            const cookies = new Cookie();
            if(val.state){
                await this.buyPropertyG({idGame:this.$route.params.id,idPlayer:cookies.get('id'),num:val.number,price:val.price});
                this.$socket.client.emit('someoneBuy', {room:this.$route.params.id,name:val.name,player:this.game.name});
                this.dialogProperty = false;
                this.$swal({
                    toast:true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 4000,
                    icon: 'success',
                    title: `¡Has comprado ${val.name}!`
                })
            } else {
                this.$socket.client.emit('someoneNoBuy', {room:this.$route.params.id});
                this.dialogProperty = false;
            }
            this.sumdices=null;
            if(this.totalTurns==this.turn){
                this.turn=1;
                this.round=this.round+1;
            } else {
                this.turn=this.turn+1;
            }
        },
        async rollDice(){
            this.dices=true;
            let $dicebox = document.getElementById('dicesbox');
            const response = (val) => { 
                if(val[0]==val[1]){
                    this.dobleDice+=1;
                    if(this.dobleDice<3){
                        this.$swal({
                            toast:true,
                            position: 'top',
                            showConfirmButton: false,
                            timer: 4000,
                            icon: 'warning',
                            title: '¡Dobles! Se volverá a tirar'
                        })
                        this.$socket.client.emit('rollDobles', {room:this.$route.params.id,dices:val});
                        this.sumdices=this.sumdices+val[0]+val[1];
                        setTimeout(async ()=>{
                            $dicebox = document.getElementById('dicesbox');
                            this.rollADie({element:$dicebox,numberOfDice:2,callback:response,delay:2500});
                        },2500);
                    } else {
                        this.dices=false;
                        this.$socket.client.emit('rollDobles', {room:this.$route.params.id,dices:val});
                        this.$swal({
                            toast:true,
                            position: 'top',
                            showConfirmButton: false,
                            timer: 4000,
                            icon: 'error',
                            title: 'Ha sacado doble 3 veces, irás a la carcel.'
                        })
                        this.dobleDice=0;
                    }
                } else {
                    const cookies = new Cookie();
                    this.$socket.client.emit('rollDices', {room:this.$route.params.id,dices:val,playerId:cookies.get('id')});
                    this.sumdices=this.sumdices+val[0]+val[1];
                    if(this.round==1){
                        this.$socket.client.emit('setPartial', {room:this.$route.params.id,dices:this.sumdices,turn:this.turn});
                        this.partialResults.push({turn:this.turn,sum:this.sumdices});
                    }
                    setTimeout(async ()=>{
                        this.dices=false;
                        this.dobleDice=0;
                        if(this.round!=1){
                            let myPosition = this.positions.map(e=>e.id).indexOf(cookies.get('id'));
                            let newPositions = this.newPosition(this.positions[myPosition],this.sumdices);
                            this.positions[myPosition].row=newPositions.row;
                            this.positions[myPosition].column=newPositions.column;
                            let place = this.kindPlace(newPositions.row,newPositions.column);
                            if(place == 'property'){
                                this.propertyData = this.properties.filter(e=>e.row==newPositions.row && e.col==newPositions.column)[0];
                                this.dialogProperty = true;
                            } else {
                                this.sumdices=null;
                                if(this.totalTurns==this.turn){
                                    this.turn=1;
                                    this.round=this.round+1;
                                } else {
                                    this.turn=this.turn+1;
                                }
                            }
                        } else {
                            this.sumdices=null;
                            if(this.totalTurns==this.turn){
                                this.turn=1;
                                this.round=this.round+1;
                                if(this.round==2){
                                    let playersNT = await this.updateT({idGame:this.$route.params.id,partialResults:this.partialResults});
                                    this.$socket.client.emit('updateOthers', {room:this.$route.params.id});
                                    await this.updateMyself(this.$route.params.id)
                                    this.$socket.client.emit('updateTurns', {room:this.$route.params.id,playersNT});
                                    let playersString = playersNT.sort((a,b)=>a.turn-b.turn).map(e=>`Turno ${e.turn} - ${e.name}<br>`).toString().replace(/,/g,'')
                                    this.$swal({
                                        position: 'center',
                                        showConfirmButton: false,
                                        timer: 4000,
                                        icon: 'info',
                                        title: 'Nuevos turnos',
                                        html: playersString
                                    })
                                }
                            } else {
                                this.turn=this.turn+1;
                            }
                        }
                    },2500);
                }
            }
            if($dicebox){
                this.rollADie({element:$dicebox,numberOfDice:2,callback:response,delay:2500});
            } else {
                setTimeout(()=>{
                    $dicebox = document.getElementById('dicesbox');
                    this.rollADie({element:$dicebox,numberOfDice:2,callback:response,delay:2500});
                },100);            
            }
        },
        copyUrl(){
            let copyText = document.getElementById('urlFriends');
            copyText.select();
            document.execCommand('copy');
            this.logSnackbar = 'Texto copiado';
            this.snackbar = true;
        },
        leaveGame(){
            this.$router.push({name:'index'});
        },
        async gg(){
            this.soundLoss.play();
            const cookies = new Cookie();
            await this.loseGameG({idGame:this.$route.params.id,idPlayer:cookies.get('id')});
            this.$socket.client.emit('lossGame', {room:this.$route.params.id,id:cookies.get('id')});
            setTimeout(()=>{
                this.$swal({
                    imageUrl: 'https://i.imgur.com/4uLgZl6.gif',
                    imageWidth: 400,
                    imageHeight: 200,
                    title: 'Alguien se rindió',
                    html: `El jugador ${this.game.name.toUpperCase()} se rindió. <br> F en el chat.`,
                    onClose: () => {
                        this.soundLoss.pause();
                        this.soundLoss.currentTime = 0;
                        this.$router.push({name:'index'});
                        cookies.remove('id',{path:'/'});
                    }
                }).then((result)=>{
                    if(result.value){
                        this.$router.push({name:'index'});
                        cookies.remove('id',{path:'/'});
                    }
                });
            },2800)
        },
        async joinGame(){
            const cre = await this.setupGame({name:this.name,avatar:this.avatar,id:this.$socket.client.id,idGame:this.$route.params.id});
            this.dialog = false;
            this.confirmDialog = false;
            this.logSnackbar = cre;
            this.snackbar = true;
        },
        submit(){
            if(this.text){
                let $message = document.getElementById('messages');
                $message.insertAdjacentHTML('beforeend',`<li><span class="subtitle-1 font-weight-bold">${this.game.name}</span>: ${this.text}</li>`);
                $message.scrollTop = $message.scrollHeight;
                this.$socket.client.emit('sendMessage', {room:this.$route.params.id,name:this.game.name,message:this.text});
                this.text=null;
            }
        },
        async removePlayer(id){
            await this.removeFG({idGame:this.$route.params.id,id});
            this.$socket.client.emit('removePlayer', {room:this.$route.params.id,id});
        },
        async startGame(){
            await this.startGM({idGame:this.$route.params.id});
            this.$socket.client.emit('activeStatus', {room:this.$route.params.id});
            this.$socket.client.emit('gameStarted', {room:this.$route.params.id});
            this.positions = this.game.players.map(e=>{return {id:e.idPlayer,img:e.image,row:10,column:10}});
            const cookies = new Cookie();
            this.positions.push({id:cookies.get('id'),row:10,column:10,img:this.game.image});
            this.$swal({
                toast:true,
                position: 'top',
                showConfirmButton: false,
                timer: 4000,
                icon: 'info',
                title: 'El juego ha empezado, en esta ronda seleccionaremos los turnos.'
            })
        },
        ...mapActions({
            setupGame: 'game/joinGame',
            updateStatus: 'game/updateStatus',
            removeFG: 'game/removePlayer',
            startGM: 'game/startGame',
            updateT: 'game/updateTurns',
            updateMyself: 'game/updateMyself',
            loseGameG: 'game/loseGame',
            buyPropertyG: 'game/buyProperty'
        })
    },
    computed:{
        nameUC(){
            return this.name?this.name.toUpperCase():this.name;
        },
        totalTurns(){
            return this.game.players.length+1;
        },
        turnWho(){
            return this.game.players.filter(e=>e.turn==this.turn).length==0?this.game.name.toUpperCase():this.game.players.filter(e=>e.turn==this.turn)[0].name.toUpperCase();
        },
        canRoll(){
            return this.game.players.filter(e=>e.turn==this.turn).length==0;
        },
        ...mapState({
            game: state => state.game,
            avatarsUsed: state => state.game.avatarsUsed
        })
    },
    watch:{
        async active(val){
            await this.updateStatus({idGame:this.$route.params.id,status:val});
            this.$socket.client.emit('activeStatus', {room:this.$route.params.id});
        }
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
.inputSwitch {
    .v-input--is-label-active label {
        color: white;
        font-weight: 450;
    }
    .v-input--switch label {
        color: white;
    }
}

.swal2-error{
    border-color: transparent !important;
    .swal2-icon-content{
        font-size: 6em !important;
    }
}
</style>