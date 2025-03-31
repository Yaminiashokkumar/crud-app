import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function TestConnection() {
  const [status, setStatus] = useState('Testing connection...');

  useEffect(() => {
    async function testConnection() {
      try {
        // Try to add a test document
        const docRef = await addDoc(collection(db, 'test'), {
          timestamp: new Date(),
          test: 'connection'
        });
        
        // Try to read the document
        const querySnapshot = await getDocs(collection(db, 'test'));
        querySnapshot.forEach((doc) => {
          console.log('Document data:', doc.data());
        });

        setStatus('Firebase connection successful!');
      } catch (error) {
        console.error('Firebase connection error:', error);
        setStatus('Firebase connection failed: ' + error.message);
      }
    }

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', margin: '20px', border: '1px solid #ccc' }}>
      <h3>Firebase Connection Test</h3>
      <p>{status}</p>
    </div>
  );
} 