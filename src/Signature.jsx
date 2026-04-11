import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState
} from "react";
import SignaturePad from "signature_pad";

const Signature = forwardRef(
  ({ style = {}, className = "", menuClass = "", buttonClass = "", canvasClass = "", value, onChange, height = "300px", renderMenu }, ref) => {
    const canvasRef = useRef(null);
    const sigPadRef = useRef(null);
    const undoDataRef = useRef([]);

    const styles = `
        .rsl-signature-menu span, .rsl-signature-menu label{
          color: #4e4e4e;
        }

        .rsl-redo-btn, .rsl-undo-btn, .rsl-download-btn, .rsl-clear-btn{
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .rsl-signature-con {
          position: relative;
        }

        /* MENU BUTTON */
        .rsl-menu-con {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 100;
        }

        .rsl-menu-icon {
          width: 40px;
          height: 40px;
          background: #111;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          cursor: pointer;
          font-size: 18px;
        }

        /* DROPDOWN */
        .rsl-signature-menu {
          margin-top: 10px;
          width: 180px;
          background: var(--rsl-menu-bg, white);
          border-radius: 10px;
          padding: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);

          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* BUTTONS */
        .rsl-signature-menu button {
          padding: 8px;
          border: none;
          background: var(--rsl-btn-bg, #f3f4f6);
          color: var(--rsl-btn-color, black);
          cursor: pointer;
          text-align: left;
          color: #111;
        }

        .rsl-signature-menu button:hover {
          background: #e5e7eb;
        }

        /* INPUT GROUP */
        .rsl-menu-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
          font-size: 12px;
        }

        /* CANVAS */
        .rsl-canvas {
          width: 100%;
          border-radius: 10px;
        }

        /* HEADER */
        .rsl-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: bold;
          margin-bottom: 5px;
        }

        /* CLOSE BUTTON */
        .rsl-close-btn {
          background: transparent;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: #555;
        }

        .rsl-close-btn:hover {
          color: red;
        }

      `;


    const [menuOpen, setMenuOpen] = useState(false);

    const [penColor, setPenColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [strokeWidth, setStrokeWidth] = useState(2);

    useEffect(() => {

      if (document.getElementById("rsl-styles")) return;

      const style = document.createElement("style");
      style.id = "rsl-styles";
      style.innerHTML = styles;
      document.head.appendChild(style);

    }, [])


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

      if (!sigPadRef.current.isEmpty()) {
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

    const getSignatureBase64 = () => {
      if (sigPadRef.current.isEmpty()) return "";
      return sigPadRef.current.toDataURL();
    };

    const getSignatureBlob = async () => {
      if (sigPadRef.current.isEmpty()) return null;

      const dataURL = sigPadRef.current.toDataURL();
      return await fetch(dataURL).then(res => res.blob());
    };


    // ✅ Check empty
    const isEmpty = () => sigPadRef.current.isEmpty();

    useImperativeHandle(ref, () => ({
      undo,
      redo,
      clear,
      download,
      isEmpty,
      getSignatureBase64,
      getSignatureBlob,

    }));

    // ✅ API FOR renderMenu
    const api = {
      undo,
      redo,
      clear,
      download,
      isEmpty,
      penColor,
      bgColor,
      strokeWidth,
      setPenColor,
      setBgColor,
      setStrokeWidth,
      closeMenu: () => setMenuOpen(false),
      openMenu: () => setMenuOpen(true)
    };

    return (
      <div className={`rsl-signature-con ${className}`}>

        {/* MENU */}
        <div className="rsl-menu-con">

          {renderMenu ? (
            // 🔥 CUSTOM MENU (USER CONTROL)
            renderMenu(api)
          ) : (
            // ✅ DEFAULT MENU (WITH SVG)
            <>
              <div
                className={`rsl-menu-icon ${menuClass}`}
                onClick={() => setMenuOpen(true)}
              >
                ☰
              </div>

              {menuOpen && (
                <div className="rsl-signature-menu">

                  {/* HEADER */}
                  <div className="rsl-menu-header">
                    <span>Tools</span>
                    <button
                      type="button"
                      className="rsl-close-btn"
                      onClick={() => setMenuOpen(false)}
                    >
                      ✕
                    </button>
                  </div>

                  {/* UNDO */}
                  <button
                    type="button"
                    className={`rsl-undo-btn ${buttonClass}`}
                    onClick={undo}
                  >
                    Undo
                    <svg width="20px" viewBox="0 0 24 24">
                      <path d="M7.18,4 8.6,5.44 6.06,8h9.71a6,6,0,0,1,0,12h-2V18h2a4,4,0,0,0,0-8H6.06L8.6,12.51 7.18,13.92 2.23,9Z" />
                    </svg>
                  </button>

                  {/* REDO */}
                  <button
                    type="button"
                    className={`rsl-redo-btn ${buttonClass}`}
                    onClick={redo}
                  >
                    Redo
                    <svg width="20px" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.2929 3.29289C15.6834 2.90237 16.3166 2.90237 16.7071 3.29289L21.4142 8L16.7071 12.7071C16.3166 13.0976 15.6834 13.0976 15.2929 12.7071C14.9024 12.3166 14.9024 11.6834 15.2929 11.2929L17.5858 9H10C7.23858 9 5 11.2386 5 14C5 16.7614 7.23857 19 10 19H15.8462C16.3984 19 16.8462 19.4477 16.8462 20C16.8462 20.5523 16.3984 21 15.8462 21H10C6.134 21 3 17.866 3 14C3 10.134 6.13401 7 10 7H17.5858L15.2929 4.70711C14.9024 4.31658 14.9024 3.68342 15.2929 3.29289Z"
                      />
                    </svg>
                  </button>

                  {/* CLEAR */}
                  <button
                    type="button"
                    className={`rsl-clear-btn ${buttonClass}`}
                    onClick={clear}
                  >
                    Clear
                    <svg width="20px" viewBox="0 0 640 640">
                      <path d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208z" />
                    </svg>
                  </button>

                  {/* DOWNLOAD */}
                  <button
                    type="button"
                    className={`rsl-download-btn ${buttonClass}`}
                    onClick={download}
                  >
                    Download
                    <svg width="20px" viewBox="0 0 24 24">
                      <path
                        d="M12 15V4M12 15L9 12M12 15L15 12M4 20H20"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* PEN COLOR */}
                  <div className="rsl-menu-group">
                    <label>Pen Color</label>
                    <input
                      type="color"
                      value={penColor}
                      onChange={(e) => setPenColor(e.target.value)}
                    />
                  </div>

                  {/* BACKGROUND */}
                  <div className="rsl-menu-group">
                    <label>Background</label>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                    />
                  </div>

                  {/* STROKE */}
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
            </>
          )}
        </div>

        {/* CANVAS */}
        <canvas
          ref={canvasRef}
          className={`rsl-canvas ${canvasClass}`}
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
