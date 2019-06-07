var speakButton = document.getElementById("speak")
var answerText = document.getElementById("answer")

var synchWord;
var firstSpoke = false;
var points = 0;

socket.on('synchWord', function(word){
  answerText.value="";
  synchWord = word.trim();
  if (synchWord && !firstSpoke){
    firstSpoke = true;
    var msg = new SpeechSynthesisUtterance()
    msg.rate = 1.2
    msg.pitch = 1
    msg.text = synchWord;
    speechSynthesis.speak(msg);   
  }
})

answerText.addEventListener("keypress", function(event){
  if(event.which==13 && answerText.value != "" && synchWord){
    if(synchWord == answerText.value.trim()){
      synchWord = "";
      firstSpoke = false;
      socket.emit('requestWord', roomID);
      points++;
      document.getElementById("points").innerHTML = "Points: " + points;
    }
  }
})

speakButton.addEventListener("click", function(){
  if(!synchWord) return;
  var msg = new SpeechSynthesisUtterance()
  msg.rate = 1.2
  msg.pitch = 1
  msg.text = synchWord;
  speechSynthesis.speak(msg); 
})