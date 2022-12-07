import service from '../services/service';
import { CLEAR_LOADING, LOADING_WIFI_LIST, SET_WIFI_LIST, SET_WIFI_STATE, SET_WIFI_STATUS, SET_WIFI_ERROR_MESSAGE } from './actionNames';

export const getWifiStatus = () => (dispatch) => {
    service.getWifiStatus({
        subscribe: true,
        onSuccess: (res) => {
            console.log('getWifiStatus res: ', res)
            dispatch({
                type: SET_WIFI_STATUS,
                payload: { ...res.wifi }
            })
        }
    });
}

export const getWifiState = () => (dispatch) => {
    console.log("getWifiState API called ===>")
    service.gettWifiState({
        subscribe: true,
        onSuccess: (res) => {
            if (res.returnValue) {
                dispatch({
                    type: SET_WIFI_STATE,
                    payload: (res.status === 'serviceEnabled' || res.status === 'connectionStateChanged')
                })
            }
        }
    });
}
export const enableWifi = (state) => (dispatch) => {
    console.log("enableWifi API called ===>", state)
    if (state) {
        dispatch({ type: LOADING_WIFI_LIST })
    } else {
        dispatch({ type: CLEAR_LOADING })
    }
    dispatch({
        type: SET_WIFI_STATE,
        payload: state
    })
    service.setWifiState({
        wifi: state ? 'enabled' : 'disabled',
        onSuccess: (res) => {
            console.log('enableWifi res: ', res)
        }
    });
}

export const findWifiNetworks = () => (dispatch) => {
    console.log("findWifiNetworks API is called ======>")
    service.findWifiNetworks({
        subscribe: true,
        onSuccess: (res) => {
            console.log("findWifiNetworks API result is ==> ", res)
            if (res.returnValue) {
                dispatch({
                    type: SET_WIFI_LIST,
                    payload: [...res.foundNetworks]
                })
                console.log("findWifiNetworks API result is ==> ", res)
            }
        },
        onFailure: (res) => {
            console.log("Wifi call onFailure ==> ", res)
        }
    });
}

export const connectingWifi = (params) => (dispatch) => {
    console.log("connectingWifi:  ", params)
    service.connectingWifi({
        ...params,
        onComplete: (res) => {
            const obj = {};
            if (res.returnValue) {
                obj.errorText = 'NO_ERROR';
            } else if (res.errorText) {
                obj.errorText = res.errorText;
            } else {
                obj.errorText = '';
            }
            obj.errorCode = res.errorCode || -1;
            console.log("connectingWifi API executed with result ======> ", obj)
            dispatch({
                type: SET_WIFI_ERROR_MESSAGE,
                payload: obj
            });
        }
    });
}

