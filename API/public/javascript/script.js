/**
 * Created by jw479 on 24/02/2017.
 */
var socket = null;
var canvas = null;
var ctx = null;
var width = 0;
var height = 0;

//Colour Definition
var priCol =  '#ff0013';
var secCol =  '#111';
var triCol =  '#fff';
var backCol = '#555';
var selectCol = '#fff';
var deselectCol = '#a50012';

//Menu init colours
var opt0 = selectCol;
var opt1 = deselectCol;
var opt2 = deselectCol;
var opt3 = deselectCol;
var opt4 = deselectCol;

//Selected
var selectPtr = 0;
var selectMode = 5;

//Data From Server
var battery = '--';

//Drone
var droneCon = false;
var longitudeDrone = null;
var latitudeDrone = null;
var altitudeDrone = null;

//Myo
var myoCon = false;
var pose = null;

//Android
var androidCon = false;
var longitudeAndroid = null;
var latitudeAndroid = null;
var accuaracyAndroid = null

window.onload = function() {
    //Set up socket with server for dynamic content
    socket = io.connect('http://52.56.154.153:3000');

    //Get canvas and build content.
    canvas = document.getElementById("canvas");
    canvas.style.backgroundColor = backCol;
    ctx =canvas.getContext("2d");

    getMyoData();
    getDroneData();
    getAndroidData();
    dataListener();
    drawScreen();
};

window.after

function getDroneData(){
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            updateDrone(JSON.parse(xmlhttp.responseText));
    };
    xmlhttp.open("GET", "http://fyp.joelwalker.co.uk:3000/api/droneUpdateStatus/58b82b7d2cc965257c433dea", true); // true for asynchronous
    xmlhttp.send(null);
}
function getMyoData(){
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            updateMyo(JSON.parse(xmlhttp.responseText));
    };
    xmlhttp.open("GET", "http://fyp.joelwalker.co.uk:3000/api/myoUpdateStatus/58b829c6280587252ed0bec8", true); // true for asynchronous
    xmlhttp.send(null);
}

function getAndroidData(){
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            updateAndroid(JSON.parse(xmlhttp.responseText));
    };
    xmlhttp.open("GET", "http://fyp.joelwalker.co.uk:3000/api/androidUpdateStatus/58bd763df96e8a2b6573ceda", true); // true for asynchronous
    xmlhttp.send(null);
}

function drawScreen() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width  = width;
    canvas.height = height;

    if(selectMode == 5){
        drawMenu();
        //settingsMode();
    }else if (selectMode == 0){
        mapMode();
    }else if (selectMode == 1){
        tourMode();
    }else if (selectMode == 2){
        cameraMode();
    }else if (selectMode == 3){
        controlsMode();
    }else if (selectMode == 4){
        settingsMode();
    }


    drawFrame();

    window.requestAnimationFrame(drawScreen);
}

function drawFrame() {
    //Menu bar
    ctx.beginPath();
    ctx.rect(0,0, width,50);
    ctx.fillStyle = priCol;
    ctx.fill();

    //Page Title Background
    ctx.fillStyle = secCol;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(400, 0);
    ctx.lineTo(440, 50);
    ctx.lineTo(40, 50);
    ctx.closePath();
    ctx.fill();

    //Page title text
    ctx.font = "bold 30px Raleway";
    ctx.fillStyle = priCol;
    ctx.textAlign = "right";
    ctx.fillText("Bebob Drone Tour Guide", 390, 35);

    //Battery Background
    ctx.fillStyle = secCol;
    ctx.beginPath();
    ctx.moveTo(width -150, 0);
    ctx.lineTo(width -40 , 0);
    ctx.lineTo(width , 50);
    ctx.lineTo(width -110, 50);
    ctx.closePath();
    ctx.fill();

    //Battery text
    ctx.font = "bold 30px Raleway";
    ctx.fillStyle = priCol;
    ctx.textAlign = "center";
    ctx.fillText( battery +"%", width - 75, 35);

    //Footer
    ctx.beginPath();
    ctx.rect(0, height-30, width, height);
    ctx.fillStyle = secCol;
    ctx.fill();

    //Debug text
    ctx.font = "bold 20px Raleway";
    ctx.fillStyle = priCol;
    ctx.textAlign = "left";
    ctx.fillText( "Debug :: Drone " + droneCon +" | Myo " + myoCon + " | Android " + androidCon , 10, height -10);

    //GPS text
    ctx.font = "bold 20px Raleway";
    ctx.fillStyle = priCol;
    ctx.textAlign = "center";
    ctx.fillText( "Made by Joel Walker " , width -100, height -10);
}

function drawMenu() {

    var x = width/2;

    //Option 1
    ctx.beginPath();
    ctx.arc(x -350,175,100,0,2*Math.PI);
    ctx.fillStyle = priCol;
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = opt0;
    ctx.stroke();

    ctx.font = "40px Raleway";
    ctx.fillStyle = triCol;
    ctx.textAlign = "center";
    ctx.fillText( "Map" , x-350, 190);

    //Option 2
    ctx.beginPath();
    ctx.arc(x,175,100,0,2*Math.PI);
    ctx.fillStyle = priCol;
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = opt1;
    ctx.stroke();

    ctx.font = "40px Raleway";
    ctx.fillStyle = triCol;
    ctx.textAlign = "center";
    ctx.fillText( "Tour" , x, 190);

    //Option 3
    ctx.beginPath();
    ctx.arc(x +350,175,100,0,2*Math.PI);
    ctx.fillStyle = priCol;
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = opt2;
    ctx.stroke();

    ctx.font = "40px Raleway";
    ctx.fillStyle = triCol;
    ctx.textAlign = "center";
    ctx.fillText( "Camera" , x+350, 190);

    //Option 4
    ctx.beginPath();
    ctx.arc(x -175,375,100,0,2*Math.PI);
    ctx.fillStyle = priCol;
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = opt3;
    ctx.stroke();

    ctx.font = "40px Raleway";
    ctx.fillStyle = triCol;
    ctx.textAlign = "center";
    ctx.fillText( "Controls" , x-175, 390);

    //Option 4
    ctx.beginPath();
    ctx.arc(x +175,375,100,0,2*Math.PI);
    ctx.fillStyle = priCol;
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = opt4;
    ctx.stroke();

    ctx.font = "40px Raleway";
    ctx.fillStyle = triCol;
    ctx.textAlign = "center";
    ctx.fillText( "Settings" , x+175, 390);

}

