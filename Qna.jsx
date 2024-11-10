import React from "react"
import {nanoid} from "nanoid"
import {decode} from "html-entities"

export default function Qna(props) {
    const quiz = props.quizArray
   
    const allAnswers = quiz.answerInfo.map(answerInfo => {
        const inAnswerId = answerInfo.answer.replace(/[^A-Z0-9]/ig, "_")
        
        const isCorrectAnswer = answerInfo.answer === quiz.correctAnswer
        const isIncorrectAnswer = quiz.selectedAnswer != quiz.correctAnswer && quiz.selectedAnswer === answerInfo.answer
        const isSelectedAnswer = quiz.selectedAnswer === answerInfo.answer
        
        let labelClass = ""
        let inputClass = ""
        
        if (answerInfo.answer === quiz.correctAnswer) {
            inputClass = "correct"
        } else {
            inputClass = "incorrect"
        }
        
        if (props.checkAnswers && isCorrectAnswer) {
            labelClass = "correct"
        } else if (props.checkAnswers && isIncorrectAnswer) {
            labelClass = "incorrect disable"
        } else if (props.checkAnswers) {
            labelClass = "disable"
        } else if (!props.checkAnswers && isSelectedAnswer) {
            labelClass = "picked"
        }
       
        return (
            <div key={nanoid()} className="answers">
                <input 
                    type="radio" 
                    id={ "question" + props.index + "-" + inAnswerId} 
                    value={answerInfo.answer}
                    checked={quiz.selectedAnswer === answerInfo.answer}
                    onChange={() => props.selectAnswerChange(answerInfo.answer, quiz.id)}
                    className={`radio-input ${inputClass}`}
                    name={`question-${props.index}`}
                    disabled={props.checkAnswers}
                />
                <label 
                    id={"question" + props.index + "-" + inAnswerId} 
                    className={`answer-text ${labelClass}`}
                    htmlFor={"question" + props.index + "-" + inAnswerId}
                >
                    {answerInfo.answer}
                </label>
            </div>
       )
   })
   
    return (
        <div className="q-and-a-container">
            <h3 className="question-text">{decode(quiz.question)}</h3>
            <div className="answer-container">
                {allAnswers}
            </div>
        </div>
    )
}