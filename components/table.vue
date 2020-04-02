<template>
    <v-container class="pa-0">
        <v-row justify="center" :key="indexRow" v-for="(row, indexRow) in 11">
            <v-col :style="styleColumn(indexRow,indexColumn)" cols="auto" class="pa-0" :key="`${indexRow}${indexColumn}`" v-for="(column, indexColumn) in 11">
                <v-card style="border:0.05em solid black;" height="100%" color="#cde6d0" v-if="indexRow==0 || indexRow==10 || indexColumn==0 || indexColumn==10" >
                    <template v-if="dataCard(indexRow,indexColumn).color">
                        <div style="height:100%;" class="d-flex align-center flex-column">
                            <v-sheet width="100%" :color="dataCard(indexRow,indexColumn).color">&nbsp;</v-sheet>
                            <v-sheet style="font-size:9px;" color="#cde6d0" class="text-center font-weight-bold">{{dataCard(indexRow,indexColumn).name}}</v-sheet>
                            <v-sheet style="font-size:10px;" color="#cde6d0" class="mt-auto">Precio ${{dataCard(indexRow,indexColumn).price}}</v-sheet>
                        </div>
                    </template>
                    <template v-else-if="!dataCard(indexRow,indexColumn).type || dataCard(indexRow,indexColumn).type!='specialA'">
                        <v-sheet color="#cde6d0" style="font-size:10px" class="text-center font-weight-medium">{{dataCard(indexRow,indexColumn).name}}</v-sheet>
                        <v-img contain :aspect-ratio="imgCard(indexRow,indexColumn).ratio"  :src="require(`~/assets/board/${imgCard(indexRow,indexColumn).img}.png`)"></v-img>
                        <v-sheet v-if="dataCard(indexRow,indexColumn).price" color="#cde6d0" style="font-size:10px" class="text-center">Precio ${{dataCard(indexRow,indexColumn).price}}</v-sheet>
                        <v-sheet v-if="imgCard(indexRow,indexColumn).text" color="#cde6d0" style="font-size:9px" class="pt-2 text-center">{{imgCard(indexRow,indexColumn).text}}</v-sheet>
                    </template>
                    <template v-else>
                        <v-img contain :aspect-ratio="specialCard(indexRow,indexColumn).ratio"  :src="require(`~/assets/board/${specialCard(indexRow,indexColumn).img}`)"></v-img>
                    </template>
                </v-card>
            </v-col>    
        </v-row>
    </v-container>
</template>

<script>
import properties from '~/assets/properties.json';

export default {
    data: () => ({
        properties
    }),
    computed:{
        dataCard(){
            return (row,col) => { return this.properties.filter(e=>e.row==row && e.col==col)[0] }
        },
        imgCard(){
            return (row,col) => {
                let card = this.dataCard(row,col);
                if(card.number){
                    if(card.number==23){
                        return {img:'electricity',ratio:16/6}
                    } else if(card.number==24){
                        return {img:'water',ratio:16/6}
                    } else {
                        return {img:'train',ratio:16/6}
                    }
                } else if(card.name=='Arca Comunal'){
                    return {img:'chest',ratio:4/3}
                } else if(card.name=='Casualidad'){
                    return {img:'chance',ratio:4/3}
                } else if(card.name=='Impuestos por lujos'){
                    return {img:'tax',ratio:16/4,text:'Paga $75'}
                } else {
                    return {img:'tax1',ratio:16/4,text:'Paga 10% o $200'}
                }
            }
        },
        specialCard(){
            return (row,col) => {
                let card = this.dataCard(row,col);
                if(card.name=='Free Parking'){
                    return {img: 'parking.png',ratio:1/1}
                } else if(card.name=='Go to jail'){
                    return {img: 'jail.png',ratio:1/1}
                } else if(card.name=='Jail'){
                    return {img: 'prision.jpg',ratio:1/1}
                } else {
                    return {img: 'go.jpg',ratio:1/1}
                }
            }
        },
        styleColumn(){
            return (row,col) => {
                if(row==0 || row==10){
                    if(col==0 || col==10){ 
                        return 'height:76.6px;width:76.6px !important;background-color:#cde6d0;'
                    } else {
                        return `height:76.6px;width:76.6px; !important;background-color:#cde6d0;transform: rotate(${row==0?'180':'0'}deg)`
                    }
                } else {
                    if(col==0 || col==10){
                        return `height:76.6px;width:76.6px !important;background-color:#cde6d0;transform: rotate(${col==0?'90':'-90'}deg)`
                    } else {
                        return 'height:76.6px;width:76.6px;background-color:#cde6d0;'
                    }
                }
            }
        }
    }    
}
</script>