let video;
let poseNet;
let pose;
let skeleton;
let thirtysecs;
let posesArray = ['Mountain', 'Tree', 'Downward Dog', 'Warrior II'];

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
    outputs: 6,
    task: 'classification',
    debug: true
  }
  
  yogi = ml5.neuralNetwork(options);
  const modelInfo = {
    model: 'modelv2/model2.json',
    metadata: 'modelv2/model_meta2.json',
    weights: 'modelv2/model.weights2.bin',
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
    if (results[0].label == "1"){
      poseLabel = "Mountain";
      }else if(results[0].label == "2"){
          poseLabel = "Tree";
        }else if(results[0].label == "3"){
          poseLabel = "Downward Dog";
        }else if(results[0].label == "4"){
          poseLabel = "Warrior 1";
        }else if(results[0].label == "5"){
          poseLabel = "Warrior 2";
        }else{
          poseLabel = "Chair";
        }}
  //startTimer(thirtysecs, display);
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

function startTimer(duration, display) {
  var timer = duration, minutes, seconds;
  setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
          timer = duration;
          //classifyPose();
      }
  }, 1000);
}

window.onload = function () {
  thirtysecs = 60 * 0.5, display = document.querySelector('#time');
};