function init(){

  document.querySelector("#file-upload-icon-btn").addEventListener("click", function(){
    document.querySelector('input[type="file"]').click();
  });


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
}
init();

function readFile(input){
  if(input.files && input.files[0]){
    var fileReader = new FileReader();
    fileReader.onload = function(event){
      document.getElementById("loaded-image").setAttribute("src", event.target.result);
      originalImage.hidden = false;
      filteredImage.hidden = true;
    };
    fileReader.readAsDataURL(input.files[0]);
  }
}

var originalImage = document.getElementById("loaded-image");
var filteredImage = document.getElementById("filtered-image");

filteredImage.hidden = true;





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
  },
  'NeonFilter': function(context){
    var imageData = context.getImageData(0,0,filteredImage.width, filteredImage.height);
    // var imageArray = imageData.data;
    //
    // for(var i = 0, n = imageArray.length; i < n; i+=4){
    //   imageArray[i] = imageArray[i];
    //   imageArray[i+1] = 255;
    //   imageArray[i+2] = 255;
    //   imageArray[i+3] = imageArray[i];
    // }
    return Filter.convolute(imageData,   [  0, -1,  0,
    -1,  5, -1,
     0, -1,  0 ]);
  },
  convolute: function(data, weights, opaque){
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side/2);
    var src = data.data;
    var sw = data.width;
    var sh = data.height;
    var w = sw;
    var h = sh;
    var dst = data.data;
    var alphaFac = opaque ? 1 : 0;
    for (var y=0; y<h; y++) {
      for (var x=0; x<w; x++) {
        var sy = y;
        var sx = x;
        var dstOff = (y*w+x)*4;
        // calculate the weighed sum of the source image pixels that
        // fall under the convolution matrix
        var r=0, g=0, b=0, a=0;
        for (var cy=0; cy<side; cy++) {
          for (var cx=0; cx<side; cx++) {
            var scy = sy + cy - halfSide;
            var scx = sx + cx - halfSide;
            if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
              var srcOff = (scy*sw+scx)*4;
              var wt = weights[cy*side+cx];
              r += src[srcOff] * wt;
              g += src[srcOff+1] * wt;
              b += src[srcOff+2] * wt;
              a += src[srcOff+3] * wt;
            }
          }
        }
        dst[dstOff] = r;
        dst[dstOff+1] = g;
        dst[dstOff+2] = b;
        dst[dstOff+3] = 255;
      }
    }
    return data;
  }
};
