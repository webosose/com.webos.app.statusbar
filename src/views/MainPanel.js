import { Component } from "react";
import Controls from "./Controls";
import css from "./MainPanel.module.less";
import StatusBarItems from "./StatusBarItems";

const statusIcons = ["sound", "notification", "download", "bluetooth", "wifi4"];
class MainPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shown: true,
    };
  }

  componentDidMount() {
    document.addEventListener("webOSRelaunch", () => {
      this.setState({
        shown: true,
      });
    });
  }

  render() {
    return (
      <div className={css.app}>
        <Controls className={css.controls}>
          <buttons>
            {statusIcons.map((i) => {
              return <StatusBarItems statusIcon={i} />;
            })}
          </buttons>
        </Controls>
      </div>
    );
  }
}

export default MainPanel;
