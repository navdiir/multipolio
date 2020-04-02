import Cookies from 'universal-cookie';

export const state = () => ({
    name: null,
    cash: null,
    freePass: null,
    active: false,
    loss: false,
    turn: null,
    image: null,
    properties: [],
    players: [],
    totalPlayers: null,
    start: false,
    creator: false,
    returning: false,
    avatarsUsed: []
})

export const mutations = {
    setAvatarsUsed(state,val){
        state.avatarsUsed = [...val];
    },
    setupGame(state,val){
        let me = val.data.players.filter(e=>e.idPlayer==val.id)[0];
        let others = val.data.players.filter(e=>e.idPlayer!=val.id);
        state.name = me.name;
        state.cash = me.cash;
        state.freePass = me.freePass;
        state.turn = me.turn;
        state.image = me.image;
        state.active = me.active;
        state.loss = me.loss;
        state.creator = me.creator;
        state.properties = [...me.properties];
        state.players = [...others];
        state.totalPlayers = val.data.totalPlayers-1;
        state.start = val.data.start;
    },
    updatePlayers(state,val){
        state.start = val.start;
        const cookies = new Cookies();
        let others = val.players.filter(e=>e.idPlayer!=cookies.get('id'));
        state.players = [...others];
    },
    updateMyself(state,val){
        const cookies = new Cookies();
        let me = val.players.filter(e=>e.idPlayer==cookies.get('id'))[0];
        let others = val.players.filter(e=>e.idPlayer!=cookies.get('id'));
        state.name = me.name;
        state.cash = me.cash;
        state.freePass = me.freePass;
        state.turn = me.turn;
        state.image = me.image;
        state.active = me.active;
        state.loss = me.loss;
        state.creator = me.creator;
        state.properties = [...me.properties];
        state.players = [...others];
        state.totalPlayers = val.totalPlayers-1;
        state.start = val.start;
    },
    playerReturn(state,val){
        state.returning = val;
    },
    startGame(state,val){
        state.start = val;
    }
}

export const actions = {
    setAvatarsUsed({commit},val){
        commit('setAvatarsUsed',val);
    },
    setupGame({commit},val){
        return new Promise(async (res,rej)=>{
            const res1 = await fetch('/api/game/create',{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(val)
            });
            const data = await res1.json();
            commit('setupGame',{data,id:val.id});
            this._vm.$socket.client.emit('joinGame', {room:data._id});
            const cookies = new Cookies();
            cookies.set('id',val.id,{path:'/',maxAge: (24*60*60*1000)})
            res({id:data._id});
        });
    },
    returnGame({commit},val){
        return new Promise( async (res,rej)=>{
            commit('setupGame',val);
            commit('playerReturn',true);
            res('ok');
        });
    },
    joinGame({commit},val){
        return new Promise(async (res,rej)=>{
            const res1 = await fetch(`/api/game/join/${val.idGame}`,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify(val)
            });
            const data = await res1.json();
            commit('setupGame',{data,id:val.id});
            const cookies = new Cookies();
            cookies.set('id',val.id,{path:'/',maxAge: (24*60*60*1000)});
            this._vm.$socket.client.emit('joinGame', {room:val.idGame,name:val.name});
            res({creator:data.players.filter(e=>e.creator)[0].name});
        });
    },
    updateStatus({commit},val){
        return new Promise(async (res,rej)=>{
            let cookies = new Cookies();
            await fetch(`${process.server?process.env.baseUrl:''}/api/game/updateStatus/${val.idGame}`,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify({idPlayer:val.cookies?val.cookies:cookies.get('id'),status:val.status})
            });
            res('ok')
        });
    },
    removePlayer({commit},val){
        return new Promise(async (res,rej)=>{
            await fetch(`/api/game/removePlayer/${val.idGame}`,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify({idPlayer:val.id})
            });
            res('ok')
        });
    },
    startGame({commit},val){
        return new Promise(async (res,rej)=>{
            await fetch(`/api/game/startGame/${val.idGame}`,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'PUT'
            });
            commit('startGame',true);
            res('ok')
        });
    },
    loseGame({commit},val){
        return new Promise(async (res,rej)=>{
            await fetch(`/api/game/lose/${val.idGame}/${val.idPlayer}`,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'PUT'
            });
            res('ok');
        })
    },
    updateTurns({commit},val){
        return new Promise(async (res,rej)=>{
            const res1 = await fetch(`/api/game/updateTurns/${val.idGame}`,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify({partials:val.partialResults})
            });
            const data = await res1.json();
            res(data.players);
        });
    },
    updateMyself({commit},message){
        return new Promise(async (res,rej)=>{
            const res1 = await fetch(`/api/game/${message}`,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            });
            const data = await res1.json();
            commit('updateMyself',data);
            res('ok')
        });
    },
    async socket_updatePlayers({commit},message){
        const res = await fetch(`/api/game/${message}`,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        });
        const data = await res.json();
        commit('updatePlayers',data);
    },
    async socket_updateOthers({commit},message){
        const res = await fetch(`/api/game/${message}`,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        });
        const data = await res.json();
        commit('updateMyself',data);
    }
}

export const getters = {

}