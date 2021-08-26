import React from 'react'
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom'
import Layout from './components/Layout'
import { ProvideAuth } from './services/use-auth'
import { ProvideNotify } from './services/use-notification'


function App() {

  return (
    <Router>
      <ProvideNotify>
        <ProvideAuth>
          <Layout />
        </ProvideAuth>
      </ProvideNotify>

    </Router>
  );
}

export default App;
