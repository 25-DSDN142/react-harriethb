let myImage;
let paintLayer;
let frameImage; 
let paintImage;
let rightPrevX = null;
let rightPrevY = null;
let leftPrevX = null;
let leftPrevY = null;

// VIRTUAL CANVAS SETUP 
const canvasX = 580;   // left edge of canvas
const canvasY = 135;   // top edge of canvas
const canvasWidth = 600;
const canvasHeight = 685;


function prepareInteraction() {
  myImage = loadImage('/images/fish.jpg');
   frameImage = loadImage('/images/frame png.webp');
   paintImage = loadImage('/images/paintbrushh.png')
}

function drawInteraction(faces, hands) {
  1
  if (!paintLayer) {
    paintLayer = createGraphics(CaptureWidth, CaptureHeight);
    paintLayer.clear();
  }

  // Draw reference image
  image(myImage, 40, 60, 400, 450);

  // Draw the persistent paint layer
  image(paintLayer, 0, 0);

   // draw frame on top of everything
  image(frameImage, 450, 5, 850, 950);


  //  Loop through hands
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    let gesture = detectHandGesture(hand);
    let brushColor = null;
    let brushSize = 8;

    // LEFT HAND OPEN PALM = clear canvas 
    if (gesture === "Open Palm" && hand.handedness === "Left") {
      paintLayer.clear();
      rightPrevX = rightPrevY = leftPrevX = leftPrevY = null;
      continue;
    }

    // RIGHT HAND OPEN PALM = stop painting
    if (gesture === "Open Palm" && hand.handedness === "Right") {
      rightPrevX = null;
      rightPrevY = null;
      continue;
    }

    // SELECT FINGER TIP BASED ON GESTURE 
    let x, y;
    if (gesture === "Thumbs Up") {
      x = hand.thumb_tip.x;
      y = hand.thumb_tip.y;
    } else {
      x = hand.index_finger_tip.x;
      y = hand.index_finger_tip.y;
    }

    // SET BRUSH COLOR AND SIZE FOR 6 PAINT PENS 
    if (hand.handedness === "Right" && gesture === "Thumbs Up") {
      brushColor = color(48, 123, 156); // light blue
      brushSize = 8;
    } else if (hand.handedness === "Left" && gesture === "Thumbs Up") {
      brushColor = color(21, 71, 89);   // medium blue
      brushSize = 150;
    } else if (hand.handedness === "Right" && gesture === "Pointing") {
      brushColor = color(12, 31, 43);    // dark blue/black
      brushSize = 10;
    } else if (hand.handedness === "Left" && gesture === "Pointing") {
      brushColor = color(222, 211, 193); // cream
      brushSize = 20;
    } else if (hand.handedness === "Right" && gesture === "Peace") {
      brushColor = color(217, 112, 67);   // orange
      brushSize = 14;
    } else if (hand.handedness === "Left" && gesture === "Peace") {
      brushColor = color(148, 71, 46);    // darker orange
      brushSize = 16;
    }

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

    // === PAINTING ===
if (brushColor) {
  // Only draw inside canvas
  if (x >= canvasX && x <= canvasX + canvasWidth &&
      y >= canvasY && y <= canvasY + canvasHeight) {

    // --- SPECIAL BRUSH TYPES ---
let brushType = "normal";

if (hand.handedness === "Right" && gesture === "Pointing") {
  brushType = "hair"; // dark blue
} else if (hand.handedness === "Right" && gesture === "Thumbs Up") {
  brushType = "hair"; // light blue now uses hair/grass brush too
} else if (hand.handedness === "Left" && gesture === "Pointing") {
  brushType = "smooth"; // cream
} else if (
  (hand.handedness === "Right" && gesture === "Peace") || 
  (hand.handedness === "Left" && gesture === "Peace")
) {
  brushType = "spray"; // orange + dark orange
} else {
  brushType = "textured"; // fallback for medium blue
}

// --- DRAW BASED ON BRUSH TYPE ---
switch (brushType) {

  // GRASS BRUSH (dark blue + light blue)
  case "hair":
    for (let i = 0; i < 15; i++) {
      let angle = random(TWO_PI);
      let length = random(5, 20);
      let offsetX = cos(angle) * length;
      let offsetY = sin(angle) * length;

      let alpha = random(120, 180);
      let hColor = color(
        red(brushColor),
        green(brushColor),
        blue(brushColor),
        alpha
      );

      paintLayer.stroke(hColor);
      paintLayer.strokeWeight(1.5);
      paintLayer.line(x, y, x + offsetX, y + offsetY);
    }
    rightPrevX = rightPrevY = null;
    break;

  // SMOOTH BRUSH (cream)
  case "smooth":
    paintLayer.stroke(brushColor);
    paintLayer.strokeWeight(brushSize);
    paintLayer.noFill();

    if (leftPrevX !== null && leftPrevY !== null) {
      paintLayer.line(leftPrevX, leftPrevY, x, y);
    }
    leftPrevX = x;
    leftPrevY = y;
    break;

  // SPRAY PAINT (orange & dark orange)
  case "spray":
    for (let i = 0; i < 120; i++) {
      let angle = random(TWO_PI);
      let radius = random(0, 35);
      let dx = cos(angle) * radius;
      let dy = sin(angle) * radius;

      let alpha = random(40, 100);
      let sprayColor = color(
        red(brushColor),
        green(brushColor),
        blue(brushColor),
        alpha
      );

      paintLayer.noStroke();
      paintLayer.fill(sprayColor);
      paintLayer.circle(x + dx, y + dy, random(2, 5));
    }
    if (hand.handedness === "Right") { rightPrevX = rightPrevY = null; }
    else { leftPrevX = leftPrevY = null; }
    break;

  // LIGHTLY TEXTURED 
  case "textured":
    for (let i = 0; i < 4; i++) {
      let offsetX = random(-2, 2);
      let offsetY = random(-2, 2);
      let alpha = random(100, 180);
      let tColor = color(
        red(brushColor),
        green(brushColor),
        blue(brushColor),
        alpha
      );
      paintLayer.stroke(tColor);
      paintLayer.strokeWeight(brushSize - random(2, 6));
      paintLayer.noFill();

      if (hand.handedness === "Right") {
        if (rightPrevX !== null && rightPrevY !== null) {
          paintLayer.line(rightPrevX + offsetX, rightPrevY + offsetY, x + offsetX, y + offsetY);
        }
      } else {
        if (leftPrevX !== null && leftPrevY !== null) {
          paintLayer.line(leftPrevX + offsetX, leftPrevY + offsetY, x + offsetX, y + offsetY);
        }
      }
    }

    if (hand.handedness === "Right") {
      rightPrevX = x;
      rightPrevY = y;
    } else {
      leftPrevX = x;
      leftPrevY = y;
    }
    break;
}

  } else {
    // Outside canvas -> reset previous points
    if (hand.handedness === "Right") rightPrevX = rightPrevY = null;
    else leftPrevX = leftPrevY = null;
  }

} else {
  // Not painting -> reset previous points
  if (hand.handedness === "Right") rightPrevX = rightPrevY = null;
  else leftPrevX = leftPrevY = null;
}

// === ALIVE PAINTBRUSH IMAGE ===
    if (brushColor && x >= canvasX && x <= canvasX + canvasWidth &&
        y >= canvasY && y <= canvasY + canvasHeight) {
      push();
      translate(x +50, y - 50);
      // gentle wobble rotation + size pulse
      rotate(sin(frameCount * 0.1) * 0.2);
      let sizePulse = 100 + sin(frameCount * 0.15) * 5;
      image(paintImage, -sizePulse/2, -sizePulse/2, sizePulse, sizePulse);
      pop();
} 
    
  }

  // TEXT AND PALETTE GUIDE
push();
fill(21, 71, 89);
textAlign(LEFT);
textSize(45);
textStyle(BOLD)
text("RECREATE THIS ", 40, height-400);
textSize(70);
text("PAINTING", 40, height-330);
textSize(22);
text("Right Thumbs Up = Light Blue", 40, height - 260);
text("Left Thumbs Up = Medium Blue", 40, height - 230);
text("Right Pointing = Dark Blue/Black", 40, height - 200);
text("Left Pointing = Cream", 40, height - 170);
text("Right Peace = Orange", 40, height - 140);
text("Left Peace = Darker Orange", 40, height - 110);
text("Left Open Palm = Clear Canvas", 40, height - 80);
pop();

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