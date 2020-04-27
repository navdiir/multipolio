<template>
    <v-container style="background-color:white">
        <v-card style="border: 1px solid black">
            <p class="mt-3 mx-3 mb-0 text-center overline" :style="`background-color:${data.color}`">TÍTULO DE PROPIEDAD</p>
            <p class="mb-3 mx-3 text-center title font-weight-black" :style="`background-color:${data.color}`">{{data.name}}</p>
            <p class="text-center body-1 font-weight-bold">ALQUILER ${{data.price}}</p>
            <v-row><v-col cols="4 offset-2" class="py-0 body-2">Con 1 Casa</v-col><v-col cols="4 offset-1" class="py-0 body-2 text-center">${{data['1h']}}</v-col></v-row>
            <v-row><v-col cols="4 offset-2" class="mt-1 py-0 body-2">Con 2 Casas</v-col><v-col cols="4 offset-1" class="mt-1 py-0 body-2 text-center">${{data['2h']}}</v-col></v-row>
            <v-row><v-col cols="4 offset-2" class="mt-1 py-0 body-2">Con 3 Casas</v-col><v-col cols="4 offset-1" class="mt-1 py-0 body-2 text-center">${{data['3h']}}</v-col></v-row>
            <v-row><v-col cols="4 offset-2" class="mt-1 py-0 body-2">Con 4 Casas</v-col><v-col cols="4 offset-1" class="mt-1 py-0 body-2 text-center">${{data['4h']}}</v-col></v-row>
            <v-row><v-col cols="4 offset-2" class="mt-1 py-0 body-2">Con Hotel</v-col><v-col cols="4 offset-1" class="mt-1 py-0 body-2 text-center">${{data['1H']}}</v-col></v-row>
            <p class="my-3 text-center body-1 font-weight-bold">Valor de Hipoteca ${{data.mortgaged}}</p>
            <p class="mb-0 text-center body-2">Cada Casa cuesta ${{data.priceh}}</p>
            <p class="text-center body-2">Cada Hotel cuesta ${{data.priceH}} más 4 Casas</p>
            <p style="font-size:10px;" class="mx-6 text-center">Si un jugador posee todos los Solares de un grupo de color, el precio del alquiler se duplica en los solares sin edificar del grupo.</p>
            <!-- <v-card-actions>
                <span>¿Deseas comprar esta propiedad?</span>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="$emit('buyProperty',false)">No</v-btn>
                <v-btn color="green darken-1" text @click="$emit('buyProperty',true)">Si</v-btn>
            </v-card-actions> -->
        </v-card>
        <v-row align="center">
            <v-col class="pb-0" align="center" cols="5 offset-1"><span class="caption">¿Deseas comprar esta propiedad?</span></v-col>
            <v-col class="pb-0" align="center" cols="2"><v-btn color="green darken-1" text @click="$emit('buyProperty',{state:false})">No</v-btn></v-col>
            <v-col class="pb-0" align="center" cols="2"><v-btn color="green darken-1" text @click="$emit('buyProperty',{state:true,number:data.number,price:data.price,name:data.name})">Si</v-btn></v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    props: ['data']
}
</script>