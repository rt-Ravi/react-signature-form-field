import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState
} from "react";
import SignaturePad from "signature_pad";
import "./signature.css";

const Signature = forwardRef(
  ({ style = {}, className = "", value, onChange, height = "300px" }, ref) => {
    const canvasRef = useRef(null);
    const sigPadRef = useRef(null);
    const undoDataRef = useRef([]);

    const [menuOpen, setMenuOpen] = useState(false);

    const [penColor, setPenColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [strokeWidth, setStrokeWidth] = useState(2);

    // ✅ INIT ONLY ONCE
    useEffect(() => {
      const canvas = canvasRef.current;

      sigPadRef.current = new SignaturePad(canvas, {
        penColor,
        backgroundColor: bgColor,
        minWidth: strokeWidth,
        maxWidth: strokeWidth + 1
      });

      const resizeCanvas = () => {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);

        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;

        canvas.getContext("2d").scale(ratio, ratio);
        sigPadRef.current.clear();
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      // ✅ TRACK DRAWING
      sigPadRef.current.addEventListener("endStroke", () => {
        undoDataRef.current = [];

        const dataUrl = sigPadRef.current.toDataURL();
        onChange && onChange(dataUrl);
      });

      return () => {
        window.removeEventListener("resize", resizeCanvas);
      };
    }, []);

    // ✅ UPDATE PEN SETTINGS (NO RE-CREATE)
    useEffect(() => {
      if (!sigPadRef.current) return;

      sigPadRef.current.penColor = penColor;
      sigPadRef.current.minWidth = strokeWidth;
      sigPadRef.current.maxWidth = strokeWidth + 1;
    }, [penColor, strokeWidth]);

    // ✅ BACKGROUND CHANGE (SAFE WAY)
    useEffect(() => {
      if (!sigPadRef.current) return;

      const data = sigPadRef.current.toData();
      sigPadRef.current.clear();
      sigPadRef.current.backgroundColor = bgColor;
      sigPadRef.current.fromData(data);
    }, [bgColor]);

    // ✅ CONTROLLED MODE
    useEffect(() => {
      if (!sigPadRef.current) return;

      if (value) {
        sigPadRef.current.fromDataURL(value);
      } else {
        sigPadRef.current.clear();
      }
    }, [value]);

    // ✅ Undo
    const undo = () => {

      if(!sigPadRef.current.isEmpty()){
        const data = sigPadRef.current.toData();
        if (data.length > 0) {
          undoDataRef.current.push(data.pop());
          sigPadRef.current.fromData(data);
        }
      }

    };

    // ✅ Redo
    const redo = () => {
      const data = sigPadRef.current.toData();
      if (undoDataRef.current.length > 0) {
        data.push(undoDataRef.current.pop());
        sigPadRef.current.fromData(data);
      }
    };

    // ✅ Clear
    const clear = () => {
      sigPadRef.current.clear();
      undoDataRef.current = [];
      onChange && onChange(""); // controlled sync
    };

    // ✅ Download
    const download = () => {
      if (sigPadRef.current.isEmpty()) return;

      const dataURL = sigPadRef.current.toDataURL();
      const a = document.createElement("a");
      a.href = dataURL;
      a.download = "signature.png";
      a.click();
    };

    // ✅ Check empty
    const isEmpty = () => sigPadRef.current.isEmpty();

    useImperativeHandle(ref, () => ({
      undo,
      redo,
      clear,
      download,
      isEmpty,
    }));

    return (
      <div className={`rsl-signature-con`}>
        {/* MENU */}
        <div className="rsl-menu-con">
          <div
            className="rsl-menu-icon"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </div>

          {menuOpen && (
            <div className="rsl-signature-menu">
              <div className="rsl-menu-header">
                <span>Tools</span>
                <button type="button"
                  className="rsl-close-btn"
                  onClick={() => setMenuOpen(false)}
                >
                  ✕
                </button>
              </div>

              <button type="button" onClick={undo}>Undo</button>
              <button type="button" onClick={redo}>Redo</button>
              <button type="button" onClick={clear}>Clear</button>
              <button type="button" onClick={download}>Download</button>

              <div className="rsl-menu-group">
                <label>Pen Color</label>
                <input
                  type="color"
                  value={penColor}
                  onChange={(e) => setPenColor(e.target.value)}
                />
              </div>

              <div className="rsl-menu-group">
                <label>Background</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </div>

              <div className="rsl-menu-group">
                <label>Stroke</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={strokeWidth}
                  onChange={(e) =>
                    setStrokeWidth(Number(e.target.value))
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* CANVAS */}
        <canvas
          ref={canvasRef}
          className={`rsl-canvas ${className}`}
          style={{
            height,
            background: bgColor,
            ...style
          }}
        />
      </div>
    );
  }
);

export default Signature;
