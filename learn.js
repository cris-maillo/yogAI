let video;
let poseNet;
let pose;
let skeleton;
let thirtysecs;
let posesArray = ['Mountain', 'Tree', 'Downward Dog', 'Warrior I', 'Warrior II', 'Chair'];

let yogi;
let poseLabel;

var targetLabel;
var errorCounter;
var iterationCounter;
var poseCounter;
var target;


function setup() {
  var canvas = createCanvas(640, 480);
  canvas.position(130, 210);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  console.log("Upddsszd!!!");
  
  poseCounter = 0;
  targetLabel = 1;
  target = posesArray[poseCounter];
  document.getElementById("poseName").textContent = target;
  errorCounter = 0;
  iterationCounter = 0;
  
  
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
    console.log("Pose not found");
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {
  if (results[0].confidence > 0.70) {
    if (results[0].label == targetLabel.toString()){
        errorCounter = 0;
        console.log(targetLabel);
        //start timer
        iterationCounter = iterationCounter + 1;
        if (iterationCounter >= 30){
            iterationCounter = 0;
            setTimeout(nextPose, 1000);
        }else{
          console.log("no u stupid btich");
          errorCounter = errorCounter + 1;
          if (errorCounter >= 2){
              iterationCounter = 0;
              errorCounter = 0;
              setTimeout(classifyPose, 1000);
          }
        }
    }else{
      console.log("fuck u");
    }
  classifyPose();
}}


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

function nextPose(){
  if (poseCounter >= 5) {
    console.log("Well done, you have learnt all poses!")
    //congratulations something do sometjing
  }else{
    iterationCounter = 0;
    poseCounter = poseCounter + 1;
    targetLabel = poseCounter;
    console.log("next pose target lable" + targetLabel)
    target = posesArray[poseCounter];
    document.getElementById("poseName").textContent = target;
    classifyPose();}
}