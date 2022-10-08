import { Component } from "react";
import ThemeDecorator from "@enact/sandstone/ThemeDecorator";
import MainPanel from "../views/MainPanel";
import css from "./App.module.less";
import compose from "ramda/src/compose";
import Transition from "@enact/ui/Transition";

let delayTohide = 5000;
let hideTimerId = null;
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shown: true,
    };
  }

  onHideVolumeControl = () => {
    console.log("invoked onHideVolumeControl function...");
    this.setState({
      shown: false,
      type: "slide",
    });
    window.close();
  };

  clearHideTime = () => {
    if (hideTimerId) {
      clearTimeout(hideTimerId);
    }
  };

  setHideTime = () => {
    this.clearHideTime();
    hideTimerId = setTimeout(() => {
      this.setState({
        shown: false,
        type: "fade",
      });
    }, delayTohide);
  };

  componentDidMount() {
    document.addEventListener("webOSLocaleChange", () => {
      window.location.reload();
    });
    document.addEventListener("webOSRelaunch", () => {
      this.setState({
        shown: true,
        type: "slide",
      });
      this.setHideTime();
    });
  }

  render() {
    return (
      <>
        <div className={css.app}>
          <Transition css={css} type="fade" visible={this.state.shown}>
            <div className={css.basement} onClick={this.onHideVolumeControl} />
          </Transition>
          <Transition
            direction="up"
            visible={this.state.shown}
            type={this.state.type}
          >
            <MainPanel />
          </Transition>
        </div>
      </>
    );
  }
}

const AppDecorator = compose(
  ThemeDecorator({
    noAutoFocus: true,
    overlay: true,
  })
);

export default AppDecorator(App);
