import { useState, useRef } from 'react'
import './Game.css'

const Game = ({verifyLetter, palavraSelecionada, categoriaSelecionada, letras, letrasAdivinhadas, letrasErradas, chances, pontos}) => {

  const [letter, setLetter] = useState("")
  const letterInputRef = useRef(null) // é como se tivesse selecionado o elemento no dom "query selector"

  const handleSubmit = (e) => {
    e.preventDefault()

    verifyLetter(letter)
    setLetter("")

    letterInputRef.current.focus()

  }


  return (
    <div className='game'>
      <p className="points">
        <span>Pontuação: {pontos}</span>
      </p>
        <h1>Adivinhe a palavra:</h1>
        <h3 className="tip">Dica sobre a palavra: <span>{categoriaSelecionada}</span></h3>
          <p>Você ainda tem {chances} tentativa(s)!</p>
        <div className="wordContainer">
          {letras.map((letter, i) => (
            letrasAdivinhadas.includes(letter) ? (
              <span key={i} className="letter">{letter}</span>
            ) : (
              <span key={i} className="blankSquare"></span>
            )
          ))}
        </div> 
          <div className="letterContainer">
            <p>Tente adivinhar uma letra da palavra:</p>
              <form onSubmit={handleSubmit}>
                <input type="text" name='letter' maxLength="1" required onChange={(e) => setLetter(e.target.value)} value={letter} ref={letterInputRef} />
                <button>Jogar!</button>
              </form>
          </div>
          <div className="wrongLettersContainer">
            <p>Letras já utilizadas:</p>
              {letrasErradas.map((letter, i) => (
                <span key={i}>{letter}, </span>
              ))}
          </div>
      </div>
  )
}

export default Game