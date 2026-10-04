# 🚗 Consulta de Preços Tabela FIPE (Carros, Motos e Caminhões)

Projeto desenvolvido como trabalho final para o curso da **Kodie Academy**. A aplicação consiste em uma ferramenta de consulta em tempo real dos valores médios de mercado para veículos no Brasil, consumindo dados oficiais da Tabela FIPE.

---

## 🎯 Objetivo do Projeto
Resolver a falta de transparência e facilitar a pesquisa de preços no mercado automotivo brasileiro, permitindo que os usuários consultem marcas, modelos, anos e salvem seus veículos favoritos em uma garagem virtual.

---

## 🛠️ Tecnologias Utilizadas
- **React.js** (Biblioteca para construção da interface)
- **Vite** (Ferramenta de build e servidor de desenvolvimento rápido)
- **JavaScript (ES6+)**
- **CSS3** (Estilização responsiva e moderna)
- **HTML5**
- **Fipe API REST** (API pública e gratuita para consulta de dados)
- **LocalStorage** (Persistência de dados do navegador para a Garagem Salva)

---

## ✨ Funcionalidades
1. **Seleção Dinâmica por Categoria:** Alternância entre Carros, Motos e Caminhões.
2. **Filtros Encadeados:** Carregamento automático de Marcas, Modelos e Anos conforme a seleção do usuário.
3. **Consulta de Preço FIPE:** Exibição do valor de mercado, código FIPE, combustível e mês de referência.
4. **Tratamento de Dados:** Exibição amigável de veículos "Zero KM" em vez de códigos internos da API.
5. **Garagem Salva (Favoritos):** Permite salvar veículos pesquisados no navegador para comparação futura.
6. **Design Responsivo:** Adaptado para telas de celular, tablet e computador.

---

## 🔄 Interação com os Dados
A aplicação permite interagir com os dados retornados da Tabela FIPE através de:
- **Persistência Local (Garagem):** Adição e remoção dinâmica de veículos favoritos a partir das consultas efetuadas.
- **Comparador:** Seleção e comparação direta das especificações e valores de dois veículos salvos na Garagem.
- **Integração Externa:** Geração de buscas dinâmicas de imagens no Google com base nos parâmetros do veículo selecionado.

---

## 🤖 Uso de Inteligência Artificial no Desenvolvimento
Este projeto foi desenvolvido com o auxílio de IA gerativa como ferramenta de apoio pedagógico e mentoria de código. A IA foi utilizada para:
- Estruturação do passo a passo do projeto e organização modular de componentes (`Header`, `Main`, `Footer`).
- Orientações de boas práticas de código React (gerenciamento de estados com `useState` e efeitos com `useEffect`).
- Inclusão de comentários didáticos detalhados no código fonte para fixação do aprendizado.

---

## 🚀 Como Executar o Projeto Localmente

Prompts Utilizados no Desenvolvimento

Abaixo está o prompt base de direcionamento fornecido à IA para a estruturação e desenvolvimento da aplicação:

Prompt: Me ajude a construir uma aplicação de Consulta de Preços da Tabela FIPE (Carros, Motos e Caminhões) em React + Vite.
---
## Requisitos da Aplicação:
 1. Interface responsiva e moderna em CSS3/HTML5.
 2. Seleção de categoria (Carros, Motos, Caminhões) com filtros encadeados em tempo real (Marca -> Modelo -> Ano) consumindo a Fipe API REST.
 3. Exibição do resultado detalhado com Valor de Mercado, Código FIPE, Mês de Referência e tratamento amigável para modelos 'Zero KM'.
 Diretrizes do Código:
 - Estrutura modular em componentes React (`Header`, `Main`, `Footer`, etc.).
 - Utilização de boas práticas com hooks (`useState`, `useEffect`).

1. Clone este repositório:
   ```bash
   git clone https://github.com/Guilhermejjw/consulta-fipe.git