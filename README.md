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

```jsx
<Signature
  renderMenu={({ undo, redo, clear }) => (
    <div>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
      <button onClick={clear}>Clear</button>
    </div>
  )}
/>
```

## 🎮 Ref API

- undo()
- redo()
- clear()
- download()
- getSignatureBase64()
- getSignatureBlob()

## 🧰 Utility

```js
import { dataURLtoBlob } from "react-signature-library";
```

## 🙌 Author
Ravi Thakur
