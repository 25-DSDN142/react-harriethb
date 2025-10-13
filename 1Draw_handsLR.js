// ----=  HANDS  =----
let myImage;
let rightPrevX = null;
let rightPrevY = null;
let leftPrevX = null;
let leftPrevY = null;

function prepareInteraction() {
  myImage = loadImage('/images/fish.jpg');
}

function drawInteraction(faces, hands) {
  // draw reference image once
  image(myImage, 40, 60, 400, 450);

  // loop through detected hands
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    let whatGesture = detectHandGesture(hand);
    let brushColor = null; // start with no color = no drawing
    let x = hand.index_finger_tip.x;
    let y = hand.index_finger_tip.y;

    // ----------- 🎨 Pick color based on hand + gesture -----------
    if (hand.handedness === "Right" && whatGesture === "Thumbs Up") {
      brushColor = color(135, 206, 250); // light blue
    } 
    else if (hand.handedness === "Left" && whatGesture === "Thumbs Up") {
      brushColor = color(0, 102, 204); // medium blue
    } 
    else if (hand.handedness === "Right" && whatGesture === "Pointing") {
      brushColor = color(10, 10, 40); // dark blue/black
    } 
    else if (hand.handedness === "Left" && whatGesture === "Pointing") {
      brushColor = color(255, 243, 205); // cream
    } 
    else if (hand.handedness === "Right" && whatGesture === "Peace") {
      brushColor = color(255, 140, 0); // orange
    } 
    else if (hand.handedness === "Left" && whatGesture === "Peace") {
      brushColor = color(204, 85, 0); // darker orange
    }

    // ----------- ✏️ Draw only if gesture matches -----------
    if (brushColor !== null) {
      stroke(brushColor);
      strokeWeight(8);
      strokeJoin(ROUND);
      noFill();

      if (hand.handedness === "Right") {
        if (rightPrevX !== null && rightPrevY !== null) {
          line(rightPrevX, rightPrevY, x, y);
        }
        rightPrevX = x;
        rightPrevY = y;
      } 
      else if (hand.handedness === "Left") {
        if (leftPrevX !== null && leftPrevY !== null) {
          line(leftPrevX, leftPrevY, x, y);
        }
        leftPrevX = x;
        leftPrevY = y;
      }
    } 
    else {
      // if not using a drawing gesture, reset so lines don’t connect
      if (hand.handedness === "Right") {
        rightPrevX = null;
        rightPrevY = null;
      } 
      else {
        leftPrevX = null;
        leftPrevY = null;
      }
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