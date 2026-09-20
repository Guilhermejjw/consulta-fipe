import { useState, useEffect } from 'react';
import './Main.css';

// Componente principal de consulta FIPE e gestão da garagem
export default function Main({ favoritos = [], setFavoritos, removerDosFavoritos }) {
  // Estados para os filtros da consulta
  const [tipoVeiculo, setTipoVeiculo] = useState('carros');
  const [marcas, setMarcas] = useState([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState('');

  const [modelos, setModelos] = useState([]);
  const [modeloSelecionado, setModeloSelecionado] = useState('');

  const [anos, setAnos] = useState([]);
  const [anoSelecionado, setAnoSelecionado] = useState('');

  // Estados de resultado e feedback visual
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // 1. Busca marcas do tipo de veículo (com cache em localStorage)
  useEffect(() => {
    setMarcas([]);
    setMarcaSelecionada('');
    setModelos([]);
    setModeloSelecionado('');
    setAnos([]);
    setAnoSelecionado('');
    setResultado(null);

    const cacheKey = `fipe_marcas_${tipoVeiculo}`;
    const cacheData = localStorage.getItem(cacheKey);

    if (cacheData) {
      setMarcas(JSON.parse(cacheData));
      return;
    }

    setCarregando(true);
    fetch(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem(cacheKey, JSON.stringify(data));
          setMarcas(data);
        }
        setCarregando(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar marcas:', err);
        setMarcas([]);
        setCarregando(false);
      });
  }, [tipoVeiculo]);

  // 2. Busca modelos da marca selecionada (com cache)
  useEffect(() => {
    if (!marcaSelecionada) return;

    setModelos([]);
    setModeloSelecionado('');
    setAnos([]);
    setAnoSelecionado('');
    setResultado(null);

    const cacheKey = `fipe_modelos_${tipoVeiculo}_${marcaSelecionada}`;
    const cacheData = localStorage.getItem(cacheKey);

    if (cacheData) {
      setModelos(JSON.parse(cacheData));
      return;
    }

    setCarregando(true);
    fetch(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${marcaSelecionada}/modelos`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const listaModelos = data && Array.isArray(data.modelos) ? data.modelos : [];
        if (listaModelos.length > 0) {
          localStorage.setItem(cacheKey, JSON.stringify(listaModelos));
        }
        setModelos(listaModelos);
        setCarregando(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar modelos:', err);
        setModelos([]);
        setCarregando(false);
      });
  }, [marcaSelecionada, tipoVeiculo]);

  // 3. Busca anos/combustíveis do modelo (com cache)
  useEffect(() => {
    if (!modeloSelecionado || !marcaSelecionada) return;

    setAnos([]);
    setAnoSelecionado('');
    setResultado(null);

    const cacheKey = `fipe_anos_${tipoVeiculo}_${marcaSelecionada}_${modeloSelecionado}`;
    const cacheData = localStorage.getItem(cacheKey);

    if (cacheData) {
      setAnos(JSON.parse(cacheData));
      return;
    }

    setCarregando(true);
    fetch(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${marcaSelecionada}/modelos/${modeloSelecionado}/anos`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem(cacheKey, JSON.stringify(data));
          setAnos(data);
        }
        setCarregando(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar anos:', err);
        setAnos([]);
        setCarregando(false);
      });
  }, [modeloSelecionado, marcaSelecionada, tipoVeiculo]);

  // 4. Consulta o preço final do veículo selecionado na FIPE
  const buscarPrecoFipe = () => {
    if (!anoSelecionado) return;

    const cacheKey = `fipe_preco_${tipoVeiculo}_${marcaSelecionada}_${modeloSelecionado}_${anoSelecionado}`;
    const cacheData = localStorage.getItem(cacheKey);

    if (cacheData) {
      setResultado(JSON.parse(cacheData));
      return;
    }

    setCarregando(true);
    fetch(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${marcaSelecionada}/modelos/${modeloSelecionado}/anos/${anoSelecionado}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.Valor) {
          localStorage.setItem(cacheKey, JSON.stringify(data));
          setResultado(data);
        }
        setCarregando(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar resultado FIPE:', err);
        setCarregando(false);
      });
  };

  // 5. Salva o veículo retornado na lista de favoritos (Garagem)
  const adicionarAosFavoritos = () => {
    if (!resultado) return;

    const novoFavorito = {
      ...resultado,
      id: `${resultado.CodigoFipe}-${resultado.AnoModelo}`
    };

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

      {/* Formulário de seleção encadeada */}
      <div className="filtros-container">
        {/* Seletor 1: Tipo de veículo */}
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

        {/* Seletor 2: Marca */}
        <div className="filtro-grupo">
          <label>2. Marca:</label>
          <select 
            value={marcaSelecionada} 
            onChange={(e) => setMarcaSelecionada(e.target.value)}
            disabled={!Array.isArray(marcas) || marcas.length === 0}
          >
            <option value="">-- Selecione uma Marca --</option>
            {Array.isArray(marcas) && marcas.map((m) => (
              <option key={m.codigo} value={m.codigo}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Seletor 3: Modelo */}
        <div className="filtro-grupo">
          <label>3. Modelo:</label>
          <select 
            value={modeloSelecionado} 
            onChange={(e) => setModeloSelecionado(e.target.value)}
            disabled={!Array.isArray(modelos) || modelos.length === 0}
          >
            <option value="">-- Selecione um Modelo --</option>
            {Array.isArray(modelos) && modelos.map((mod) => (
              <option key={mod.codigo} value={mod.codigo}>
                {mod.nome.replaceAll('FATOR', 'FACTOR')}
              </option>
            ))}
          </select>
        </div>

        {/* Seletor 4: Ano / Combustível */}
        <div className="filtro-grupo">
          <label>4. Ano / Combustível:</label>
          <select 
            value={anoSelecionado} 
            onChange={(e) => setAnoSelecionado(e.target.value)}
            disabled={!Array.isArray(anos) || anos.length === 0}
          >
            <option value="">-- Selecione o Ano --</option>
            {Array.isArray(anos) && anos.map((a) => (
              <option key={a.codigo} value={a.codigo}>
                {a.nome
                  .replaceAll('32000', 'Zero KM')
                  .replaceAll('Quilômetro zero', 'Zero KM')
                  .replaceAll('quilômetro zero', 'Zero KM')}
              </option>
            ))}
          </select>
        </div>

        {/* Botão de consulta de preço */}
        <button 
          className="btn-buscar"
          onClick={buscarPrecoFipe}
          disabled={!anoSelecionado}
        >
          {carregando ? 'Carregando...' : 'Consultar Preço'}
        </button>
      </div>

      {/* Card de detalhes do veículo pesquisado */}
      {resultado && (
        <div className="resultado-card">
          <h3>{resultado.Marca} {resultado.Modelo}</h3>
          <p className="preco-destaque">{resultado.Valor}</p>

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

          <button className="btn-favoritar" onClick={adicionarAosFavoritos}>
            ❤️ Salvar na Garagem
          </button>
        </div>
      )}

      {/* Exibição dos veículos salvos na Garagem */}
      {favoritos && favoritos.length > 0 && (
        <div className="garagem-container">
          <h3>🏎️ Sua Garagem</h3>
          <div className="garagem-grid">
            {favoritos.map((veiculo) => (
              <div key={veiculo.id || `${veiculo.CodigoFipe}-${veiculo.AnoModelo}`} className="card-garagem">
                <h4>{veiculo.Marca} {veiculo.Modelo}</h4>
                <p><strong>Preço:</strong> {veiculo.Valor}</p>
                <p>
                  <strong>Ano:</strong>{' '}
                  {String(veiculo.AnoModelo).includes('32000') || String(veiculo.AnoModelo).toLowerCase().includes('quilômetro')
                    ? 'Zero KM'
                    : veiculo.AnoModelo}
                </p>

                <button 
                  className="btn-remover-favorito" 
                  onClick={() => removerDosFavoritos && removerDosFavoritos(veiculo.id || `${veiculo.CodigoFipe}-${veiculo.AnoModelo}`)}
                >
                  🗑️ Remover da Garagem
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}