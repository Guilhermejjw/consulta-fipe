import { useState, useEffect } from 'react';
import './Main.css';

// 1. O componente recebe "favoritos" e "setFavoritos" via props do App.jsx
export default function Main({ favoritos, setFavoritos }) {
  // ESTADOS DO REACT (Guarda as escolhas do usuário e os dados da API)
  const [tipoVeiculo, setTipoVeiculo] = useState('carros'); // Padrão: carros
  const [marcas, setMarcas] = useState([]);                 // Lista de marcas
  const [marcaSelecionada, setMarcaSelecionada] = useState('');

  const [modelos, setModelos] = useState([]);               // Lista de modelos
  const [modeloSelecionado, setModeloSelecionado] = useState('');

  const [anos, setAnos] = useState([]);                     // Lista de anos
  const [anoSelecionado, setAnoSelecionado] = useState('');

  const [resultado, setResultado] = useState(null);          // Dados do veículo pesquisado
  const [carregando, setCarregando] = useState(false);       // Controla o aviso de "Carregando..."

  // 2. BUSCA MARCAS ASSIM QUE O TIPO MUDA (Carros / Motos / Caminhões)
  useEffect(() => {
    setMarcas([]);
    setMarcaSelecionada('');
    setModelos([]);
    setModeloSelecionado('');
    setAnos([]);
    setAnoSelecionado('');
    setResultado(null);

    setCarregando(true);
    fetch(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas`)
      .then((res) => res.json())
      .then((data) => {
        setMarcas(data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar marcas:', err);
        setCarregando(false);
      });
  }, [tipoVeiculo]);

  // 3. BUSCAR MODELOS QUANDO A MARCA É SELECIONADA
  useEffect(() => {
    if (!marcaSelecionada) return;

    setModelos([]);
    setModeloSelecionado('');
    setAnos([]);
    setAnoSelecionado('');
    setResultado(null);

    setCarregando(true);
    fetch(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${marcaSelecionada}/modelos`)
      .then((res) => res.json())
      .then((data) => {
        setModelos(data.modelos);
        setCarregando(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar modelos:', err);
        setCarregando(false);
      });
  }, [marcaSelecionada, tipoVeiculo]);

  // 4. BUSCAR ANOS QUANDO O MODELO É SELECIONADO
  useEffect(() => {
    if (!modeloSelecionado) return;

    setAnos([]);
    setAnoSelecionado('');
    setResultado(null);

    setCarregando(true);
    fetch(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${marcaSelecionada}/modelos/${modeloSelecionado}/anos`)
      .then((res) => res.json())
      .then((data) => {
        setAnos(data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar anos:', err);
        setCarregando(false);
      });
  }, [modeloSelecionado, marcaSelecionada, tipoVeiculo]);

  // 5. FUNÇÃO PARA BUSCAR O PREÇO FINAL DO VEÍCULO
  const buscarPrecoFipe = () => {
    if (!anoSelecionado) return;

    setCarregando(true);
    fetch(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${marcaSelecionada}/modelos/${modeloSelecionado}/anos/${anoSelecionado}`)
      .then((res) => res.json())
      .then((data) => {
        setResultado(data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar resultado FIPE:', err);
        setCarregando(false);
      });
  };

  // 6. FUNÇÃO PARA ADICIONAR O VEÍCULO CONSULTADO À GARAGEM/FAVORITOS
  const adicionarAosFavoritos = () => {
    if (!resultado) return;

    // Cria um objeto formatado para salvar na lista
    const novoFavorito = {
      ...resultado,
      id: `${resultado.CodigoFipe}-${resultado.AnoModelo}` // ID único baseado no código FIPE + Ano
    };

    // Verifica se já está na lista de favoritos para evitar duplicatas
    const jaExiste = favoritos ? favoritos.some((item) => item.id === novoFavorito.id) : false;

    if (!jaExiste) {
      if (setFavoritos) {
        setFavoritos([...favoritos, novoFavorito]);
        alert('Veículo salvo na Garagem com sucesso!');
      }
    } else {
      alert('Este veículo já está na sua Garagem!');
    }
  };

  return (
    <main className="main-container">
      <h2>Busca de Veículos na Tabela FIPE</h2>

      {/* PAINEL DE SELETORES DE FILTRO */}
      <div className="filtros-container">
        {/* SELETOR 1: TIPO DE VEÍCULO */}
        <div className="filtro-grupo">
          <label>1. Tipo de Veículo:</label>
          <select 
            value={tipoVeiculo} 
            onChange={(e) => setTipoVeiculo(e.target.value)}
          >
            <option value="carros">🚗 Carros</option>
            <option value="motos">🏍️ Motos</option>
            <option value="caminhoes">🚚 Caminhões</option>
          </select>
        </div>

        {/* SELETOR 2: MARCA */}
        <div className="filtro-grupo">
          <label>2. Marca:</label>
          <select 
            value={marcaSelecionada} 
            onChange={(e) => setMarcaSelecionada(e.target.value)}
            disabled={marcas.length === 0}
          >
            <option value="">-- Selecione uma Marca --</option>
            {marcas.map((m) => (
              <option key={m.codigo} value={m.codigo}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>

        {/* SELETOR 3: MODELO */}
        <div className="filtro-grupo">
          <label>3. Modelo:</label>
          <select 
            value={modeloSelecionado} 
            onChange={(e) => setModeloSelecionado(e.target.value)}
            disabled={modelos.length === 0}
          >
            <option value="">-- Selecione um Modelo --</option>
            {modelos.map((mod) => (
              <option key={mod.codigo} value={mod.codigo}>
                {/* Substitui FATOR por FACTOR usando aspas simples de forma segura */}
                {mod.nome.replaceAll('FATOR', 'FACTOR')}
              </option>
            ))}
          </select>
        </div>

        {/* SELETOR 4: ANO */}
        <div className="filtro-grupo">
          <label>4. Ano / Combustível:</label>
          <select 
            value={anoSelecionado} 
            onChange={(e) => setAnoSelecionado(e.target.value)}
            disabled={anos.length === 0}
          >
            <option value="">-- Selecione o Ano --</option>
            {anos.map((a) => (
              <option key={a.codigo} value={a.codigo}>
                {/* Se o código ou texto contiver 32000, exibe Zero KM */}
                {a.nome.includes('32000') ? a.nome.replace('32000', 'Zero KM') : a.nome}
              </option>
            ))}
          </select>
        </div>

        {/* BOTÃO DE BUSCA */}
        <button 
          className="btn-buscar"
          onClick={buscarPrecoFipe}
          disabled={!anoSelecionado}
        >
          {carregando ? 'Carregando...' : 'Consultar Preço'}
        </button>
      </div>

      {/* CARD COM O RESULTADO DA CONSULTA */}
      {resultado && (
        <div className="resultado-card">
          <h3>{resultado.Marca} {resultado.Modelo}</h3>
          <p className="preco-destaque">{resultado.Valor}</p>

          {/* BOTÃO PARA VER FOTOS NO GOOGLE */}
          <a 
            href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
              resultado.Marca + ' ' + resultado.Modelo + ' ' + (String(resultado.AnoModelo).includes('32000') ? 'Zero KM' : resultado.AnoModelo)
            )}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-google-imagens"
          >
            🔍 Ver fotos no Google
          </a>

          {/* DETALHES TÉCNICOS */}
          <div className="detalhes-grid">
            <p>
              <strong>Ano/Modelo:</strong>{' '}
              {String(resultado.AnoModelo).includes('32000') || String(resultado.AnoModelo).toLowerCase().includes('quilômetro')
              ? 'Zero KM'
              : resultado.AnoModelo}
            </p>
            <p><strong>Combustível:</strong> {resultado.Combustivel}</p>
            <p><strong>Código FIPE:</strong> {resultado.CodigoFipe}</p>
            <p><strong>Mês de Referência:</strong> {resultado.MesReferencia}</p>
          </div>

          {/* BOTÃO PARA SALVAR NA GARAGEM / COMPARADOR */}
          <button className="btn-favoritar" onClick={adicionarAosFavoritos}>
            ❤️ Salvar na Garagem
          </button>
        </div>
      )}
    </main>
  );
}