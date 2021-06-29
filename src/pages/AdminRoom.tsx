import { useHistory, useParams } from 'react-router-dom'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/button'
import '../styles/room.scss';
import { RoomCode } from '../components/RoomCode';
//import { FormEvent, useState } from 'react';
//import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { Questions } from '../components/questions/index'
import { useRoom } from '../hooks/useRoom';
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
type RoomParams = {
    id: string;
}



export function AdminRoom() {
    //const { user } = useAuth();
    const history = useHistory()
    const params = useParams<RoomParams>()
    const roomId = params.id;


    const { title, questions } = useRoom(roomId)

    async function handleEndRoom() {
        database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })
        history.push('/');
    }


    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem ceerteza que deseja excluir esta pergunta?')) {
            await database.ref(`/rooms/${roomId}/questions/${questionId}`).remove()
        }

    }

    async function handleCheckQuestionAsAnswerd(questionId: string) {
        await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,

        })
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        })
    }


    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={params.id} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>


                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Questions
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type="button"
                                            onClick = {() => handleCheckQuestionAsAnswerd(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta como respondida Pergunta" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick = {() => handleHighlightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="dar destaque à pergunta" />
                                        </button>
                                    </>
                                )}

                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover Pergunta" />
                                </button>
                            </Questions>
                        )
                    })}
                </div>

            </main>
        </div>

    )
}