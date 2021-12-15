import './App.css';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from './FirebaseConfig'

function App() {
  // connection to users collection in firestore
  const usersCollectionRef = collection(db, "users")
  // stores user values retrived
  const [users, setUsers] = useState([])

  // create new user and age
  const [newUser, setNewUser] = useState("")
  const [age, setAge] = useState(0)


  // use addDoc function to add new User
  const createUser = async () => {
    await addDoc(usersCollectionRef, { name: newUser, age: Number(age) })
  }

  // increment age counter
  const updateUser = async (id, age) => {
    // we need to specify the database, the collection we're trying to update, and the id of the document we're trying to update
    const userDoc = doc(db, "users", id)

    // then we use updateDoc and pass in the updated values
    await updateDoc(userDoc, { age: age + 1 })
  }

  const deleteUser = async (id) => {
    // we need to specify the database, the collection we're trying to update, and the id of the document we're trying to update
    const userDoc = doc(db, "users", id)
    await deleteDoc(userDoc)
  }

  // get user on load
  useEffect(() => {
    const getUsers = async () => {
      // request data
      const data = await getDocs(usersCollectionRef)
      // set user data to mapped request data
      // ...doc.data is name and age, and id is doc.id
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    getUsers()
  }, [])

  return (
    <div className="App">
      {/* inputs */}
      <input placeholder='Name...' onChange={(event) => { setNewUser(event.target.value) }} />
      <input placeholder='Age...' type='number' onChange={(event) => { setAge(event.target.value) }} />
      {/* create user */}
      <button onClick={createUser}>Create user</button>
      {
        // for each user, we generate the HTML
        users.map((user) => {
          return <div>
            <h1>{user.name}</h1>
            <h2>{user.age}</h2>
            <button onClick={() => { updateUser(user.id, user.age) }}>Increase Age</button>
            <button onClick={() => { deleteUser(user.id) }}>Delete user</button>
          </div>
        })
      }
    </div>
  );
}

export default App;
