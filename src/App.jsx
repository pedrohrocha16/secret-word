// CSS
import './App.css'

//REACT
import { useCallback, useState, useEffect } from 'react'

//DATA
import {wordsList} from './data/words'

//COMPONENTS
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'

const stages = [
  {id:1, name:"start"},
  {id:2, name:"game"},
  {id:3, name:"end"}
]

const qntChances =5

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name) //state inicial
  const [words] = useState(wordsList) //lista de palavras 

  const [palavraSelecionada, setPalavraSelecionada] = useState("") // string vazia 'palavra'
  const [categoriaSelecionada , setCategoriaSelecionada] = useState("") // string vazia 'palavra'
  const [letras, setLetras] = useState([]) //array vazio 'lista'

  const [letrasAdivinhadas, setLetrasAdivinhadas] = useState([]) // array vazio 'lista'
  const [letrasErradas, setLetrasErradas] = useState([]) // array vazio 'lista'
  const [chances, setChances] = useState(qntChances)
  const [pontos, setPontos] = useState(0)



  const palavraCategoria = useCallback(() => {

    //escolher uma categoria aleatória
    const categorias = Object.keys(words) //selecionou uma key do array
    const categoria = categorias[Math.floor(Math.random() * Object.keys(categorias).length)] // aqui selecionou uma categoria aleatória de acordo com o tamanho do array de key selecionado acima

    //escolher uma palavra aleatória
    const word = words[categoria][Math.floor(Math.random() * words[categoria].length)] // aqui acessa o indice (key) selecionado acima e escolhe uma palavra aleatória da key

    return {word, categoria} //destruturou como objeto
  },[words])

  //muda o state para "game", ou seja, irá iniciar o jogo
  const startGame = useCallback(() => {
    //limpar todas as letras
    clearLetterState()

    //escolher palavra e categoria
   const {word, categoria} = palavraCategoria()

   
   //criando array de letras
    let wordLetras = word.split("")

    wordLetras= wordLetras.map((l) => l.toLowerCase())

    //setando os estados
    setPalavraSelecionada(word)
    setCategoriaSelecionada(categoria)
    setLetras(wordLetras)


    setGameStage(stages[1].name)
  }, [palavraCategoria])

  // processar letra que é digitada no input (mudou o state para "end")
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase()

    //checar se a letra já foi utilizada de alguma maneira

    if(letrasAdivinhadas.includes(normalizedLetter) || letrasErradas.includes(normalizedLetter)) {
      return
    }
      //incluir as letras que o usuário adivinhou para as certas ou erradas
      if(letras.includes(normalizedLetter)) {
        setLetrasAdivinhadas((actualLetrasAdivinhadas) => [...actualLetrasAdivinhadas, normalizedLetter])
      } else {
        setLetrasErradas((actualLetrasErradas) => [...actualLetrasErradas, normalizedLetter])

        setChances((actualChances) => actualChances - 1)
      }  
    }


    const clearLetterState = () => {
      setLetrasAdivinhadas([])
      setLetrasErradas([])
    }

    //checar se as chances acabaram
    useEffect(() => {
      if(chances <= 0) {

        clearLetterState()

        setGameStage(stages[2].name)
      }
    }, [chances])

    //checar condição de vitória

    useEffect(() => {

      const letrasUnicas = [... new Set(letras)]
        // condioção de vitória
      if(letrasAdivinhadas.length === letrasUnicas.length && gameStage === stages[1].name) {
        //adicionando pontuação
        setPontos((actualScore) => actualScore += 100)

          //resetando jogo
          startGame()
      }

    }, [letrasAdivinhadas, startGame, letras, gameStage])


    
  // reiniciar o jogo (mudou o state para "start")
  const retry = () => {
    setPontos(0)
    setChances(qntChances)
    setGameStage(stages[0].name)
  }

  return (
    <div className='App'>
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && <Game verifyLetter={verifyLetter} palavraSelecionada={palavraSelecionada} categoriaSelecionada={categoriaSelecionada} letras={letras} letrasAdivinhadas={letrasAdivinhadas} letrasErradas={letrasErradas} chances={chances} pontos={pontos} />}
      {gameStage === "end" && <GameOver retry={retry} score={pontos} />}
    </div>
  )
}

export default App
