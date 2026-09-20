import React from 'react';
import './Comparador.css';

export function Comparador({ favoritos }) {
  // Se não houver pelo menos 2 veículos salvos, mostra a mensagem de aviso
  if (!favoritos || favoritos.length < 2) {
    return (
      <div className="comparador-container">
        <h3>⚖️ Comparador de Veículos</h3>
        <p>Selecione dois veículos da sua Garagem para comparar os valores lado a lado.</p>
        <div className="comparador-aviso">
          ⚠️ Você precisa ter pelo menos 2 veículos salvos na Garagem para realizar uma comparação.
        </div>
      </div>
    );
  }

  // Estados locais para guardar a escolha dos dois veículos na tela
  const [veiculo1Id, setVeiculo1Id] = React.useState(favoritos[0]?.id || '');
  const [veiculo2Id, setVeiculo2Id] = React.useState(favoritos[1]?.id || '');

  // Busca os dados completos dos veículos selecionados
  // Sincronização estrita de ID convertendo tudo para String (evita carregar favoritos[0] por engano)
  const veiculo1 = favoritos.find((v) => String(v.id || `${v.CodigoFipe}-${v.AnoModelo}`) === String(veiculo1Id)) || favoritos[0];
  const veiculo2 = favoritos.find((v) => String(v.id || `${v.CodigoFipe}-${v.AnoModelo}`) === String(veiculo2Id)) || favoritos[1];

  // Função interna para analisar a diferença de preço e explicar os motivos
  // Função auxiliar para converter o texto "R$ 45.116,00" em número (45116.00)
  const converterPrecoParaNumero = (precoString) => {
    if (!precoString) return 0;
    const limpo = precoString.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    return parseFloat(limpo) || 0;
  };

  const gerarAnalisePreco = (v1, v2) => {
    if (!v1 || !v2) return null;

    const preco1 = converterPrecoParaNumero(v1.Valor);
    const preco2 = converterPrecoParaNumero(v2.Valor);

    // Se os preços forem idênticos
    if (preco1 === preco2) {
      return {
        diferenca: 0,
        maisCaro: v1,
        maisBarato: v2,
        motivos: ['💡 Ambos os veículos possuem o mesmo valor na Tabela FIPE.']
      };
    }

    const diferenca = Math.abs(preco1 - preco2);
    const maisCaro = preco1 > preco2 ? v1 : v2;
    const maisBarato = preco1 > preco2 ? v2 : v1;

    const anoCaro = parseInt(maisCaro.AnoModelo) || 0;
    const anoBarato = parseInt(maisBarato.AnoModelo) || 0;
    const difAnos = Math.abs(anoCaro - anoBarato);

    const motivos = [];

    // 1. Análise por Ano de Fabricação / Zero KM
    const ehZeroCaro = anoCaro === 32000 || String(maisCaro.AnoModelo).toLowerCase().includes('quilômetro');
    const ehZeroBarato = anoBarato === 32000 || String(maisBarato.AnoModelo).toLowerCase().includes('quilômetro');

    if (ehZeroCaro && !ehZeroBarato) {
      motivos.push(
        `✨ <strong>Condição do Veículo:</strong> O ${maisCaro.Modelo.replace(/\.+$/, '')} é um modelo <strong>Zero KM</strong>, o que justifica o valor superior por ser um veículo novo de fábrica sem desgaste.`
      );
    } else if (!ehZeroCaro && ehZeroBarato) {
      motivos.push(
        `✨ <strong>Condição do Veículo:</strong> O ${maisCaro.Modelo.replace(/\.+$/, '')} é usado (${anoCaro}), porém mantém valor superior ao modelo Zero KM (${anoBarato}) devido à versão superior ou equipamentos.`
      );
    } else if (!ehZeroCaro && !ehZeroBarato) {
      if (anoCaro > anoBarato) {
        motivos.push(
          `📅 <strong>Ano de Fabricação:</strong> O ${maisCaro.Modelo.replace(/\.+$/, '')} é ${difAnos} ano(s) mais novo (${anoCaro} vs ${anoBarato}), o que justifica o valor superior.`
        );
      } else if (anoCaro < anoBarato) {
        motivos.push(
          `📅 <strong>Ano de Fabricação:</strong> O ${maisCaro.Modelo.replace(/\.+$/, '')} é ${difAnos} ano(s) mais antigo (${anoCaro} vs ${anoBarato}), mas mantém um valor superior devido à versão ou equipamentos.`
        );
      }
    }

    // 2. Análise por Versão / Equipamentos
    const nomeCaro = maisCaro.Modelo.toLowerCase();
    const nomeBarato = maisBarato.Modelo.toLowerCase();

    if (nomeCaro.includes('comfort') && !nomeBarato.includes('comfort')) {
      motivos.push('🚗 <strong>Pacote de Equipamentos:</strong> A versão COMFORT inclui itens adicionais de série.');
    }

    if (nomeCaro.includes('turbo') && !nomeBarato.includes('turbo')) {
      motivos.push('⚡ <strong>Motorização:</strong> O motor TURBO oferece maior potência e valor agregado.');
    }

    if ((nomeCaro.includes('aut') || nomeCaro.includes('automatico')) && !nomeBarato.includes('aut')) {
      motivos.push('🕹️ <strong>Câmbio:</strong> Modelos com transmissão automática possuem custo superior no mercado.');
    }

    // 3. Análise por Cilindrada / Motorização (Ex: 125cc vs 150cc, 1.0 vs 1.6, etc.)
    // 3. Análise por Cilindrada / Motorização (Ex: 125i vs 150, 1.0 vs 1.6)
const extrairCilindradaOuMotor = (nome) => {
  // Captura números de cilindrada mesmo que colados com 'i', 'cc', 'f' (ex: 125i, 150, 250cc)
  const matchCilindrada = nome.match(/(100|125|150|160|190|200|250|300|400|500|600|650|700|800|1000)(i|cc|f|\b)/i);
  if (matchCilindrada) return { tipo: 'cc', valor: parseInt(matchCilindrada[1]) };

  // Captura motorização de carros (ex: 1.0, 1.4, 1.6, 2.0, 3.0)
  const matchMotorCarro = nome.match(/(1\.0|1\.3|1\.4|1\.5|1\.6|1\.8|2\.0|2\.4|3\.0)/);
  if (matchMotorCarro) return { tipo: 'litros', valor: parseFloat(matchMotorCarro[1]) };

  return null;
};

const motorCaro = extrairCilindradaOuMotor(nomeCaro);
const motorBarato = extrairCilindradaOuMotor(nomeBarato);

if (motorCaro && motorBarato && motorCaro.tipo === motorBarato.tipo && motorCaro.valor > motorBarato.valor) {
  if (motorCaro.tipo === 'cc') {
    motivos.push(
      `🏍️ <strong>Cilindrada / Motorização:</strong> O modelo mais caro possui maior cilindrada (${motorCaro.valor}cc vs ${motorBarato.valor}cc), oferecendo maior potência e torque.`
    );
  } else {
    motivos.push(
      `🚗 <strong>Motorização:</strong> O modelo mais caro possui motor de maior capacidade (${motorCaro.valor} vs ${motorBarato.valor}), garantindo melhor desempenho.`
    );
  }
}

    // 3. Caso não haja palavra-chave identificada
    if (motivos.length === 0) {
      motivos.push('💡 <strong>Variação de Mercado:</strong> A diferença reflete as cotações oficiais da Tabela FIPE para pacotes de fábrica e acabamentos específicos.');
    }

    return { diferenca, maisCaro, maisBarato, motivos };
  };
  const analise = gerarAnalisePreco(veiculo1, veiculo2);

  return (
    <div className="comparador-container">
      <h3>⚖️ Comparador de Veículos</h3>
      <p>Selecione dois veículos da sua Garagem para comparar os valores lado a lado.</p>

      {/* SELETORES DE VEÍCULOS */}
      <div className="comparador-seletores">
        <div className="seletor-box">
          <label>Veículo 1:</label>
          <select value={veiculo1Id} onChange={(e) => setVeiculo1Id(e.target.value)}>
            {favoritos.map((fav) => (
              <option key={fav.id || `${fav.CodigoFipe}-${fav.AnoModelo}`} value={fav.id || `${fav.CodigoFipe}-${fav.AnoModelo}`}>
                {fav.Marca} {fav.Modelo} ({fav.AnoModelo})
              </option>
            ))}
          </select>
        </div>

        <div className="seletor-box">
          <label>Veículo 2:</label>
          <select value={veiculo2Id} onChange={(e) => setVeiculo2Id(e.target.value)}>
            {favoritos.map((fav) => (
              <option key={fav.id} value={fav.id}>
                {fav.Marca} {fav.Modelo} ({fav.AnoModelo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABELA COMPARATIVA LADO A LADO */}
      {veiculo1 && veiculo2 && (
        <>
          <table className="tabela-comparativa">
            <thead>
              <tr>
                <th>Característica</th>
                <th>{veiculo1.Modelo}</th>
                <th>{veiculo2.Modelo}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Marca</strong></td>
                <td>{veiculo1.Marca}</td>
                <td>{veiculo2.Marca}</td>
              </tr>
              <tr>
                <td><strong>Ano / Modelo</strong></td>
                <td>{String(veiculo1.AnoModelo).includes('32000') ? 'Zero KM' : veiculo1.AnoModelo}</td>
                <td>{String(veiculo2.AnoModelo).includes('32000') ? 'Zero KM' : veiculo2.AnoModelo}</td>
              </tr>
              <tr>
                <td><strong>Preço FIPE</strong></td>
                <td className="preco-celula">{veiculo1.Valor}</td>
                <td className="preco-celula">{veiculo2.Valor}</td>
              </tr>
              <tr>
                <td><strong>Combustível</strong></td>
                <td>{veiculo1.Combustivel}</td>
                <td>{veiculo2.Combustivel}</td>
              </tr>
              <tr>
                <td><strong>Código FIPE</strong></td>
                <td>{veiculo1.CodigoFipe}</td>
                <td>{veiculo2.CodigoFipe}</td>
              </tr>
            </tbody>
          </table>

          {/* NOVA CAIXA DE ANÁLISE DE MOTIVOS */}
          {analise && (
            <div className="analise-container">
              <h4>📊 Análise de Valorização</h4>
              <p className="resumo-diferenca">
                O <strong>{analise.maisCaro.Modelo}</strong> é{' '}
                <span className="destaque-preco">
                  R$ {analise.diferenca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} mais caro
                </span>{' '}
                que o {analise.maisBarato.Modelo}.
              </p>

              <h5>Por que essa diferença existe?</h5>
              <ul className="lista-motivos">
                {analise.motivos.map((motivo, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: motivo }} />
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}