import { BiRefresh } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
// import { HiMiniMap } from "react-icons/hi2";

const logo = chrome.runtime.getURL("llogo.png");

interface OptionsContainerProps {
  onToggleMinimap: CallableFunction;
  onRefreshMinimap: CallableFunction;
  showMinimap: boolean;
}

export default function OptionsContainer({
  onToggleMinimap,
  onRefreshMinimap,
  showMinimap,
}: OptionsContainerProps) {
  return (
    <div className="options-container" style={OptionsContainerStyle}>
      <>
        {showMinimap ? (
          <button onClick={() => onToggleMinimap()} style={buttonStyle}>
            <CgClose style={closeStyle} />
          </button>
        ) : (
          <button onClick={() => onToggleMinimap()} style={logoStyle}>
            <img src={logo} style={imageStyle} />
          </button>
        )}
      </>
      {showMinimap ? (
        <>
          <button onClick={() => onRefreshMinimap()} style={buttonStyle}>
            <BiRefresh />
          </button>
        </>
      ) : null}
    </div>
  );
}

const closeStyle: React.CSSProperties = {
  color: "#ff000090",
};

const OptionsContainerStyle: React.CSSProperties = {
  fontSize: "13px",
  height: "fit-content",
  display: "flex",
  flexDirection: "column",
  gap: "0.3em",
  paddingTop: "0.2em",
};
const buttonStyle: React.CSSProperties = {
  padding: "0.2em",
  backgroundColor: "#18181B90",
  color: "#1ee14790",
  borderRadius: "100%",
  pointerEvents: "auto",
  border: "solid #00000030 1px",
  fontFamily: "Verdana",
  height: "1.3em",
  width: "1.3em",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const logoStyle: React.CSSProperties = {
  padding: "0.25em",
  backgroundColor: "#18181B90",
  color: "#1ee14790",
  borderRadius: "100%",
  pointerEvents: "auto",
  border: "solid #ffffff55 1px",
  fontFamily: "Verdana",
  height: "1.5em",
  width: "1.5em",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginRight: "1em"
};
const imageStyle: React.CSSProperties = {
  objectFit: "cover",
};
