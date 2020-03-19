export const state = () => ({
    cantPlayers: null
})

export const mutations = {
    setCantPlayers(state,val){
        state.cantPlayers = val;
    }
}

export const actions = {
    setCantPlayers({commit},val){
        commit('setCantPlayers',val);
    }
}

export const getters = {

}