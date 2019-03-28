import { Component, OnInit } from '@angular/core';
import { template } from '@angular/core/src/render3';

@Component({
  selector: 'app-rewriter',
  templateUrl: './rewriter.component.html',
  styleUrls: ['./rewriter.component.css']
})
export class RewriterComponent implements OnInit {

  userText:string; //text given by the user
  userTextArray;
  wordBank = []; //use this to store words and words following them
  processedText = ""; //rewritten text
  lastWord=""; //keeps track of the last word submitted
  sensN = 2; //How many last letters kept after each word? for example My darliNG -> My freakiNG 
  specialCharacters = [".", ",", ";", ":", "!", "?", "[", "]", "(", ")", '"', "—", "”", "*"]; //spec_characters used it text
  charsUsedInWords = ["-"];
  wordBreaks = [" ", "\n"];

  constructor() {
    this.wordBank = [{b_word: "", b_follow: []}];
  }

  ngOnInit() {
  }

  processToBank(){
    var procText;
    procText = this.userText.replace(/\n. |\r/g, ""); //delete all linebreaks
    procText = procText.replace(/[^0-9a-zA-ZöåäÖÅÄ ']/g, ""); //delete everything except a-z, 0-9 and " "
    procText = procText.replace(/ +(?= )/g,''); //delete multiple spaces
    this.userTextArray = procText.split(" ");  //make into array
    for(var i = 0; i < this.userTextArray.length; i++){
      this.addToBank(this.userTextArray[i]);
    }
    /*for(var i = 0; i<this.userText.length; i++){                                 //go through userText..
      if(this.userText.charAt(i).match(/^[a-zA-ZäöåÄÖÅ0-9]+$/) || this.userText.charAt(i) == "'"
      || this.charsUsedInWords.indexOf(this.userText.charAt(i)) != -1){          //if next character is a letter
        word += this.userText.charAt(i);                                         //add it to word
      }
      else if(this.specialCharacters.indexOf(this.userText.charAt(i)) != -1){    //if next char is special char
        if(word.length != 0){
          this.addToBank(word, firstWord);
          firstWord = true;
        }
        word="";
      }
      else{                                                                       //next char is for example " "
        if(word.length != 0){
          this.addToBank(word,firstWord);
          firstWord = false;
        }
        word="";
      }
    }*/
    this.logBank();
    this.constructSentence(); 
  }

  addToBank(word:string){
    if(!this.bankSearch(this.lastWord)){ //if it doesn't exist in bank, create it
      this.wordBank.push({b_word: this.lastWord, b_follow: []});
    }
    if(word.charAt(0) != word.charAt(0).toUpperCase()){
      for(var i = 0; i < this.wordBank.length; i++){ //search for last word and add it to there
          if(this.wordBank[i].b_word == this.lastWord){
            this.wordBank[i].b_follow.push(word);
          }
      }
    }
    this.lastWord = word;
  }

  bankSearch(word){ //is word in wordbank? true/false
    for(var i = 0; i < this.wordBank.length; i++){
      if(this.wordBank[i].b_word == word){
        return true;
      }
    }
    return false;
  }

  bankIndex(word){ //return index of word, if not found return -1
    for(var i = 0; i < this.wordBank.length; i++){
      if(this.wordBank[i].b_word == word){
        return i;
      }
    }
    return -1;
  }

  logBank(){
    for(var i = 0; i < this.wordBank.length; i++){
      console.log("Word:"+this.wordBank[i].b_word);
      for(var a = 0; a < this.wordBank[i].b_follow.length; a++){
        console.log(this.wordBank[i].b_follow[a]);
      }
    }
  }

  followLength(tempArray){
    return tempArray.length;
  }

  getRandomFromBank(word){
    var bIndex = this.bankIndex(word);
    if(bIndex != -1 && this.wordBank[bIndex].b_follow.length > 0){        //word(s) are found
      var tempArray = this.wordBank[bIndex].b_follow;
      tempArray.filter(word => word.substring(word.length-this.sensN));   //filter off based by last letters being different
      tempArray.filter(word => word.length < 4);                          //filter off words with length less than 4
      if(tempArray.length == 0){                                          //if no items are left, forget word being less than 4 long
        var a = tempArray.length;
        var rnd = Math.floor((Math.random() * a) + 0);
        var tempArray = this.wordBank[bIndex].b_follow
        tempArray.filter(word => word.substring(word.length-this.sensN));
        console.log("Random1:" + tempArray[rnd])
        return tempArray[rnd];
      }
      else{                                                               //returns following word with length > 3 and same last letters
        var a = tempArray.length;
        var rnd = Math.floor((Math.random() * a) + 0);
        console.log("Random2:" + tempArray[rnd])
        return tempArray[rnd];
      }
    }
    else{
      return "";
    }
  }

  constructSentence(){
    var storyArray = [];
    var tArray = [];
    var firstWord = true; //is it first word of sentence?

    tArray = this.userText.match(/\w+|\s+|[^\s\w]+/g); //split by literally everything but leave words together

    for(var i = 0; i < tArray.length; i++){
      if(tArray[i].charAt(0).match(/[a-zåöä]/i)){ //is a word
        if(firstWord || tArray[i].charAt(0) == tArray[i].charAt(0).toUpperCase()){
          storyArray.push(tArray[i]);
          firstWord = false;
        }
        else if(tArray[i].length < 4 || i%3 == 0){
          storyArray.push(tArray[i]);
        }
        else{
          var word = this.getRandomFromBank(tArray[i]);
          if(word == ""){
            storyArray.push(tArray[i]);
          }
          else{
            storyArray.push(this.getRandomFromBank(this.lastWord));
          }
        }
        this.lastWord = storyArray[i];
      }
      else{ //If next is a special char
        storyArray.push(tArray[i]);
        if(tArray[i] != ' '){
          firstWord = true;
        }
      }
    }
    
    var k = 0;

    console.log(storyArray);
    console.log(tArray);
    
    /*for(var i = 0; i < tArray.length; i++){
      if(tArray[i].charAt(0).match(/[a-z]/i)){
        tArray[i] = storyArray[k];
        k++;
      }
    }*/


    this.processedText = storyArray.join("");

    /*var word="";
    var firstWord = true;
    var endOfSentence = false;
    
    for(var i = 0; i<this.userText.length; i++){                                 //go through userText..
      if(this.userText.charAt(i).match(/^[a-zA-ZäöåÄÖÅ0-9]+$/) || this.userText.charAt(i) == "'"
      || this.charsUsedInWords.indexOf(this.userText.charAt(i)) != -1){          //if next character is a letter
        word += this.userText.charAt(i);                                         //add it to word
      }
      if(this.specialCharacters.indexOf(this.userText.charAt(i)) != -1){         //if current char is special char 
        if(word.length > 0){
          if(this.lastWord == ""){
            this.addWord(word);
          }
          else{
            this.addWord(this.getRandomFromBank(this.lastWord));
          }
        }
        this.addWord(this.userText.charAt(i));
        endOfSentence = true;
        word = "";
      }
      else if(this.wordBreaks.indexOf(this.userText.charAt(i)) != -1){           //if next char is a space
        if(firstWord){                                                           //if first word
          this.addWord(word);                                         //add it as it is
          firstWord = false;
        }
        else{                                                                    //if it's not first word     
          if(word.length > 3) {   
            this.addWord(this.getRandomFromBank(this.lastWord));      //add random word from bank based on last word
          }
          else{                                                                  //if it's less than 3 letters like "a", "the"
            this.addWord(word);                                       //add it as it is
          }
        }
        this.addWord(" ");
        word = "";
      }
    }*/
    this.finishText();
  }

  /*addWord(word){ //add word to text
    if(word != " " && word != this.lastWord){
      this.processedText += word;
      this.lastWord = word;
    }
    else{
      this.processedText += word;
    }
  }*/

  finishText(){
    console.log("finished");
  }

}
