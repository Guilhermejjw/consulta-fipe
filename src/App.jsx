import React, { useState, useEffect } from 'react';
// Importamos os nossos componentes
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Main from './components/Main/Main';
import { Comparador } from './components/Comparador/Comparador';
import './App.css';

function App() {
  // 1. Criamos o estado "favoritos" no App para partilhar os dados da Garagem entre o Main e o Comparador
  const [favoritos, setFavoritos] = useState(() => {
    // Procura no navegador se já existem veículos guardados na Garagem
    const salvos = localStorage.getItem('garagem_fipe');
    return salvos ? JSON.parse(salvos) : [];
  });

  // 2. Sempre que a lista de favoritos muda, atualizamos automaticamente o localStorage do navegador
  useEffect(() => {
    localStorage.setItem('garagem_fipe', JSON.stringify(favoritos));
  }, [favoritos]);

  // Remove um veículo da lista de favoritos (Garagem) comparando o ID único fornecido
  const removerDosFavoritos = (idParaRemover) => {
    setFavoritos((prev) => 
      prev.filter((item) => (item.id || `${item.CodigoFipe}-${item.AnoModelo}`) !== idParaRemover)
    );
  };

  return (
    <div className="app-container">
      {/* Componente do Cabeçalho */}
      <Header />

      {/* Componente Principal: recebe os favoritos e a função para guardar novos veículos */}
      <Main favoritos={favoritos} setFavoritos={setFavoritos} removerDosFavoritos={removerDosFavoritos} />

      {/* Componente do Comparador: recebe a lista de favoritos para os poder comparar lado a lado */}
      <Comparador favoritos={favoritos} />

      {/* Componente do Rodapé (fica sempre no final do ecran) */}
      <Footer />
    </div>
  );
}

export default App;