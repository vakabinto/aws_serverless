import React, { useState, useEffect } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import './App.css';

Amplify.configure(awsconfig);

function App() {
  const [user, setUser] = useState(null);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => setUser(user))
      .catch(() => setUser(null));
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('<YOUR_API_URL>/notes', {
        headers: { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` }
      });
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async () => {
    try {
      await fetch('<YOUR_API_URL>/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        },
        body: JSON.stringify({ content: note })
      });
      setNote('');
      fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const signIn = async () => {
    try {
      await Auth.signInWithHostedUI();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="App">
      <h1>ECS Notes App</h1>
      {user ? (
        <>
          <p>Welcome, {user.username}!</p>
          <button onClick={signOut}>Sign Out</button>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter a note"
          />
          <button onClick={addNote}>Add Note</button>
          <ul>
            {notes.map((n, index) => (
              <li key={index}>{n.content}</li>
            ))}
          </ul>
        </>
      ) : (
        <button onClick={signIn}>Sign In</button>
      )}
    </div>
  );
}

export default App;