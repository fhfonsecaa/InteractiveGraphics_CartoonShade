"use strict";

var program;
var canvas;
var gl;

var numVertices  = 120;
var numChecks = 8;

var c;

var pointsArray = [];
var colorsArray = [];
var normalsArray = [];

var modelViewMatrix, projectionMatrix;

var xAngle = 0;
var yAngle = 0;
var zAngle = 0;
var xAngleSlider = document.getElementById("xAngleRange");
xAngleSlider.oninput = function() {
    xAngle = this.value;
    document.getElementById('xAngleText').value=xAngle;
}
var yAngleSlider = document.getElementById("yAngleRange");
yAngleSlider.oninput = function() {
    yAngle = this.value;
    document.getElementById('yAngleText').value=yAngle;
}
var zAngleSlider = document.getElementById("zAngleRange");
zAngleSlider.oninput = function() {
    zAngle = this.value;
    document.getElementById('zAngleText').value=zAngle;
}

var xPosition = 0;
var yPosition = 0;
var zPosition = 0;
var positionScaleFactor = 100
var xPositionSlider = document.getElementById("xPositionRange");
xPositionSlider.oninput = function() {
    xPosition = this.value/positionScaleFactor;
    document.getElementById('xPositionText').value=xPosition;
}
var yPositionSlider = document.getElementById("yPositionRange");
yPositionSlider.oninput = function() {
    yPosition = this.value/positionScaleFactor;
    document.getElementById('yPositionText').value=yPosition;
}
var zPositionSlider = document.getElementById("zPositionRange");
zPositionSlider.oninput = function() {
    zPosition = this.value/positionScaleFactor;
    document.getElementById('zPositionText').value=zPosition;
}


var leftView = -1;
var rightView = 1;
var bottomView = -1;
var topView = 1;
var nearView = -1;
var farView = 1;
var viewScaleFactor = 100;
var leftViewSlider = document.getElementById("leftViewRange");
leftViewSlider.oninput = function() {
    leftView = this.value/viewScaleFactor;
    document.getElementById('leftViewText').value=leftView;
}
var rightViewSlider = document.getElementById("rightViewRange");
rightViewSlider.oninput = function() {
    rightView = this.value/viewScaleFactor;
    document.getElementById('rightViewText').value=rightView;
}
var bottomViewSlider = document.getElementById("bottomViewRange");
bottomViewSlider.oninput = function() {
    bottomView = this.value/viewScaleFactor;
    document.getElementById('bottomViewText').value=bottomView;
}
var topViewSlider = document.getElementById("topViewRange");
topViewSlider.oninput = function() {
    topView = this.value/viewScaleFactor;
    document.getElementById('topViewText').value=topView;
}
var nearViewSlider = document.getElementById("nearViewRange");
nearViewSlider.oninput = function() {
    nearView = this.value/viewScaleFactor;
    document.getElementById('nearViewText').value=nearView;
}
var farViewSlider = document.getElementById("farViewRange");
farViewSlider.oninput = function() {
    farView = this.value/viewScaleFactor;
    document.getElementById('farViewText').value=farView;
}


var vertices = [
    vec4(-0.30,-0.580716,0.30,1.0),
    vec4(-0.30,-0.520716,0.30,1.0),
    vec4(-0.30,-0.580716,-0.30,1.0),
    vec4(-0.30,-0.520716,-0.30,1.0),
    vec4(0.30,-0.580716,0.30,1.0),
    vec4(0.30,-0.520716,0.30,1.0),
    vec4(0.30,-0.580716,-0.30,1.0),
    vec4(0.30,-0.520716,-0.30,1.0),
    vec4(-0.60,-0.228864,0.60,1.0),
    vec4(0.00,0.979490,0.00,1.0),
    vec4(-0.60,-0.228864,-0.60,1.0),
    vec4(0.60,-0.228864,0.60,1.0),
    vec4(0.60,-0.228864,-0.60,1.0),
    vec4(-0.60,0.292376,-0.60,1.0),
    vec4(0.00,-0.915978,-0.00,1.0),
    vec4(-0.60,0.292376,0.60,1.0),
    vec4(0.60,0.292376,-0.60,1.0),
    vec4(0.60,0.292376,0.60,1.0),
    vec4(-0.30,0.589361,0.30,1.0),
    vec4(-0.30,0.649361,0.30,1.0),
    vec4(-0.30,0.589361,-0.30,1.0),
    vec4(-0.30,0.649361,-0.30,1.0),
    vec4(0.30,0.589361,0.30,1.0),
    vec4(0.30,0.649361,0.30,1.0),
    vec4(0.30,0.589361,-0.30,1.0),
    vec4(0.30,0.649361,-0.30,1.0)
];

var vertexColors = [
    // vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    // vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    // vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    // vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    // vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    // vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    // vec4( 0.0, 1.0, 1.0, 1.0 ),  // white

    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 0.0, 0.0, 1.0 )  // red

];

function get_norm(p,V,U) {
    // console.log(cross(subtract(V,p),subtract(U,p)));
    // var normal_vector = cross(subtract(V,p),subtract(U,p));
    // return [normal_vector[0],normal_vector[1],normal_vector[2],0];
    return vec3(cross(subtract(V,p),subtract(U,p)));
}

function tria(a, b, c) {
    a=a-1
    b=b-1
    c=c-1
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(get_norm(vertices[a],vertices[b],vertices[c]));

    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(get_norm(vertices[b],vertices[a],vertices[c]));

    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    normalsArray.push(get_norm(vertices[c],vertices[a],vertices[b]));
}

function quad(a, b, c, d) {
    tria(a, b, c)
    tria(a, c, d)
}

function loadSolid(){
    quad(1,2,4,3);
    quad(3,4,8,7);
    quad(7,8,6,5);
    quad(5,6,2,1);
    quad(3,7,5,1);
    quad(8,4,2,6);
    tria(9,10,11);
    tria(11,10,13);
    tria(13,10,12);
    tria(12,10,9);
    quad(11,13,12,9);
    tria(14,15,16);
    tria(16,15,18);
    tria(18,15,17);
    tria(17,15,14);
    quad(16,18,17,14);
    quad(19,20,22,21);
    quad(21,22,26,25);
    quad(25,26,24,23);
    quad(23,24,20,19);
    quad(21,25,23,19);
    quad(26,22,20,24);
}

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available" );

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    loadSolid();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
    var vNormal = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    console.log(vColor);
    console.log(vPosition);
    console.log(vNormal);

    render();
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    projectionMatrix = ortho(leftView, rightView, bottomView, topView, nearView, farView);
    gl.uniformMatrix4fv( gl.getUniformLocation(program,"uProjectionMatrix"),
        false, flatten(projectionMatrix));

    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(xPosition, yPosition, zPosition));
    modelViewMatrix = mult(modelViewMatrix, rotate(xAngle, vec3(1, 0, 0)));
    modelViewMatrix = mult(modelViewMatrix, rotate(yAngle, vec3(0, 1, 0)));
    modelViewMatrix = mult(modelViewMatrix, rotate(zAngle, vec3(0, 0, 1)));

    gl.uniformMatrix4fv(gl.getUniformLocation(program,"uModelViewMatrix"),
        false, flatten(modelViewMatrix));

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    requestAnimationFrame(render);
}
