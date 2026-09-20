// Importamos o CSS do Footer
import './Footer.css';

// Componente Footer: representa o rodapé no fim da página
function Footer() {
  return (
    <footer className="footer-container">
      <p>
        Projeto desenvolvido por <strong>Guilherme Santos</strong>.
      </p>
      <p className="footer-credits">
        Dados fornecidos via API Pública da Tabela FIPE.
      </p>
    </footer>
  );
}

export default Footer;