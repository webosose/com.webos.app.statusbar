import { combineReducers } from 'redux';
import volume from './volume';
import appState from './appState';
import { wifiError, wifiList, wifiStatus, wifiState, showSecurityPage, loadingWifiList,setWifiErrorMessage } from './wifi';
import osinfo from './osinfo';

const rootReducer = combineReducers({
    volume,
    appState,
    wifiStatus,
    wifiState,
    wifiList,
    wifiError,
    showSecurityPage,
    osinfo,
    loadingWifiList,
    setWifiErrorMessage
});

export default rootReducer;