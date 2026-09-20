          // Importamos o arquivo de estilos exclusivo do Header
import './Header.css';

          // Componente Header: representa o cabeçalho no topo da página
function Header() {
  return (
    <header className="header-container">
      {/* Título principal do projeto */}
      <h1 className="header-title">🚗 Consulta Tabela FIPE</h1>
      
      {/* Subtítulo explicativo sobre o objetivo do site */}
      <p className="header-subtitle">
        Consulte o preço médio de carros, motos e caminhões em tempo real
      </p>
    </header>
  );
}

          // Exportamos o componente para que o arquivo App.jsx consiga usá-lo
export default Header;