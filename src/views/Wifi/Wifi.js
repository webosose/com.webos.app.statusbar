 /* eslint-disable  react/self-closing-comp */
import SwitchItem from '@enact/sandstone/SwitchItem';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VirtualList from '@enact/sandstone/VirtualList';
import ri from '@enact/ui/resolution';
import { enableWifi, findWifiNetworks, getWifiStatus } from '../../actions/wifiActions';
import css from "./Wifi.module.less";
import WifiItem from '../../components/WifiItem/WifiItem';
import Popup from '@enact/sandstone/Popup';
import Heading from '@enact/sandstone/Heading';
import WifiSecurityPage from '../../components/WifiSecurityPage/WifiSecurityPage';
import Icon from "@enact/sandstone/Icon";
import { CLEAR_SECURITY_PAGE, SET_WIFI_ERROR_MESSAGE, SET_WIFI_LIST } from '../../actions/actionNames';
import Spinner from '@enact/sandstone/Spinner';

const Wifi = () => {
    const wifiState = useSelector(state => state.wifiState);
    const wifiList = useSelector(state => state.wifiList);
    const showSecurityPage = useSelector(state => state.showSecurityPage);
    const loadingWifiList = useSelector(state => state.loadingWifiList);
    // const setWifiErrorMessage = useSelector(state => state.setWifiErrorMessage)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getWifiStatus());
        // dispatch(getWifiState()); // Get Wifi state enabled or disabled
        dispatch(findWifiNetworks());
        // dispatch(enableWifi(true));
    }, [dispatch])

    const onWifiChangeHander = useCallback(({ selected }) => {
        if (!selected) {
            dispatch({ type: SET_WIFI_LIST, payload: [] })
        }
        // dispatch(enableWifi(selected));
        dispatch(enableWifi(selected));
    }, [dispatch])

    const setWirelessItem = useCallback(({ index }) => {
        return (
            <WifiItem
                key={index}
                dataIndex={index}
                {...wifiList[index].networkInfo}
                data-component-id="wirelessItem"
            />
        );
    }, [wifiList]);

    //called when WifiSecurityPopup is closed manually.
    const closePopupHandler = useCallback(() => {
        dispatch({
            type: CLEAR_SECURITY_PAGE
        });
        dispatch({
            type: SET_WIFI_ERROR_MESSAGE,
            payload: null
        });
    }, [dispatch])

    return <div className={css.container}>
        <SwitchItem className={css.switchItem} selected={wifiState} onToggle={onWifiChangeHander}>Wi-Fi</SwitchItem>
        {(wifiState && !wifiList.length) ? <div className={css.loadingCnt}>
            <Spinner>Loading Wi-Fi list</Spinner>
        </div>
            : (wifiState && wifiList.length) ? <VirtualList className={css.wifiList}
                dataSize={wifiList.length}
                itemSize={ri.scale(140)}
                itemRenderer={setWirelessItem} /> : <div className={css.loadingCnt}></div>}
        <Popup position="center" noAnimation noAutoDismiss open={showSecurityPage.show} className={css.wifiPopupStyles} onHide={closePopupHandler}>
            <div className={css.header}>
                <Heading size="small" className={css.title}>Wi-Fi Security</Heading>
                <Icon className={css.closeicon} onClick={closePopupHandler}>closex</Icon>
            </div>
            <WifiSecurityPage />
        </Popup>
    </div>
}
export default Wifi;