function mapMode() {
    ctx.font = "40px Raleway";
    ctx.fillStyle = triCol;
    ctx.textAlign = "center";
    ctx.fillText( "Map Coming Soon" , width/2, height/2);
}

function tourMode() {
    ctx.font = "40px Raleway";
    ctx.fillStyle = triCol;
    ctx.textAlign = "center";
    ctx.fillText( "Tour Coming Soon" , width/2, height/2);
}

function cameraMode() {
    ctx.font = "40px Raleway";
    ctx.fillStyle = triCol;
    ctx.textAlign = "center";
    ctx.fillText( "Camera Coming Soon" , width/2, height/2);
}

function controlsMode() {
    ctx.font = "40px Raleway";
    ctx.fillStyle = triCol;
    ctx.textAlign = "center";
    ctx.fillText( "Flight Controls Coming Soon" , width/2, height/2);
}

function settingsMode() {
    ctx.font = "40px Raleway";
    ctx.fillStyle = triCol;
    ctx.textAlign = "left";
    ctx.fillText( "Settings/Debug Info:" , 30, 100);

    ctx.font = "40px Raleway";
    ctx.fillStyle = triCol;
    ctx.textAlign = "left";
    ctx.fillText( "Android (Connected :  " + androidCon + ")" , 30, 200);

    ctx.font = "40px Raleway";
    ctx.fillStyle = triCol;
    ctx.textAlign = "left";
    ctx.fillText( "Longitude: " + longitudeAndroid  + " | Latitude: " + latitudeAndroid + " | Accuracy: "  + accuaracyAndroid, 30, 260);

    ctx.font = "40px Raleway";
    ctx.fillStyle = triCol;
    ctx.textAlign = "left";
    ctx.fillText( "Drone (Connected :  " + droneCon + ")" , 30, 340);

    ctx.font = "40px Raleway";
    ctx.fillStyle = triCol;
    ctx.textAlign = "left";
    ctx.fillText( "Longitude: " + longitudeDrone  + " | Latitude: " + latitudeDrone + " | Altitude: "  + altitudeDrone, 30, 400);
}

function selectedUpdate(pose){
    if(selectMode == 5){
        menuMode(pose);
    }else{
        comingSoon(pose);
    }
}

function comingSoon(pose) {

    if(pose == 3){
        selectMode = 5;
    }
}

function menuMode(pose) {
    if(pose == 4){
        selectPtr = selectPtr + 1;
        console.log(selectPtr);
        if(selectPtr == 5){
            selectPtr = 0;
        }
    }else if(pose == 3){
        selectPtr = selectPtr - 1;
        if(selectPtr == -1){
            selectPtr = 4;
        }
    }

    if(pose == 2){
        selectMode = selectPtr;
    }

    switch (selectPtr) {
        case 0:
            opt0 = selectCol;
            opt1 = deselectCol;
            opt2 = deselectCol;
            opt3 = deselectCol;
            opt4 = deselectCol;
            break;
        case 1:
            opt0 = deselectCol;
            opt1 = selectCol;
            opt2 = deselectCol;
            opt3 = deselectCol;
            opt4 = deselectCol;
            break;
        case 2:
            opt0 = deselectCol;
            opt1 = deselectCol;
            opt2 = selectCol;
            opt3 = deselectCol;
            opt4 = deselectCol;
            break;
        case 3:
            opt0 = deselectCol;
            opt1 = deselectCol;
            opt2 = deselectCol;
            opt3 = selectCol;
            opt4 = deselectCol;
            break;
        case 4:
            opt0 = deselectCol;
            opt1 = deselectCol;
            opt2 = deselectCol;
            opt3 = deselectCol;
            opt4 = selectCol;
            break;
    }

}

function updateMyo(data){
    if(data.pose !== undefined) {
        selectedUpdate(data.pose);
    }

    if(data.connected !== undefined) {
        myoCon = data.connected;
    }
}

function updateDrone(data){
    if(data.battery !== undefined){
        battery = data.battery;
    }

    if(data.connected !== undefined) {
        droneCon = data.connected;
        if(!droneCon){
            battery = '--'
        }
    }
    if(data.latitude !== undefined){
        latitudeDrone = data.latitude
    }
    if(data.longitude !== undefined){
        longitudeDrone = data.longitude
    }
    if(data.Altitude !== undefined){
        altitudeDrone= data.Altitude
    }
}

function updateAndroid(data){
    if(data.connected !== undefined) {
        androidCon = data.connected;
    }
    if(data.latitude !== undefined){
        latitudeAndroid = data.latitude
    }
    if(data.longitude !== undefined){
        longitudeAndroid = data.longitude
    }
    if(data.accuracy !== undefined){
        accuaracyAndroid = data.accuracy
    }
}
function dataListener() {
    //Called on myo state change
    socket.on('updateMyo', function (data) {
        updateMyo(data)
    });

    //Called on drone state change
    socket.on('updateDrone', function (data) {
        updateDrone(data)
    });

    //Called on android state change
    socket.on('updateAndroid', function (data) {
        updateAndroid(data)
    });

}

