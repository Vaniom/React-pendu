import React, { Component } from 'react'

import './App.css'

const WORDS = ['ANTIBIOTIQUE', 'BISCUIT', 'CASIMIR', 'DESAMOUR', 'ELECTRICITE', 'FRACTURE', 'GEOLOGIE', 'HONTEUX', 'INFORMATION', 'JOURNAL', 'KIOSQUE', 'LUCARNE', 'MEROVINGIEN', 'NONETTE', 'OURSON', 'PARESSEUX', 'QUOTA', 'RADIOACTIF', 'SOMMEIL', 'TAROT', 'UNIVERS', 'ZIZANIE']
const KEYS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P' ,'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const HIDDENWORD = [];
const chars = [];
const keyboardCssStyle_diplayed = 'display: block;margin-top: 80px;display: grid;grid-template-columns: repeat(13, 1fr);grid-gap: 10px;'
const btnCssStyle = 'display: block;margin: auto;font-size: 3rem;border-radius: 10px;background-color: skyblue;'

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.resetGame = this.resetGame.bind(this)
    this.state = {
      word: '',
      currentKey: '',
      hiddenWord : HIDDENWORD,
      isPressed: [],
      isFound: false,
    }
  }
  
  componentDidMount(){
    this.randomWord()
  }
  randomWord() {
    const word = WORDS[Math.floor(Math.random()*22)]
    console.log('Mot à trouver = ' + word)
    this.hideWord(word);
    return this.setState({word: word});
  }

  // Hide word to guess. Hints with _

  hideWord = word => {
    let wordSplitted = [];
    wordSplitted = (word.split(''));
    for (let i = 0; i < wordSplitted.length; i++) {
      chars.push(wordSplitted[i])
    }
    for (let i = 0; i < chars.length; i++) {
      HIDDENWORD.push('_');
    }
    return HIDDENWORD;
  }

  //Use of await response on asynch methode
  async handleChange(value, e) {
    e.preventDefault()
    await this.setState((state) =>{
       
      return { currentKey: value}
    })
    setTimeout(this.isInWord(this.state.currentKey), 500)
    console.log(this.state.currentKey);
    this.setState((state) => {
       return this.state.isPressed.push(value)
    })
    this.isRed()
  }

  //TODO en fin de partie, masquer le clavier et afficher le bouton unique pour relancer une partie
  getFeedbackForKey() {
    if (HIDDENWORD.includes('_') === false) {
      this.setState((state) => {
        return {isFound : true}
      })
    }
    this.isFoundState()
  }

  isFoundState() {
    let div = document.getElementsByClassName('keyboard');
    let btn = document.getElementsByClassName('newGameBtn');
    if (this.state.isFound === true) {
      div[0].style.display = 'none';
      btn[0].style.cssText = btnCssStyle;
    } else if (this.state.isFound === false) {
      div[0].style.cssText = keyboardCssStyle_diplayed;
      btn[0].style.display = 'none';
    }
  }
  
  isInWord = el => {
    for (let i = 0; i < chars.length; i++){      
      if (el === chars[i]) {
        console.log('lettre trouvée ' + chars[i]);
        HIDDENWORD.splice(i, 1, chars[i]);
        this.setState((state) => {
          return {hiddenWord: HIDDENWORD}
        })
      }
    }
    this.getFeedbackForKey()
  }

  resetGame = () => {
    HIDDENWORD.length = 0;
    chars.length = 0;
    let div = document.getElementsByClassName('keyboard');
    let key = document.getElementsByClassName('key');
    let btn = document.getElementsByClassName('newGameBtn');
    this.setState((state) => {
      return {hiddenWord: HIDDENWORD, word: '', currentKey: '', isFound: false, isPressed: []}
      })
      div[0].style.cssText = keyboardCssStyle_diplayed;
      btn[0].style.display = 'none';
      for (let i = 0; i < key.length; i++) {
        key[i].removeAttribute("style");
      }
      setTimeout(this.randomWord(),2000);
      
  }

  isRed(){
    
    const key = document.getElementsByClassName('key');
    const isPressedArray = this.state.isPressed;
    for (let i = 0; i < key.length; i++) {
      if (isPressedArray.includes(key[i].textContent)) {
        key[i].style.cssText= 'background-color: red';
      }  
    }
  }
    

  render() {
    
    return(
      <section>
        <div className='wordToFind'>
          <p>
            {
              HIDDENWORD.map((char, index) => (
                <span className='hiddenSymbol' key={index}>{char}</span>
              ))
            }
          </p>
        </div>
        <div className='keyboard'>
          {
            KEYS.map((key, index) => (
              <span
              className='key'
              key={index}
              value={key}
              onClick={               
                (e) => this.handleChange(key, e)
              }
              >
                {key}
              </span>
            ))}
          
        </div>
        <button className='newGameBtn' onClick={() => this.resetGame()}>Nouvelle Partie</button>
      </section>
    )
  }

}

export default App