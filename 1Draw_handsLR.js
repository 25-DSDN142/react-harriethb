let myImage;
let paintLayer;
let rightPrevX = null;
let rightPrevY = null;
let leftPrevX = null;
let leftPrevY = null;

// ----= VIRTUAL CANVAS SETUP =----
const canvasX = 500;   // left edge of canvas
const canvasY = 100;   // top edge of canvas
const canvasWidth = 600;
const canvasHeight = 600;


function prepareInteraction() {
  myImage = loadImage('/images/fish.jpg');
}

function drawInteraction(faces, hands) {
  // ⚙️ Create the paint layer once, safely after setup
  if (!paintLayer) {
    paintLayer = createGraphics(CaptureWidth, CaptureHeight);
    paintLayer.clear();
  }

  // 🖼️ Draw reference image
  image(myImage, 40, 60, 400, 450);

  // 🖌️ Draw the persistent paint layer
  image(paintLayer, 0, 0);

  // 🖼️ Draw canvas border (optional)
  noFill();
  stroke(255);
  strokeWeight(4);
  rect(canvasX, canvasY, canvasWidth, canvasHeight);

  // ✋ Loop through hands
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    let gesture = detectHandGesture(hand);
    let brushColor = null;
    let brushSize = 8;

    // === LEFT HAND OPEN PALM = clear canvas ===
    if (gesture === "Open Palm" && hand.handedness === "Left") {
      paintLayer.clear();
      rightPrevX = rightPrevY = leftPrevX = leftPrevY = null;
      continue;
    }

    // === RIGHT HAND OPEN PALM = stop painting ===
    if (gesture === "Open Palm" && hand.handedness === "Right") {
      rightPrevX = null;
      rightPrevY = null;
      continue;
    }

    // === SELECT FINGER TIP BASED ON GESTURE ===
    let x, y;
    if (gesture === "Thumbs Up") {
      x = hand.thumb_tip.x;
      y = hand.thumb_tip.y;
    } else {
      x = hand.index_finger_tip.x;
      y = hand.index_finger_tip.y;
    }

    // === SET BRUSH COLOR AND SIZE FOR 6 PAINT PENS ===
    if (hand.handedness === "Right" && gesture === "Thumbs Up") {
      brushColor = color(135, 206, 250); // light blue
      brushSize = 6;
    } else if (hand.handedness === "Left" && gesture === "Thumbs Up") {
      brushColor = color(0, 102, 204);   // medium blue
      brushSize = 10;
    } else if (hand.handedness === "Right" && gesture === "Pointing") {
      brushColor = color(10, 10, 40);    // dark blue/black
      brushSize = 12;
    } else if (hand.handedness === "Left" && gesture === "Pointing") {
      brushColor = color(255, 243, 205); // cream
      brushSize = 8;
    } else if (hand.handedness === "Right" && gesture === "Peace") {
      brushColor = color(255, 140, 0);   // orange
      brushSize = 14;
    } else if (hand.handedness === "Left" && gesture === "Peace") {
      brushColor = color(204, 85, 0);    // darker orange
      brushSize = 16;
    }

    // === ERASER (Fist gesture) ===
    if (gesture === "Fist") {
      paintLayer.erase();
      paintLayer.strokeWeight(30); // eraser size
      paintLayer.noFill();

      // Only draw inside canvas
      if (x >= canvasX && x <= canvasX + canvasWidth &&
          y >= canvasY && y <= canvasY + canvasHeight) {

        if (hand.handedness === "Right") {
          if (rightPrevX !== null && rightPrevY !== null) {
            paintLayer.line(rightPrevX, rightPrevY, x, y);
          }
          rightPrevX = x;
          rightPrevY = y;
        } else {
          if (leftPrevX !== null && leftPrevY !== null) {
            paintLayer.line(leftPrevX, leftPrevY, x, y);
          }
          leftPrevX = x;
          leftPrevY = y;
        }
      }

      paintLayer.noErase();
      continue;
    }

    // === PAINTING (only for your 6 brushes) ===
    if (brushColor) {
      // Only draw inside canvas
      if (x >= canvasX && x <= canvasX + canvasWidth &&
          y >= canvasY && y <= canvasY + canvasHeight) {

        paintLayer.stroke(brushColor);
        paintLayer.strokeWeight(brushSize);
        paintLayer.noFill();

        if (hand.handedness === "Right") {
          if (rightPrevX !== null && rightPrevY !== null) {
            paintLayer.line(rightPrevX, rightPrevY, x, y);
          }
          rightPrevX = x;
          rightPrevY = y;
        } else {
          if (leftPrevX !== null && leftPrevY !== null) {
            paintLayer.line(leftPrevX, leftPrevY, x, y);
          }
          leftPrevX = x;
          leftPrevY = y;
        }
      } else {
        // outside canvas -> reset previous points
        if (hand.handedness === "Right") { rightPrevX = rightPrevY = null; }
        else { leftPrevX = leftPrevY = null; }
      }

    } else {
      // not painting -> reset previous points
      if (hand.handedness === "Right") { rightPrevX = rightPrevY = null; }
      else { leftPrevX = leftPrevY = null; }
    }
  }
}


function drawConnections(hand) {
  // Draw the skeletal connections
  push()
  for (let j = 0; j < connections.length; j++) {
    let pointAIndex = connections[j][0];
    let pointBIndex = connections[j][1];
    let pointA = hand.keypoints[pointAIndex];
    let pointB = hand.keypoints[pointBIndex];
    stroke(255, 0, 0);
    strokeWeight(2);
    line(pointA.x, pointA.y, pointB.x, pointB.y);
  }
  pop()
}

// This function draw's a dot on all the keypoints. It can be passed a whole face, or part of one. 
function drawPoints(feature) {
  push()
  for (let i = 0; i < feature.keypoints.length; i++) {
    let element = feature.keypoints[i];
    noStroke();
    fill(0, 255, 0);
    circle(element.x, element.y, 10);
  }
  pop()

}