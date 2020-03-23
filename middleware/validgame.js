import Cookies from 'universal-cookie';

export default async function({store,route,error,req}){
    let cookies;
    if(process.server){
        cookies = new Cookies(req.headers.cookie);
    } else {
        cookies = new Cookies();
    }
    if(route.params.id.length!=24){
        error({
            message: 'Este juego no existe',
            statusCode: 404
        })
    }
    if(!store.state.game.name){
        const res = await fetch(`${process.env.baseUrl}/api/game/${cookies.get('id')?'':'valid/'}${route.params.id}`,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        });
        const data = await res.json();
        if(!data){
            error({
                message: 'El juego no existe',
                statusCode: 404
            })
        } else if(cookies.get('id')){
            await store.dispatch('game/updateStatus',{idGame:route.params.id,status:false,cookies:cookies.get('id')});
            await store.dispatch('game/returnGame',{data,id:cookies.get('id')});
        } else if(data.error){
            error({
                message: 'Los jugadores ya estan completos',
                statusCode: 404
            })
        } else if(data.start){
            error({
                message: 'El juego ya inicio.',
                statusCode: 404
            })
        }
    }
}