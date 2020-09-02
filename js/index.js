function init(){
  var video = document.getElementById("video");
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia || navigator.oGetUserMedia || navigator.msGetUserMedia;
  if(navigator.getUserMedia){
    navigator.getUserMedia({video: true}, streamCam, throwError);
  }

  function streamCam(stream){
    video.srcObject = stream;
    video.play();
  }

  function throwError(error){
    console.log(error);
  }

  function capture(){
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    context.drawImage(video, 0, 0);
  }

  document.getElementById("capture-image").addEventListener("click", function(){
    capture();
  });
}

init();
