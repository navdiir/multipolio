export const state = () => ({
    name: null
})

export const mutations = {
    setName(state,val){
        state.name = val;
    }
}

export const actions = {
    setName({commit},val){
        commit('setName',val);
    }
}

export const getters = {

}