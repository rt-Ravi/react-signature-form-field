# ✍️ React Signature Library

A lightweight and customizable React signature pad component built using `signature_pad`.

## 🚀 Features
- Undo / Redo
- Clear Signature
- Download as Image
- Controlled & Uncontrolled Modes
- Custom Menu UI (renderMenu)
- Full Styling Control
- Base64 & Blob Export
- Internal CSS (No setup required)

## 📦 Installation
npm install react-signature-library

## 🧑‍💻 Usage (useRef)

```jsx
import { useRef } from "react";
import { Signature } from "react-signature-library";

function App() {
  const sigRef = useRef(null);

  const handleSubmit = async () => {
    const base64 = sigRef.current.getSignatureBase64();
    const blob = await sigRef.current.getSignatureBlob();

    console.log(base64, blob);
  };

  return (
    <div>
      <Signature ref={sigRef} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

## 🔁 Usage (Controlled)

```jsx
import { useState } from "react";
import { Signature, dataURLtoBlob } from "react-signature-library";

function App() {
  const [signature, setSignature] = useState("");

  const handleSubmit = () => {
    const blob = dataURLtoBlob(signature);
    console.log(blob);
  };

  return (
    <>
      <Signature value={signature} onChange={setSignature} />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
```

## 🎨 Custom Menu
You can fully customize the menu UI using the renderMenu prop.

This gives you complete control over:

Actions (Undo, Redo, Clear, Download)
Colors (Pen & Background)
Stroke width
Menu visibility

```jsx
<Signature value={signature} onChange={setSignature} 
        renderMenu={({
          undo,
          redo,
          clear,
          download,
          penColor,
          bgColor,
          strokeWidth,
          setPenColor,
          setBgColor,
          setStrokeWidth,
        }) => (
          <div style={{ marginBottom: "10px" }}>
            
            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <button type="button" onClick={undo}>Undo</button>
              <button type="button" onClick={redo}>Redo</button>
              <button type="button" onClick={clear}>Clear</button>
              <button type="button" onClick={download}>Download</button>
            </div>

            {/* COLOR CONTROLS */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <label>
                Pen:
                <input
                  type="color"
                  value={penColor}
                  onChange={(e) => setPenColor(e.target.value)}
                />
              </label>

              <label>
                Background:
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </label>
            </div>

            {/* STROKE CONTROL */}
            <div style={{ marginBottom: "10px" }}>
              <label>
                Stroke: {strokeWidth}
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={strokeWidth}
                  onChange={(e) =>
                    setStrokeWidth(Number(e.target.value))
                  }
                />
              </label>
            </div>
          </div>
        )}>
          
</Signature>
```

## 🎮 Ref API

```jsx
const sigRef = useRef(null);

sigRef.current.undo();
sigRef.current.redo();
sigRef.current.clear();
sigRef.current.download();
sigRef.current.isEmpty();
const base64 = sigRef.current.getSignatureBase64();
const blob = await sigRef.current.getSignatureBlob();

/>

```

## 🧰 Utility

```js
import { dataURLtoBlob } from "react-signature-library";
const blob = dataURLtoBlob(base64);
```

## 🌐 Backend Integration (Upload Signature)
You can send the signature to your backend using Base64 or Blob.

## 📌 Upload as Blob (Recommended)

```js
const blob = await sigRef.current.getSignatureBlob();

const formData = new FormData();
formData.append("signature", blob, "signature.png");

await fetch("http://localhost:5000/upload-blob", {
  method: "POST",
  body: formData
});
```

## 📌 Upload as Base64

```js
const base64 = sigRef.current.getSignatureBase64();

await fetch("http://localhost:5000/upload-base64", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ signature: base64 })
});
```

## 🎨 Styling Options

Pass custom class names to target specific parts of the component:

```jsx
<Signature
  className="wrapper"        // Main container
  canvasClass="canvas"      // Canvas element
  menuClass="menu-icon"     // Menu toggle icon
  buttonClass="btn"         // Buttons inside menu
/>
```

| Prop          | Description                                        |
| ------------- | -------------------------------------------------- |
| `className`   | Wrapper container of the signature pad             |
| `canvasClass` | Canvas element where drawing happens               |
| `menuClass`   | Menu toggle (☰ icon) styling                       |
| `buttonClass` | Buttons inside the default menu (Undo, Redo, etc.) |


## 🎨 Using Inline Style

You can directly apply styles to the canvas:

```jsx
<Signature
  style={{ border: "2px solid red", borderRadius: "12px" }}
/>
```

## 🎨 Using CSS Variables

Customize default UI colors using built-in CSS variables:

```css
.rsl-signature-menu {
  --rsl-menu-bg: #222;
}

.rsl-signature-menu button {
  --rsl-btn-bg: #444;
  --rsl-btn-color: #fff;
}
```

| Variable          | Description             |
| ----------------- | ----------------------- |
| `--rsl-menu-bg`   | Menu background color   |
| `--rsl-btn-bg`    | Button background color |
| `--rsl-btn-color` | Button text color       |


## 🙌 Author
Ravi Thakur
