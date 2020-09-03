function init(){
  // var video = document.getElementById("video");
  // var canvas = document.getElementById("canvas");
  // var context = canvas.getContext("2d");
  //
  // navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
  //                           navigator.mozGetUserMedia || navigator.oGetUserMedia || navigator.msGetUserMedia;
  // if(navigator.getUserMedia){
  //   navigator.getUserMedia({video: true}, streamCam, throwError);
  // }
  //
  // function streamCam(stream){
  //   video.srcObject = stream;
  //   video.play();
  // }
  //
  // function throwError(error){
  //   console.log(error);
  // }
  //
  // function capture(){
  //   canvas.width = video.clientWidth;
  //   canvas.height = video.clientHeight;
  //   context.drawImage(video, 0, 0);
  // }
  //
  // document.getElementById("capture-image").addEventListener("click", function(){
  //   capture();
  // });
}
init();

$("#file-upload-icon-btn").click(function(){
  $('input[type="file"]').trigger('click');
});

function readFile(input){
  if(input.files && input.files[0]){
    var fileReader = new FileReader();
    fileReader.onload = function(event){
      document.getElementById("loaded-image").setAttribute("src", event.target.result);
    };
    fileReader.readAsDataURL(input.files[0]);
  }
}

var originalImage = document.getElementById("loaded-image");
var filteredImage = document.getElementById("filtered-image");

filteredImage.hidden = true;


document.getElementById("filter-list").addEventListener("click", function(event){
  originalImage.hidden = true;
  filteredImage.hidden = false;

  context = filteredImage.getContext('2d');
  filteredImage.width = originalImage.width;
  filteredImage.height = originalImage.height;

  context.drawImage(originalImage, 0, 0);

  var filterName = event.target.getAttribute("filter-name");

  var imageData = Filter[filterName](context);

  context.putImageData(imageData, 0, 0);

});


var Filter = {
  'FilterOne': function(context){

    var imageData = context.getImageData(0,0,filteredImage.width, filteredImage.height);
    var imageArray = imageData.data;


    for(var i = 0, n = imageArray.length; i < n; i+=4){
      imageArray[i] = imageArray[i];
      imageArray[i+1] = imageArray[i];
      imageArray[i+2] = imageArray[i];
      imageArray[i+3] = imageArray[i];
    }
    return imageData;
  },
  'FilterTwo': function(context){

    var imageData = context.getImageData(0,0,filteredImage.width, filteredImage.height);
    var imageArray = imageData.data;

    for(var i = 0, n = imageArray.length; i < n; i+=4){
      imageArray[i] = imageArray[i];
      imageArray[i+1] = 255;
      imageArray[i+2] = 255;
      imageArray[i+3] = imageArray[i];
    }
    return imageData;
  }
};
