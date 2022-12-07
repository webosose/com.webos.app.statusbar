 /* eslint-disable  react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import ThemeDecorator from "@enact/sandstone/ThemeDecorator";
import MainPanel from "../views/MainPanel";
import css from "./App.module.less";
import Transition from "@enact/ui/Transition";
import { useDispatch, useSelector } from "react-redux";
import { getVolume } from "../actions/volume";
import { SHOW_APP } from "../actions/actionNames";
import getOSInfo from "../actions/getOSInfo";
import { getWifiState } from "../actions/wifiActions";

const App = () => {
  const appShow = useSelector(state => state.appState);
  const [curreentLanguage, setCurreentLanguage] = useState("");
  const dispatch = useDispatch();
  const onShowHandler = useCallback(() => {
    dispatch({
      type: SHOW_APP,
      payload: true
    });
  }, [dispatch])

  useEffect(() => {
    if (!document.hidden && !appShow) {
      setTimeout(() => {
        dispatch({
          type: SHOW_APP,
          payload: true
        });
      }, 1000);
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(getWifiState()); // Get Wifi state enabled or disabled
  }, [dispatch])


  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.addEventListener('webOSRelaunch', onShowHandler);
      setCurreentLanguage(window.navigator.language);
    }
    dispatch(getVolume());
    dispatch(getOSInfo());

    document.addEventListener('webOSLocaleChange', () => {
      console.log("statusBar-LISTENED TO webOSLocaleChange EVENT ====>")
      // window.location.reload();
      if (typeof window !== 'undefined' && window.navigator) {
        console.log("statusBar-curreentLanguage is (inside) ===> ", curreentLanguage)

        if (curreentLanguage !== window.navigator.language) {
          console.log("statusBar-inside IF CONDITION window.navigator.language =======> ", window.navigator.language)
          window.location.reload();
        } else {
          console.log("statusBar-inside ELSE CONDITION window.navigator.language =======> ", window.navigator.language)
        }
      }
    });

  }, [dispatch, onShowHandler, appShow]);

  const onHideHandler = useCallback(() => {
    dispatch({
      type: SHOW_APP,
      payload: false
    });
  }, [dispatch])
  const closeApp = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.close();
    }
  }, []);
  console.log("StatusBar-App.js")
  return (
    <div className={css.app}>
      <Transition type="fade" visible={appShow} onHide={closeApp}>
        <div className={css.basement} onClick={onHideHandler} />
      </Transition>
      <Transition
        direction="up"
        visible={appShow}
      >
        <MainPanel />
      </Transition>
    </div>
  )
}

export default ThemeDecorator({ overlay: true }, App);

