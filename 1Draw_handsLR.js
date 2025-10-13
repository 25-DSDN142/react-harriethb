// ----=  HANDS  =----
// USING THE GESTURE DETECTORS (check their values in the debug menu)
// detectHandGesture(hand) returns "Pinch", "Peace", "Thumbs Up", "Pointing", "Open Palm", or "Fist"

let myImage;

/* load images here */
function prepareInteraction() {
  
 myImage = loadImage('/images/fish.jpg');
}

function drawInteraction(faces, hands) {
  // draw your reference image
  image(myImage, 40, 60, 400, 450);

  // for every detected hand
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    if (showKeypoints) {
      drawConnections(hand);
    }

    let middleFingerMcpX = hand.middle_finger_mcp.x;
    let middleFingerMcpY = hand.middle_finger_mcp.y;

    let whatGesture = detectHandGesture(hand);
    let brushColor = color(255); // default white if no match

    // ----------- 🎨 Six Pen Colors -----------
    // 1. Right hand + Thumbs Up = Light Blue
    if (hand.handedness === "Right" && whatGesture === "Thumbs Up") {
      brushColor = color(135, 206, 250); // light blue
    }

    // 2. Left hand + Thumbs Up = Medium Blue
    else if (hand.handedness === "Left" && whatGesture === "Thumbs Up") {
      brushColor = color(0, 102, 204); // medium blue
    }

    // 3. Right hand + Pointing = Dark Blue/Black
    else if (hand.handedness === "Right" && whatGesture === "Pointing") {
      brushColor = color(10, 10, 40); // dark blue-black
    }

    // 4. Left hand + Pointing = Cream
    else if (hand.handedness === "Left" && whatGesture === "Pointing") {
      brushColor = color(255, 243, 205); // cream
    }

    // 5. Right hand + Peace = Orange
    else if (hand.handedness === "Right" && whatGesture === "Peace") {
      brushColor = color(255, 140, 0); // orange
    }

    // 6. Left hand + Peace = Darker Orange
    else if (hand.handedness === "Left" && whatGesture === "Peace") {
      brushColor = color(204, 85, 0); // darker orange
    }

    // ----------- ✏️ Drawing the brush shape -----------
    fill(brushColor);
    noStroke();

    // you can change this to a smaller shape later (like a dot)
    if (hand.handedness === "Right") {
      rect(middleFingerMcpX, middleFingerMcpY, 20, 20);
    } else if (hand.handedness === "Left") {
      ellipse(middleFingerMcpX, middleFingerMcpY, 20, 20);
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