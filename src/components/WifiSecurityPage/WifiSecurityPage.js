 /* eslint-disable   react-hooks/exhaustive-deps */
 /* eslint-disable    no-use-before-define */
 /* eslint-disable   no-shadow */
import css from "./WifiSecurityPage.module.less";
import Heading from '@enact/sandstone/Heading';
import CheckboxItem from '@enact/sandstone/CheckboxItem';
import Button from '@enact/sandstone/Button';
import { InputField } from '@enact/sandstone/Input';
import { useDispatch, useSelector } from "react-redux";
import { connectingWifi } from "../../actions/wifiActions";
import { useCallback, useEffect, useState } from "react";
import { CLEAR_SECURITY_PAGE, SET_WIFI_ERROR_MESSAGE } from "../../actions/actionNames";
import { findMsgByErrorCode } from '../../views/utils/NetworkCommon';

const WifiSecurityPage = () => {
    const showSecurityPage = useSelector(state => state.showSecurityPage);
    const parseNetworkError = useSelector(state => state.setWifiErrorMessage)
    const [type, setType] = useState('password');
    const [value, setValue] = useState('');
    const [errorMessage, setErrorMessage] = useState(null)
    const dispatch = useDispatch();
    const connectWifiHandler = useCallback(() => {
        // clear current error if any when click on connect button
        setErrorMessage(null);

        console.log("connectWifiHandler function triggered ===========>")
        let params = {
            ssid: showSecurityPage.ssid,
            security: {
                securityType: showSecurityPage.securityType,
                simpleSecurity: {
                    passKey: value
                }
            }
        };
        dispatch((connectingWifi(params)));

        //clearing previous error messages if any.
        dispatch({
            type: SET_WIFI_ERROR_MESSAGE,
            payload: null
        });
    }, [dispatch, showSecurityPage, value])
    const changeTypeHandler = useCallback(({ selected }) => {
        console.log("changeTypeHandler =========>")
        if (selected) {
            setType('text');
        } else {
            setType('password');
        }
    }, [])
    const onChangeHanlder = useCallback((event) => {
        console.log("onChange function entered ========>", errorMessage)
        //errorMessage is nullified as soon as we start typing.
        setErrorMessage(null)

        setValue(event.value)
    }, [])

    useEffect(() => {
        console.log("useEffect entered ==============> ", parseNetworkError)
        if (parseNetworkError) {
            if (
                typeof parseNetworkError.errorText === 'string' &&
                parseNetworkError.errorText.length > 0
            ) {
                if (parseNetworkError.errorText === 'NO_ERROR') {
                                       dispatch({
                        type: CLEAR_SECURITY_PAGE
                    });                  
                }
            }
            else {
                parseErrorMessage(parseNetworkError);
            }
        }
    }, [parseNetworkError,dispatch])


    const parseErrorMessage = (parseNetworkError) => {
        let msg;
        if (parseNetworkError && parseNetworkError.errorCode) {
            msg = findMsgByErrorCode(parseNetworkError.errorCode);
        }
        // return msg;
        setErrorMessage(msg)
    };


    // console.log("showSecurityPage:", showSecurityPage);
    // console.log("setWifiErrorMessage ==> ", parseNetworkError)

    console.log("errorMessage ==> ", errorMessage)

    return (
        <div className={css.wifiPopup}>
            <div className={css.row}>
                <Heading size='small' className={css.label}>
                    Network
                </Heading>
                <Heading data-component-id={'wifiSsid'} className={css.item}>
                    {showSecurityPage.displayName || showSecurityPage.ssid}
                </Heading>
            </div>
            <div className={css.row}>
                <Heading size='small' className={css.label}>Password</Heading>
                <InputField value={value} onChange={onChangeHanlder} type={type} className={css.inputField} />
            </div>
            <CheckboxItem onToggle={changeTypeHandler} className={css.showPassword}>Show Password</CheckboxItem>
            <div className={css.center}>
                <Button data-component-id={'wifiConnectBtn'}
                    onClick={connectWifiHandler}
                    size="small"
                >Connect</Button>
            </div>
            {errorMessage && <>
                <div className={css.wifiErrorMessage}>
                    {errorMessage.map((line, index) => {
                        return (
                            <span key={index} className={css.wifiErrorLine}>
                                {line}
                                <br />
                            </span>
                        );
                    })}
                </div>
            </>}
        </div>
    )
}
export default WifiSecurityPage;