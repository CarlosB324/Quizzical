import React from "react" 
import Qna from "./Qna"
import Startscreen from "./Startscreen"
import {nanoid} from "nanoid"
import {decode} from "html-entities"
import Confetti from "react-confetti"
import {useWindowSize} from 'react-use';

export default function App() {
    const {width, height} = useWindowSize()
    const [startScreen, setStartScreen] = React.useState(true)
    const [quizArray, setQuizArray] = React.useState([])
    const [selectedOptions, setSelectedOptions] = React.useState([])
    const [checkAnswers, setCheckAnswers] = React.useState(false)
    const [score, setScore] = React.useState("0/5")
    let amount = 5
    const selectedCorrectAnswers = document.querySelectorAll(
        'input[class="radio-input correct"]:checked'
    )
    const allAnswersCorrect = selectedCorrectAnswers.length === amount && checkAnswers
    
    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
        return array
    }
    
    function fetchQuizArray() {
        fetch("https://opentdb.com/api.php?amount=5")
            .then(res => res.json())
            .then(data => {
                const questionArray = data.results.map(eachQuestion => {
                    return {
                    question:decode(eachQuestion.question),
                    answerInfo:shuffle(answerId(
                        eachQuestion.incorrect_answers.concat(eachQuestion.correct_answer
                    ))),
                    id:nanoid(),
                    correctAnswer:decode(eachQuestion.correct_answer),
                    selectedAnswer: ""
                    }
                })
                setQuizArray(questionArray)
            })
            .catch(error => {
                console.error("trouble fetching questions")
            }) 
    }
    
    function answerId(info) {
        const allAnswerArr = []
            for (let i = 0; i < info.length; i++) {
                const eachAnswer = {
                    answer:decode(info[i]),
                    answerId:nanoid()
                }
                allAnswerArr.push(eachAnswer)
            }
        return allAnswerArr
    }
    
    React.useEffect(() => {
        fetchQuizArray()
    }, [])
    
    const introScreen = (
        <Startscreen 
            startScreenClick={startScreenClick}
        />
    )
    
    const qna = quizArray.map((eachQuestion, index) => {
        return (
            <Qna 
                quizArray={eachQuestion} 
                index={index} 
                key={nanoid()}
                selectAnswerChange={selectAnswerChange}
                checkAnswers={checkAnswers}
            />)
    })
    
    function startScreenClick() {
        setStartScreen(false)
    }
    
    function selectAnswerChange(answerInfo, questionId) {
        setQuizArray(questions => {
            return questions.map(question => {
                return question.id === questionId ? { ...question, selectedAnswer: answerInfo} : question
            })
        })
    }
    
    function answerCheck() {
        const selectedInputs = document.querySelectorAll('input:checked')
        if (selectedInputs.length === amount) {
            setCheckAnswers(true)
            setScore(selectedCorrectAnswers.length + "/5")
        } else {
            document.getElementById("selected-check").style.opacity = 1
            document.getElementById("selected-check").style.bottom = "40px"
            setTimeout(function(){
                document.getElementById("selected-check").style.opacity = 0
                document.getElementById("selected-check").style.bottom = "-60px"
            }, 1500)
        }
    }
    
    function startNewGame() {
        setQuizArray([])
        setCheckAnswers(false)
        setScore("0/5")
        fetchQuizArray()
    }
    
    const selectCheckPopUp = (
        <div className="selected-check-group">
            <h3 
                className="selected-check" 
                id="selected-check"
            >
                Select an answer for all questions
            </h3>
        </div>
    )
    
    const playAgain = (
        <div className="play-again-group">
            <p className="play-again-score">You scored {score} correct answers</p>
            <button className="play-again-btn" onClick={startNewGame}>Play Again</button>
        </div>
    )
    
    
    return (
        <div className="container">
            {allAnswersCorrect && <Confetti 
                width={width}
                height={height}
            />}
            {startScreen ? (
                <div>
                    {introScreen}
                </div>
            ) : (
                <div>
                    {qna}
                    {checkAnswers ? (
                        <div>
                            {playAgain}
                        </div>
                    ) : (
                        <button className="check-btn" onClick={answerCheck}>Check Answers</button>
                        )}
                </div>
            )}
            {selectCheckPopUp}
        </div>
    )
}