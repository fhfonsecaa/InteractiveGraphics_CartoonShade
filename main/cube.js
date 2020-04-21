"use strict";

var canvas;
var gl;

var numPositions  = 120;

var positions = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [0, 0, 0];

var thetaLoc;

window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    colorCube();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);


    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    //event listeners for buttons

    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };

    render();
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

function quad(a, b, c, d) {
    a=a-1
    b=b-1
    c=c-1
    d=d-1
    positions.push(vertices[a]);
    colors.push(vertexColors[a]);

    positions.push(vertices[b]);
    colors.push(vertexColors[a]);

    positions.push(vertices[d]);
    colors.push(vertexColors[a]);

    positions.push(vertices[c]);
    colors.push(vertexColors[a]);

    positions.push(vertices[b]);
    colors.push(vertexColors[a]);

    positions.push(vertices[d]);
    colors.push(vertexColors[a]);
}

function tria(a, b, c) {
    a=a-1
    b=b-1
    c=c-1
    positions.push(vertices[a]);
    colors.push(vertexColors[a]);

    positions.push(vertices[b]);
    colors.push(vertexColors[a]);

    positions.push(vertices[c]);
    colors.push(vertexColors[a]);

    
}

function colorCube(){
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
    tria(26,22,24);
    tria(20,22,24);

}

// function quad(a, b, c, d)
// {
 

//     // We need to parition the quad into two triangles in order for
//     // WebGL to be able to render it.  In this case, we create two
//     // triangles from the quad indices

//     //vertex color assigned by the index of the vertex

//     var indices = [a, b, c, a, c, d];

//     for ( var i = 0; i < indices.length; ++i ) {
//         positions.push( vertices[indices[i]] );
//         //colors.push( vertexColors[indices[i]] );

//         // for solid colored faces use
//         colors.push(vertexColors[a]);
//     }
// }

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);
    requestAnimationFrame(render);
}
