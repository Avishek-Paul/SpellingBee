var speakButton = document.getElementById("speak")
var answerText = document.getElementById("answer")

var synchWord;
var points = 0;

socket.on('synchWord', function(word){
  answerText.value="";
  synchWord = word.toLowerCase().trim();
  if (synchWord){
    var msg = new SpeechSynthesisUtterance()
    msg.rate = 1.2
    msg.pitch = 1
    msg.text = synchWord;
    speechSynthesis.speak(msg);   
  }
})

socket.on('playerList', (playerNames) => {
  var playerList = document.getElementById("list");
  var selfText = document.getElementById("self").innerHTML;
  while ( playerList.firstChild ) {
    playerList.removeChild( playerList.firstChild );
  }
  playerList.innerHTML = "<li id=\"self\">" + selfText + "</li>";
  for(var i in playerNames){
    var name = playerNames[i];
    if(name == username) continue;
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(name));
    playerList.appendChild(li)  
  }
});

answerText.addEventListener("keypress", function(event){
  if(event.which==13 && answerText.value != "" && synchWord){
    if(synchWord == answerText.value.toLowerCase().trim()){
      synchWord = "";
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