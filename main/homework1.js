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
var spotLightRotationMatrix;

var globalLightAmbient = vec4(0.3, 0.3,0.3,1.0);

var dirLightFlag = true;
var dirLightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var dirLightAmbient = vec4(0.1, 0.1, 0.1, 1.0 );
var dirLightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var dirLightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var spotLightFlag = false;
var spotLightPosition = vec4(1.0, -2.0, -1.0, 1.0 );
var spotLightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var spotLightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var spotLightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var spotLightDirection = vec4(-0.5,3.0,2.0,1.0);
var spotLightLimit = 20;

var materialAmbient = vec4( 0.1, 0.2, 0.1, 1.0 );
var materialDiffuse = vec4( 1.0, 0.5, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 20;

var eyeDistance=-0.1;
var eyeTheta=30;
var eyePhi=30;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);
var positionScaleFactor = 100;
var spotLightRotation = 0;
var eyeDistanceSlider = document.getElementById("eyeDistanceRange");
eyeDistanceSlider.oninput = function() {
    eyeDistance = this.value/positionScaleFactor;
    document.getElementById('eyeDistanceText').value=eyeDistance;
}
var eyeThetaSlider = document.getElementById("eyeThetaRange");
eyeThetaSlider.oninput = function() {
    eyeTheta = this.value;
    document.getElementById('eyeThetaText').value=this.value;
}
var eyePhiSlider = document.getElementById("eyePhiRange");
eyePhiSlider.oninput = function() {
    eyePhi = this.value;
    document.getElementById('eyePhiText').value=this.value;
}
var spotLightRotationSlider = document.getElementById("spotLightRotationRange");
spotLightRotationSlider.oninput = function() {
    spotLightRotation = this.value;
    document.getElementById('spotLightRotationText').value=this.value;
}
var spotLightLimitSlider = document.getElementById("spotLightLimitRange");
spotLightLimitSlider.oninput = function() {
    spotLightLimit = this.value;
    document.getElementById('spotLightLimitText').value=this.value;
}
var dirLightCheckBox = document.getElementById("dirLightCheckBox");
dirLightCheckBox.onclick = function() {
    dirLightFlag = this.checked;
}
var spotLightCheckBox = document.getElementById("spotLightCheckBox");
spotLightCheckBox.onclick = function() {
    spotLightFlag = this.checked;
    spotLightRotationSlider.disabled=!spotLightFlag;
    spotLightLimitSlider.disabled=!spotLightFlag;
}

var perspectiveFlag = false;
var fovyView = 170;
var aspectView = 1;
var nearView = -1;
var farView = 0.1;
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

var phongModelFlag = true;

var phongModelRadioButton = document.getElementById("phongModelRadioButton");
var cartoonModelRadioButton = document.getElementById("cartoonModelRadioButton");
phongModelRadioButton.onclick = function() {
    phongModelFlag = this.checked;
}
cartoonModelRadioButton.onclick = function() {
    phongModelFlag = !this.checked;
}

var texture = null;
var textureFlag = false;

var textureCheckBox = document.getElementById("textureCheckBox");
textureCheckBox.onclick = function() {
    textureFlag = this.checked;
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
    return vec3(cross(subtract(V,p),subtract(U,p)));
}

function tria(a, b, c) {
    var ac=a-1
    var bc=b-1
    var cc=c-1
    var normal = get_norm(vertices[ac],vertices[bc],vertices[cc]);

    pointsArray.push(vertices[ac]);
    colorsArray.push(vertexColors[ac]);
    normalsArray.push(normal);

    pointsArray.push(vertices[bc]);
    colorsArray.push(vertexColors[ac]);
    normalsArray.push(normal);

    pointsArray.push(vertices[cc]);
    colorsArray.push(vertexColors[ac]);
    normalsArray.push(normal);
}

function quad(a, b, c, d) {
    var ac=a-1
    var bc=b-1
    var cc=c-1
    var dc=d-1
    var normal = get_norm(vertices[ac],vertices[bc],vertices[cc]);

    pointsArray.push(vertices[ac]);
    colorsArray.push(vertexColors[ac]);
    normalsArray.push(normal);
    pointsArray.push(vertices[bc]);
    colorsArray.push(vertexColors[ac]);
    normalsArray.push(normal);
    pointsArray.push(vertices[cc]);
    colorsArray.push(vertexColors[ac]);
    normalsArray.push(normal);
    pointsArray.push(vertices[ac]);
    colorsArray.push(vertexColors[ac]);
    normalsArray.push(normal);
    pointsArray.push(vertices[cc]);
    colorsArray.push(vertexColors[ac]);
    normalsArray.push(normal);
    pointsArray.push(vertices[dc]);
    colorsArray.push(vertexColors[ac]);
    normalsArray.push(normal);
}

