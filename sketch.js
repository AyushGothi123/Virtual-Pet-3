//Create variables here
var dog,happyDog,foodS,foodStock,database;
var dogImage,happyDogImage,sadDog;
var fedTime,lastFed,foodObj;
var changingGameState,readingGameState;
var bedroomImg,gardenImg,washroomImg;
function preload()
{
  //load images here
  dogImage = loadImage("images/Dog.png");
  happyDogImage = loadImage("images/happydog.png");
  bedroomImg = loadImage("images/Bed Room.png");
  washroomImg = loadImage("images/Wash Room.png");
  gardenImg = loadImage("images/Garden.png");
  sadDog = loadImage("images/Lazy.png")
}

function setup() {
  createCanvas(500, 500);
  database = firebase.database();
  console.log(database);

  var dog = createSprite(200,200,50,50);
  dog.addImage("dog",dogImage);
  dogImage.scale = 0.1;

   var happyDog = createSprite(250,250,50,50);
   happyDog.addImage("happyDog",happyDogImage);

  foodStock = database.ref('Food');
  foodStock.on("value",readStock)

  feed = createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed("feedDog");

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods)

  readState = database.ref('gameState')
  readState.on("value",function(data){
    gameState = data.val();
  })
}


function draw() {  
background(46,139,87);


 fill(255,255,254);
 textSize(15)
 if(lastFed>=12){
   text("Last Fed :"+lastFed%12+"PM" ,350,30)
 }else if(lastFed=0){
   text("Last Fed :AM",350,30)
 }else {
   text("Last Fed :"=lastFed%12+"AM")
 }

 fedTime = database.ref("FeedTime")
 fedTime.on("value",function(data){
   lastFed = data.val(); 
  });

  if(gameState!="Hungry"){
feed.hide();
addFood.hide();
dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog)
  }
  currentTime = hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime==(lastFed+3)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry")
    foodObj.display();
  }


drawSprites();
 

}

function readStock(data){
foodS = data.val();


}

function writeStock(x){
if(x<=0){
x=0;
}else{
  x= x-1;

}
  database.ref('/').update({
 Food:x 
})

}

function feedDog(){
dog.addImage(happyDogImage)
foodObj.updateFoodStock(foodObj.getFoodStock()-1)
database.ref("/").update({
  Food:foodObj.getFoodStock(),
  FeedTime:hour()
})
}

function addFoods(){
foodS++;
database.ref("/").update({
  Food:foodS
})


}

function update(state){
  database.ref("/").update({
    gameState:state
  });
}

