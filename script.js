import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "process.env.YOUR_API_KEY",
  authDomain: "process.env.YOUR_AUTH_DOMAIN",
  databaseURL: "process.env.YOUR_DATABASE_URL",
  projectId: "process.env.YOUR_PROJECT_ID",
  storageBucket: "process.env.YOUR_STORAGE_BUCKET_SENDER",
  messagingSenderId: "process.env.YOUR_MESSAGING_SENDER_ID",
  appId: "process.env.YOUR_APP_ID",
  measurementId: "process.env.YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
  
  // Listen for new questions
  questionsRef.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        displayQuestion(change.doc.data());
      }
    });
  });
  
  // Submit a new question
  function submitQuestion() {
    const questionText = document.getElementById('questionText').value;
    if (questionText.trim() !== '') {
      questionsRef.add({
        questionText: questionText,
        author: 'Anonymous', // Or get user's name
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        answers: []
      }).then(() => {
        document.getElementById('questionText').value = '';
      });
    }
  }
  
  // Display a question on the page
  function displayQuestion(questionData) {
    const questionsList = document.getElementById('questionsList');
    const questionItem = document.createElement('li');
    questionItem.innerHTML = `
      <div class="question">${questionData.questionText}</div>
      <div class="answers">
        <ul></ul>
      </div>
    `;
    questionsList.appendChild(questionItem);
  
    // Listen for new answers to this question
    const answersRef = questionsRef.doc(questionData.id).collection('answers');
    answersRef.onSnapshot((snapshot) => {
      const answersList = questionItem.querySelector('.answers ul');
      answersList.innerHTML = ''; // Clear existing answers
      snapshot.forEach((doc) => {
        const answerItem = document.createElement('li');
        answerItem.textContent = `${doc.data().answerText} - ${doc.data().author}`;
        answersList.appendChild(answerItem);
      });
    });
  }
  
