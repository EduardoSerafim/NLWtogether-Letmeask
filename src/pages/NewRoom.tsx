import { Link, useHistory } from 'react-router-dom'

import illustratingImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'


import { Button } from '../components/button'

import '../styles/auth.scss' 

import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'
import { database } from '../services/firebase'



export function NewRoom(){
    
   const {user} = useAuth()
   const history = useHistory()
   const [newRoom, setNewRoom] = useState('');

   async function handleCreateRoom(event: FormEvent) {
       event.preventDefault();

      if(newRoom.trim() === ''){
        return;
      }

      const roomRef = database.ref('rooms');

      const firebaseRoom = await roomRef.push({
           title: newRoom, 
           authorId: user?.id
      });

      history.push(`/rooms/${firebaseRoom.key}`)
   }

    return(
        <div id="page-auth">
            <aside>
                <img src={illustratingImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>

            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                   
                    <form action="" onSubmit = {handleCreateRoom}>
                        <input 
                            type="text" 
                            placeholder = "Criar sala"
                            onChange = {event => setNewRoom(event.target.value)}
                            value = {newRoom}
                        />
                        <Button type = "submit">
                           Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )

}