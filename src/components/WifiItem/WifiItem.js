import { useDispatch, useSelector } from "react-redux";
import Image from '@enact/sandstone/Image';
import Spinner from '@enact/sandstone/Spinner';
import BodyText from '@enact/sandstone/BodyText';
import wifi_connected from '../../../assets/wifi_connected.png';
import wifi_notconnected from '../../../assets/wifi_notconnected.png';
import css from "./WifiItem.module.less";
import { useCallback, useEffect, useState, } from "react";
import { connectingWifi } from "../../actions/wifiActions";
import { SET_WIFI_ERROR_MESSAGE, SHOW_SECURITY_PAGE } from "../../actions/actionNames";

const WifiItem = ({ connectState, displayName, profileId, availableSecurityTypes, ssid }) => {
    const [progress, setProgress] = useState('');
    const [status, setStatus] = useState('NOT_CONNECTED')
    const wifiStatus = useSelector(state => state.wifiStatus);
    useEffect(() => {
        console.log('connectState:', connectState);
        if (connectState === 'ipConfigured') {
            setStatus('CONNECTED');
            setProgress('');
        } else if (connectState === 'associating' || connectState === 'associated') {
            setProgress('CONNECTING');
        } else {
            setStatus('NOT_CONNECTED');
            setProgress('');
        }
    }, [connectState])
    useEffect(() => {
        if (wifiStatus.state === 'connected' && wifiStatus.ssid === ssid) {
            setStatus('CONNECTED');
            setProgress('');
        }
    }, [wifiStatus, ssid]);
    const dispatch = useDispatch();
    //will uncomment after VKB issue fix
    const onClickHandler = useCallback(() => {
        let securityType = 'none';
        if (Array.isArray(availableSecurityTypes) && availableSecurityTypes.length > 0 && availableSecurityTypes[0] !== 'none') {
            securityType = availableSecurityTypes[0];
        }
        if (status === 'NOT_CONNECTED') { //Not Connected
            if (!profileId && securityType !== 'none') {
                dispatch({
                    type: SHOW_SECURITY_PAGE,
                    payload: {
                        profileId,
                        securityType,
                        ssid,
                        displayName,
                        show: true
                    }
                });

                dispatch({
                    type: SET_WIFI_ERROR_MESSAGE,
                    payload: null
                });

            } else {
                const param = {};
                if (typeof profileId === 'number') {
                    param.profileId = profileId;
                } else {
                    param.ssid = ssid;
                }
                dispatch((connectingWifi(param)));
            }
        } else {
            //delete wifi need to handle here
        }
    }, [dispatch, availableSecurityTypes, profileId, ssid, displayName, status])
    return (<div className={css.container} onClick={onClickHandler}>
        <Image className={css.icon} src={status === "CONNECTED" ? wifi_connected : wifi_notconnected} />
        <BodyText
            size="small"
            spacing="small"
            className={css.name}
        >
            {displayName || profileId}
        </BodyText>
        {progress === 'CONNECTING' ? <span className={css.loading}><Spinner size="small" /> </span> : ""}
    </div>)
}

export default WifiItem;