function initInputElements(){
    fovyViewSlider.disabled=!perspectiveFlag;
    aspectViewSlider.disabled=!perspectiveFlag;
    nearViewSlider.disabled=!perspectiveFlag;
    farViewSlider.disabled=!perspectiveFlag;

    spotLightRotationSlider.disabled=!spotLightFlag;
    spotLightLimitSlider.disabled=!spotLightFlag;

    dirLightCheckBox.checked = dirLightFlag;

    phongModelRadioButton.checked = phongModelFlag;
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

function configureTexture(image) {
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 0);
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

    var spotAmbientProduct = mult(spotLightAmbient, materialAmbient);
    var spotDiffuseProduct = mult(spotLightDiffuse, materialDiffuse);
    var spotSpecularProduct = mult(spotLightSpecular, materialSpecular);

    var dirCi = add(add(mult(globalLightAmbient,materialAmbient),mult(dirLightDiffuse,materialAmbient)),mult(dirLightDiffuse,materialDiffuse));
    var spotCi = add(add(mult(globalLightAmbient,materialAmbient), mult(spotLightDiffuse,materialAmbient)),mult(spotLightDiffuse,materialDiffuse));

    var dirCs = add(mult(globalLightAmbient,materialAmbient),mult(dirLightDiffuse,materialAmbient));
    var spotCs = add(mult(globalLightAmbient,materialAmbient),mult(spotLightDiffuse,materialAmbient));

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
        "uDirAmbientProduct"),flatten(dirAmbientProduct));
     gl.uniform4fv( gl.getUniformLocation(program,
        "uDirDiffuseProduct"),flatten(dirDiffuseProduct));
     gl.uniform4fv( gl.getUniformLocation(program,
        "uDirSpecularProduct"),flatten(dirSpecularProduct));
     gl.uniform4fv( gl.getUniformLocation(program,
        "uDirLightPosition"),flatten(dirLightPosition));
     gl.uniform1f( gl.getUniformLocation(program,
        "uShininess"),materialShininess);

    gl.uniform4fv( gl.getUniformLocation(program,
        "uSpotAmbientProduct"),flatten(spotAmbientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "uSpotDiffuseProduct"),flatten(spotDiffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "uSpotSpecularProduct"),flatten(spotSpecularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "uSpotLightPosition"),flatten(spotLightPosition) );
    gl.uniform1f( gl.getUniformLocation(program,
        "uSpotLightDirection"),spotLightDirection );

    gl.uniform4fv( gl.getUniformLocation(program,
        "uDirCi"),flatten(dirCi) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "uSpotCi"),flatten(spotCi) );

    gl.uniform4fv( gl.getUniformLocation(program,
        "uDirCs"),flatten(dirCs) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "uSpotCs"),flatten(spotCs) );

    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);
    
    var image = document.getElementById("texImage");
    configureTexture(image);

    render();
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform1f(gl.getUniformLocation(program,"uDirLightFlag"), dirLightFlag);
    gl.uniform1f(gl.getUniformLocation(program,"uSpotLightFlag"), spotLightFlag);
    gl.uniform1f(gl.getUniformLocation(program,"uPhongModelFlag"), phongModelFlag);

    gl.uniform1f(gl.getUniformLocation(program,"uTextureFlag"), textureFlag);

    gl.uniform1f(gl.getUniformLocation(program,"uSpotLightLimit"), Math.cos(radians(spotLightLimit)));

    spotLightRotationMatrix = mat4();
    spotLightRotationMatrix = mult(spotLightRotationMatrix, rotate(spotLightRotation, vec3(0, 1, 0)));
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"uSpotLightRotationMatrix"),
                        false, flatten(spotLightRotationMatrix));

    if(perspectiveFlag){
        projectionMatrix = perspective(fovyView, aspectView, nearView, farView);
    }else{
        projectionMatrix = mat4();
    }
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"uProjectionMatrix"),
                        false, flatten(projectionMatrix));

    modelViewMatrix = lookAt(get_eye(eyeDistance,radians(eyeTheta),radians(eyePhi)),at,up);
    gl.uniformMatrix4fv(gl.getUniformLocation(program,"uModelViewMatrix"),
                        false, flatten(modelViewMatrix));

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    requestAnimationFrame(render);
}