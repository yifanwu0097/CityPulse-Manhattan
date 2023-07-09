import { createStore } from 'vuex';

const userObj = {
  name: " ",
  birthday: "",
  introduction: "",
  gender: "",
  username: "",
  email: "",
  phoneNumber: "",
  avatar:"0"
}

const poiObj = [{
  id: "00",
  name: null
}]

const store = createStore({
  state() {
    return {
      sideBarShow: false,
      auth:false,
      userName: "",
      infoWindowShow: false,
      userInfo: userObj,
      poiInfo: poiObj,
      locationID:"",
      poiList:[]
    };
  },
  mutations: {
    setSideBarShow(state, value) {
      state.sideBarShow = value;
    },
    setUserName(state, value) {
      state.userName = value;
    },
    setInfoWindowShow(state, value) {
      state.infoWindowShow = value;
    },
    setUserInfo(state, obj){
      state.userInfo = obj
    },
    setPoiInfo(state,obj){
      state.userInfo = obj
    },
    setLocationID(state, value){
      state.locationID = value
    },
    setAuth(state, value){
      state.auth = value
    },
    setPoiList(state, obj){
      state.poiList = obj
    }
  },
  actions: {
    updateUserName({ commit }, value) {
      commit('userName', value);
    }
  }
});

export default store;
