// Importamos o StrictMode do React.
// Ele ajuda a encontrar problemas durante o desenvolvimento.
import { StrictMode } from "react";

// Importamos a função que cria a aplicação React.
import { createRoot } from "react-dom/client";

// Importamos o CSS global da aplicação.
import "./index.css";

// Importamos o componente principal da aplicação.
import App from "./App.jsx";

// Procuramos no HTML o elemento que possui id="root".
// É dentro desse elemento que o React será exibido.
createRoot(document.getElementById("root")).render(
  // StrictMode envolve nossa aplicação durante o desenvolvimento.
  <StrictMode>
    {/* Exibimos o componente principal da aplicação. */}
    <App />
  </StrictMode>
);