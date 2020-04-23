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

var modelViewMatrix, projectionMatrix, normMatrix;

var dirLightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var dirLightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var dirLightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var dirLightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var posLightPosition = vec4(1.0, 1.0, 1.0, 1.0 );
var posLightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var posLightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var posLightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 20.0;


var eyeDistance=0.2;
var eyeTheta=0;
var eyePhi=0;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);
var positionScaleFactor = 100
var eyeDistanceSlider = document.getElementById("eyeDistanceRange");
eyeDistanceSlider.oninput = function() {
    eyeDistance = this.value/positionScaleFactor;
    document.getElementById('eyeDistanceText').value=eyeDistance;
}
var eyeThetaSlider = document.getElementById("eyeThetaRange");
eyeThetaSlider.oninput = function() {
    eyeTheta = this.value/positionScaleFactor* Math.PI/180.0;
    document.getElementById('eyeThetaText').value=this.value/positionScaleFactor;
}
var eyePhiSlider = document.getElementById("eyePhiRange");
eyePhiSlider.oninput = function() {
    eyePhi = this.value/positionScaleFactor* Math.PI/180.0;
    document.getElementById('eyePhiText').value=this.value/positionScaleFactor;
}

var perspectiveFlag = false;
var fovyView = 170;
var aspectView = 1;
var nearView = -1;
var farView = 0.2;
var viewScaleFactor = 100;
var fovyViewSlider = document.getElementById("fovyViewRange");
fovyViewSlider.oninput = function() {
    fovyView = this.value;
    document.getElementById('fovyViewText').value=this.value;
}
var aspectViewSlider = document.getElementById("aspectViewRange");
aspectViewSlider.oninput = function() {
    aspectView = this.value/viewScaleFactor;
    document.getElementById('aspectViewText').value=aspectView;
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
var perspectiveCheckBox = document.getElementById("perspectiveCheckBox");
perspectiveCheckBox.onclick = function() {
    perspectiveFlag = this.checked;
    fovyViewSlider.disabled=!perspectiveFlag;
    aspectViewSlider.disabled=!perspectiveFlag;
    nearViewSlider.disabled=!perspectiveFlag;
    farViewSlider.disabled=!perspectiveFlag;
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

function initInputElements(){
    fovyViewSlider.disabled=!perspectiveFlag;
    aspectViewSlider.disabled=!perspectiveFlag;
    nearViewSlider.disabled=!perspectiveFlag;
    farViewSlider.disabled=!perspectiveFlag;
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

function get_eye(distance,theta,phi) {
    var vEye = vec3(distance*Math.sin(theta)*Math.cos(phi),
                    distance*Math.sin(theta)*Math.sin(phi),
                    distance*Math.cos(theta));
    return vEye;
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
    
    initInputElements();
    loadSolid();

    var dirAmbientProduct = mult(dirLightAmbient, materialAmbient);
    var dirDiffuseProduct = mult(dirLightDiffuse, materialDiffuse);
    var dirSpecularProduct = mult(dirLightSpecular, materialSpecular);

    // var posAmbientProduct = mult(posLightAmbient, materialAmbient);
    // var posDiffuseProduct = mult(posLightDiffuse, materialDiffuse);
    // var posSpecularProduct = mult(posLightSpecular, materialSpecular);

    // var spotAmbientProduct = mult(spotLightAmbient, materialAmbient);
    // var spotDiffuseProduct = mult(spotLightDiffuse, materialDiffuse);
    // var spotSpecularProduct = mult(spotLightSpecular, materialSpecular);


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

    gl.uniform4fv( gl.getUniformLocation(program,
        "uAmbientProduct"),flatten(dirAmbientProduct));
     gl.uniform4fv( gl.getUniformLocation(program,
        "uDiffuseProduct"),flatten(dirDiffuseProduct));
     gl.uniform4fv( gl.getUniformLocation(program,
        "uSpecularProduct"),flatten(dirSpecularProduct));
     gl.uniform4fv( gl.getUniformLocation(program,
        "uLightPosition"),flatten(dirLightPosition));
     gl.uniform1f( gl.getUniformLocation(program,
        "uShininess"),materialShininess);

    console.log(vColor);
    console.log(vPosition);
    console.log(vNormal);

    render();
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(perspectiveFlag){
        projectionMatrix = perspective(fovyView, aspectView, nearView, farView);
    }else{
        projectionMatrix = mat4();
    }
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"uProjectionMatrix"),
                        false, flatten(projectionMatrix));


    modelViewMatrix = lookAt(get_eye(eyeDistance,eyeTheta,eyePhi),at,up);
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"uModelViewMatrix"),
                        false, flatten(modelViewMatrix));

    normMatrix = normalMatrix(modelViewMatrix, true);
    gl.uniformMatrix3fv(gl.getUniformLocation(program,"uNormalMatrix"),
                        false, flatten(normMatrix)  );

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    requestAnimationFrame(render);
}
