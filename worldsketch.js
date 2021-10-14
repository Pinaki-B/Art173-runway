let canvasWidth = window.innerWidth * 0.8
let canvasHeight = window.innerHeight * 0.8

var world
var characters

function setup() {
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvascontainer')

  const firebaseConfig = {
    apiKey: "AIzaSyDnmE3mIPo24XVyylvSpZZBDemGnhpuLQM",
    authDomain: "runway-173.firebaseapp.com",
    projectId: "runway-173",
    storageBucket: "runway-173.appspot.com",
    messagingSenderId: "611568635962",
    appId: "1:611568635962:web:feca109fb631d36a432503",
    measurementId: "G-VW7CYF2RLY",
    databaseURL: "https://runway-173-default-rtdb.firebaseio.com/"
  };

  // Initialize Firebase
  var app = firebase.initializeApp(firebaseConfig)
  database = firebase.database()
  var ref = database.ref('drawings')
  world = new World(canvasWidth, canvasHeight, database)
}

function draw() {
  background(255)
  world.display()
}

function errData(err) {
  console.log(err)
}

// function gotData(data) {
//   console.log(data.val())
//   console.log(typeof(data.val()))
//   characters = data.val()
// }


