let canvasWidth = window.innerWidth*.8
let canvasHeight = window.innerHeight *.8

var drawing = null
var canvas
var database

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
  ref.on('value', gotData, errData)
  console.log(app)
  background(88)

  drawing = new UserDrawing();
  canvas.mousePressed(function() {
    drawing.startDraw()
  })
  canvas.mouseReleased(function() {
    drawing.endDraw()
  })
  let saveButton = select('#saveButton')
  saveButton.mousePressed(function() {
    drawing.saveDrawing(database, "Pinaki", "Creation!")
  })
  let clearButton = select('#clearButton');
  clearButton.mousePressed(clearDrawing);
}

function clearDrawing() {
  drawing = new UserDrawing();
}

function draw() {
  
  stroke(255)
  strokeWeight(5)
  noFill()
  background(88)

  drawing.checkAndUpdate(mouseX, mouseY)
  drawing.render()
}

function gotData(data) {
  var elts = selectAll('.listing');
  for (var i = 0; i < elts.length; i++) {
    elts[i].remove();
  }

  var drawings = data.val()
  var keys = Object.keys(drawings)
  for (let i = 0; i < keys.length; i++) {
    // console.log(keys[i])
    var li = createElement('li')
    li.class('listing');
    var ahref = createA('#', keys[i])
    ahref.mousePressed(showDrawing)
    ahref.parent(li)
    li.parent('drawingList')
  }
}

function showDrawing(data) {
  drawingID = this.html()
  var ref = database.ref('drawings/'+drawingID)
  ref.on('value', drawDrawing, errData)

  function drawDrawing(data) {
    console.log(data.val())
    drawing.displayNewDrawing(data.val())
  }
}


function errData(err) {
  console.log(err)
}

