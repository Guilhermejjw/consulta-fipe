import { useState, useEffect } from 'react';
import './Main.css';

// Componente principal para consulta real da Tabela FIPE
export default function Main({ favoritos = [], setFavoritos, removerDosFavoritos }) {
  // Estados para armazenar seleções e respostas da API
  const [tipoVeiculo, setTipoVeiculo] = useState('carros');
  const [marcas, setMarcas] = useState([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState('');

  const [modelos, setModelos] = useState([]);
  const [modeloSelecionado, setModeloSelecionado] = useState('');

  const [anos, setAnos] = useState([]);
  const [anoSelecionado, setAnoSelecionado] = useState('');

  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  // 1. BUSCA MARCAS NA API REAL DA FIPE
  useEffect(() => {
    setMarcas([]);
    setMarcaSelecionada('');
    setModelos([]);
    setModeloSelecionado('');
    setAnos([]);
    setAnoSelecionado('');
    setResultado(null);
    setMensagemErro('');

    setCarregando(true);
    fetch(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status === 429 ? 'Limite de requisições atingido. Aguarde alguns instantes.' : 'Falha ao conectar com a API.');
        }
        return res.json();
      })
      .then((data) => {
        setMarcas(Array.isArray(data) ? data : []);
        setCarregando(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar marcas:', err);
        setMensagemErro(err.message);
        setMarcas([]);
        setCarregando(false);
      });
  }, [tipoVeiculo]);

  // 2. BUSCA MODELOS DA MARCA SELECIONADA
  useEffect(() => {
    if (!marcaSelecionada) return;

    setModelos([]);
    setModeloSelecionado('');
    setAnos([]);
    setAnoSelecionado('');
    setResultado(null);
    setMensagemErro('');

    setCarregando(true);
    fetch(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${marcaSelecionada}/modelos`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status === 429 ? 'Limite de requisições atingido. Aguarde alguns instantes.' : 'Falha ao buscar modelos.');
        }
        return res.json();
      })
      .then((data) => {
        setModelos(data && Array.isArray(data.modelos) ? data.modelos : []);
        setCarregando(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar modelos:', err);
        setMensagemErro(err.message);
        setModelos([]);
        setCarregando(false);
      });
  }, [marcaSelecionada, tipoVeiculo]);

  // 3. BUSCA ANOS DO MODELO SELECIONADO
  useEffect(() => {
    if (!modeloSelecionado) return;

    setAnos([]);
    setAnoSelecionado('');
    setResultado(null);
    setMensagemErro('');

    setCarregando(true);
    fetch(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${marcaSelecionada}/modelos/${modeloSelecionado}/anos`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status === 429 ? 'Limite de requisições atingido. Aguarde alguns instantes.' : 'Falha ao buscar anos.');
        }
        return res.json();
      })
      .then((data) => {
        setAnos(Array.isArray(data) ? data : []);
        setCarregando(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar anos:', err);
        setMensagemErro(err.message);
        setAnos([]);
        setCarregando(false);
      });
  }, [modeloSelecionado, marcaSelecionada, tipoVeiculo]);

  // 4. CONSULTA O PREÇO FINAL DO VEÍCULO NA FIPE
  const buscarPrecoFipe = () => {
    if (!anoSelecionado) return;

    setCarregando(true);
    setMensagemErro('');
    fetch(`https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${marcaSelecionada}/modelos/${modeloSelecionado}/anos/${anoSelecionado}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Falha ao consultar preço na Tabela FIPE.');
        }
        return res.json();
      })
      .then((data) => {
        setResultado(data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar resultado FIPE:', err);
        setMensagemErro(err.message);
        setCarregando(false);
      });
  };

  // 5. ADICIONA VEÍCULO CONSULTADO AOS FAVORITOS
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
    // 6. FUNÇÃO PARA COMPARTILHAR OU COPIAR O LINK DA CONSULTA
  const compartilharConsulta = (modo) => {
    if (!resultado) return;

    const anoExibicao = String(resultado.AnoModelo).includes('32000') || String(resultado.AnoModelo).toLowerCase().includes('quilômetro')
      ? 'Zero KM'
      : resultado.AnoModelo;

    const texto = `🚘 *Consulta Tabela FIPE*\n\n` +
      `*Veículo:* ${resultado.Marca} ${resultado.Modelo}\n` +
      `*Ano/Modelo:* ${anoExibicao}\n` +
      `*Combustível:* ${resultado.Combustivel}\n` +
      `*Preço FIPE:* ${resultado.Valor}\n` +
      `*Mês de Referência:* ${resultado.MesReferencia}\n\n` +
      `Confira em: https://consulta-fipe-one.vercel.app/`;

    if (modo === 'whatsapp') {
      const urlWhatsapp = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
      window.open(urlWhatsapp, '_blank');
    } else if (modo === 'copiar') {
      navigator.clipboard.writeText(texto)
        .then(() => alert('📋 Informações do veículo copiadas para a área de transferência!'))
        .catch(() => alert('Erro ao copiar texto.'));
    }
  };

  return (
    <main className="main-container">
      <h2>Busca de Veículos na Tabela FIPE</h2>

      {mensagemErro && (
        <div style={{ color: '#d9534f', backgroundColor: '#fdf7f7', padding: '10px', borderRadius: '6px', marginBottom: '15px', textAlign: 'center' }}>
          ⚠️ {mensagemErro}
        </div>
      )}

      <div className="filtros-container">
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

        <button 
          className="btn-buscar"
          onClick={buscarPrecoFipe}
          disabled={!anoSelecionado}
        >
          {carregando ? 'Carregando...' : 'Consultar Preço'}
        </button>
      </div>

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
          
          {/* NOVOS BOTÕES DE COMPARTILHAMENTO */}
          <div className="acoes-compartilhar" style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn-whatsapp" 
              onClick={() => compartilharConsulta('whatsapp')}
              style={{ backgroundColor: '#25D366', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              🟢 Enviar no WhatsApp
            </button>

            <button 
              className="btn-copiar" 
              onClick={() => compartilharConsulta('copiar')}
              style={{ backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              📋 Copiar Resumo
            </button>
          </div>
        </div>
      )}

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