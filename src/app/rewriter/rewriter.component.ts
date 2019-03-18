import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rewriter',
  templateUrl: './rewriter.component.html',
  styleUrls: ['./rewriter.component.css']
})
export class RewriterComponent implements OnInit {

  userText:string; //text given by the user
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
    this.userText.replace('\n', '');
    this.userText.replace('  ', ' ');
    var word="";
    for(var i = 0; i<this.userText.length; i++){                                 //go through userText..
      if(this.userText.charAt(i).match(/^[a-zA-ZäöåÄÖÅ0-9]+$/)
      || this.charsUsedInWords.indexOf(this.userText.charAt(i)) != -1){                               //if next character is a letter
        word += this.userText.charAt(i);                                         //add it to word
      }
      else if(this.specialCharacters.indexOf(this.userText.charAt(i)) != -1){         //if next char is special char
        this.addToBank(word);
        word="";
      }
      else{
        if(word.length != 0){
          this.addToBank(word);
        }
        word="";
      }
    }
    this.logBank();
    this.constructSentence(); 
  }

  addToBank(word:string){
    if(!this.bankSearch(this.lastWord)){
      this.wordBank.push({b_word: this.lastWord, b_follow: []});
    }
    
    for(var i = 0; i < this.wordBank.length; i++){
      if(this.wordBank[i].b_word == this.lastWord){
        this.wordBank[i].b_follow.push(word);
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
    if(bIndex != -1){
      var tempArray = this.wordBank[bIndex].b_follow;
      tempArray.filter(word => word.substring(word.length-this.sensN));
      var a = tempArray.length;
      var rnd = Math.floor((Math.random() * a) + 0);
      console.log("a"+a);
      console.log(tempArray[rnd])
      return tempArray[rnd];
    }
    else{
      return "";
    }
  }

  constructSentence(){
    var word="";
    var firstWord = true;
    var endOfSentence = false;

    for(var i = 0; i<this.userText.length; i++){                                 //go through userText..
      if(this.userText.charAt(i).match(/^[a-zA-ZäöåÄÖÅ0-9]+$/)
      || this.charsUsedInWords.indexOf(this.userText.charAt(i)) != -1){                               //if next character is a letter
        word += this.userText.charAt(i);                                         //add it to word
        if(endOfSentence){
          firstWord = true;
          endOfSentence = false;
        }
      }
      if(this.specialCharacters.indexOf(this.userText.charAt(i)) != -1){         //if current char is special char 
        this.addWord(this.getRandomFromBank(this.lastWord), firstWord);
        this.addWord(this.userText.charAt(i), firstWord);
        endOfSentence = true;
        word = "";
        if(this.wordBreaks.indexOf(this.userText.charAt(i+1)) != -1){
          i++;
        }
      }
      else if(this.wordBreaks.indexOf(this.userText.charAt(i)) != -1){                                        //if next char is a space
        if(firstWord){                                                                          //if first word
          this.addWord(word, firstWord);                                                    //add it as it is
          firstWord = false;
        }
        else{                                                                                       //if it's not first word     
          if(word.length > 3) {   
            this.addWord(this.getRandomFromBank(this.lastWord), firstWord);                            //add word fom bank based on last word
          }
          else{
            this.addWord(word, firstWord);
          }
        }
        word = "";
      }
      this.processedText.replace(' .', '.');
      this.processedText.replace(' ,', ',');
      this.processedText.replace(' .', '.');
    }
  }

  addWord(word, firstWord){ //add word to text
    if(word != " " && word != this.lastWord){
      if(this.specialCharacters.indexOf(word) != -1){
        this.processedText += word;
        this.processedText += " ";
      }
      else if(word !== undefined && !firstWord){
        this.processedText += " ";
        this.processedText += word;
      }
      else if(word !== undefined){
        this.processedText += word;
      }
      this.lastWord = word;
    }
  }

  getNextWord(){

  }

}
