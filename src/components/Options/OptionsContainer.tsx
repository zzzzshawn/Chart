import { BiRefresh } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
// import { HiMiniMap } from "react-icons/hi2";


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
      <button onClick={() => onToggleMinimap()} style={buttonStyle}>
        {showMinimap ? <CgClose /> : <img src={""} style={imageStyle}/>}
      </button>
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

const OptionsContainerStyle: React.CSSProperties = {
  fontSize: "16px",
  height: "fit-content",
  display: "flex",
  flexDirection: "column",
  gap: "0.3em",
  paddingTop: "1em"
};
const buttonStyle: React.CSSProperties = {
  padding: " 0 0.2em",
  backgroundColor: "#2F2F2F",
  color: "white",
  borderTopLeftRadius: "1em",
  borderBottomLeftRadius: "1em",
  pointerEvents: "auto",
  border: "solid #676767 1px",
  fontFamily: "Verdana",
  height: "4em",
  width: "1.2em",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
  
};
const imageStyle: React.CSSProperties = {
  objectFit: "contain"
}