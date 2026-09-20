// Importamos nossos componentes criados
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Main from './components/Main/Main';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Componente do Cabeçalho */}
      <Header />

      {/* Componente do Conteúdo Principal onde ficarão os filtros e buscas */}
      <Main />

      {/* Componente do Rodapé */}
      <Footer />
    </div>
  );
}

export default App;