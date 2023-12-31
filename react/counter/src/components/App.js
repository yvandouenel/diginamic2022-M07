import './App.css';
import Counter from './Counter';
import { useState, useEffect } from 'react';
import Data from '../services/Data';
import FormAdd from './FormAdd';

function App() {
  // Destructuring pour gérer le state
  const [counters, setCounters] = useState([]);

  

  // Use Effect avec comme deuxième paramètre [] imite le hook componentDidMount
  useEffect(() => {
    //Imite ComponentDidMount et ne s'exécute qu'au premier rendu.
    console.log(`Dans useEffect `);
    // Appel du service Data
    (async () => {
      const loaded_counters = await Data.loadCounters();
      console.log(`counters dans useEffect : `, loaded_counters);
      setCounters(loaded_counters);

    })();
  }, []);
  // Gestion de l'ajout d'un compteur
  const handleSubmitAdd = async (event, counter_value) => {
    event.preventDefault();
    
    console.log(`Dans handleSubmit`);
    // Ajout d'un compteur en faisant appel à l'api rest 
    await Data.addCounter(counter_value);
    // Pour afficher, on peut simplement demander au service de recharger les données
    const loaded_counters = await Data.loadCounters();
    setCounters(loaded_counters);
  }
  // Gestion de la suppression d'un compteur
  const handleClickDelete = async (event, counter_id) => {
    
    console.log(`Dans handleClickDelete : `, counter_id);
    // Ajout d'un compteur en faisant appel à l'api rest 
    await Data.deleteCounter(counter_id);
    // Pour afficher, on peut filtrer le tableau 
    const filtered_counters = counters.filter(counter => {
      if (counter.id !== counter_id) return counter;
    })
    setCounters(filtered_counters);
  }
  // Incrémente uniquement le compteur dont on a l'id
  const increment = (id) => {
    console.log(`Dans increment, id : `, id);
    const copy_counters = counters.map((counter) => {
      if (id === counter.id) counter.value++;
      return counter;
    });
    setCounters(counters => copy_counters);
  }
  // Décrémente uniquement le compteur dont on a l'id
  const decrement = (id) => {
    console.log(`Dans decrement`);
    const copy_counters = counters.map((counter) => {
      if (id === counter.id) counter.value--;
      return counter;
    })
    setCounters(counters => copy_counters);
  }
  const incrementAll = () => {
    setCounters(counters => counters.map(counter => {
      counter.value++;
      return counter;
    }));
  }
  const decrementAll = () => {
    const copy_counters = counters.map(counter => {
      counter.value--;
      return counter;
    })
    setCounters(counters => copy_counters);
  }
  return (
    <div className="App container">
      <h1>Compteurs</h1>
      <h2>Créer un compteur</h2>
      <FormAdd
        onAdd={handleSubmitAdd}
      />
      <h2>Voir et gérer les compteurs</h2>
      <button
        onClick={incrementAll}
        className="btn btn-warning me-3">Incrémenter
      </button>
      <button
        onClick={decrementAll}
        className="btn btn-warning me-3">Decrémenter
      </button>
      {counters.map((counter) =>
        <Counter
          key={counter.id}
          counter={counter}
          onIncrement={increment}
          onDecrement={decrement}
          onDelete={handleClickDelete}
        />)}

    </div>
  );
}

export default App;
