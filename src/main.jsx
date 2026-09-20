// 1. IMPORTAÇÕES DE MÓDULOS E COMPONENTES
// Importamos o 'StrictMode' do React, uma ferramenta de desenvolvimento que ajuda a identificar boas práticas e avisar sobre código obsoleto.
import { StrictMode } from 'react';

// Importamos a função 'createRoot' do módulo 'react-dom/client', responsável por inicializar a árvore de componentes no navegador.
import { createRoot } from 'react-dom/client';

// Importamos o ficheiro de estilos globais em CSS para que as regras de design fiquem disponíveis em toda a aplicação.
import './index.css';

// Importamos o componente principal 'App', que contém toda a estrutura base e navegação da nossa aplicação.
import App from './App.jsx';

// 2. INICIALIZAÇÃO E RENDERIZAÇÃO DA APLICAÇÃO
// Procuramos no ficheiro 'index.html' o elemento DOM com id="root" e criamos a raiz (root) do React nesse elemento.
// Em seguida, chamamos a função '.render()' para injetar e exibir o conteúdo da nossa aplicação dentro desse elemento HTML.
createRoot(document.getElementById('root')).render(
  // O 'StrictMode' envolve o componente 'App' para ativar verificações adicionais durante o desenvolvimento (não afeta o ambiente de produção).
  <StrictMode>
    {/* Renderizamos o componente principal da aplicação */}
    <App />
  </StrictMode>
);