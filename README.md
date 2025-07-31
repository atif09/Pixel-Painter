## Pixel Painter
 A retro-styled pixel art creator with glowing neon aesthetics.
# **Live on:** [https://pixel-painter.vercel.app](https://pixel-painter-puce.vercel.app/)

---

## Project Structure

<details>
<summary>Click to expand</summary>

```
pixel-painter/
├── public/
│   ├── assets/
│   │   └── buttons/
│   │       ├── color-bucket.png
│   │       ├── eraser.png
│   │       ├── export.png
│   │       ├── redo.png
│   │       ├── reset-grid.png
│   │       └── undo.png
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Pixel.js
│   │   └── PixelGrid.js
│   ├── App.css
│   ├── App.js
│   └── index.js
```

</details>

---

## Features

* Create pixel art with intuitive painting tools
* Undo/Redo functionality for mistake-free creation
* Eraser tool with visual feedback
* Color selection with recent colors memory
* Multiple grid size options (8×8, 16×16, 32×32, 64×64)
* HEX color code input for precise color selection
* Export creations as PNG images
* Auto-save work in progress using local storage

---

## Technologies Used

* React.js
* HTML Canvas
* CSS Animations
* LocalStorage for persistence

---

## How to Use

1. **Select a Color**: Click on the color bucket icon and pick a color
2. **Paint Pixels**: Click or drag on the grid to paint pixels
3. **Erase Pixels**: Click the eraser icon to toggle eraser mode
4. **Undo/Redo**: Use the arrow icons to undo or redo your actions
5. **Reset Grid**: Click the "Reset Grid" button to clear your canvas
6. **Change Grid Size**: Select from available grid size options
7. **Export**: Click the export icon to save your art as a PNG file

---




