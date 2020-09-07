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
  }
};
