let video;
let poseNet;
let pose;
let skeleton;
let posesArray = ['a', 'b', 'd', 'e', 'f','h', 'i'];

let yogi;
let poseLabel


function setup() {
  var canvas = createCanvas(640, 480);
  canvas.position(130, 210);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  
  let options = {
    inputs: 34,
    outputs: 7,
    task: 'classification',
    debug: true
  }
  
  yogi = ml5.neuralNetwork(options);
  const modelInfo = {
    model: 'modeltrain/modeltrain.json',
    metadata: 'modeltrain/model_metatrain.json',
    weights: 'modeltrain/model.weightstrain.bin',
  };
  yogi.load(modelInfo, yogiLoaded);
}

function yogiLoaded(){
  console.log("Model ready!");
  classifyPose();
}


function classifyPose(){
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    yogi.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 1000);
  }
}

function gotResult(error, results) {
  if (results[0].confidence > 0.70) {
    if (results[0].label == "a"){
      poseLabel = "a";
      }else if(results[0].label == "b"){
          poseLabel = "b";
        }else if(results[0].label == "d"){
          poseLabel = "d";
        }else if(results[0].label == "e"){
          poseLabel = "e";
        }else if(results[0].label == "f"){
          poseLabel = "f";
        }else if(results[0].label == "h"){
          poseLabel = "h";
        }else{
          poseLabel = "i";
        }}
  classifyPose();
}


function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1,1);
  image(video, 0, 0, video.width, video.height);
  
  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(8);
      stroke(244, 194, 194);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
  }
  pop();

  fill(255, 0, 255);
  noStroke();
  if (poseLabel == "Downward Dog"){
    textSize(90);
  }else{
  textSize(150);}
  textAlign(CENTER, CENTER);
  text(poseLabel, width / 2, height / 2);
}