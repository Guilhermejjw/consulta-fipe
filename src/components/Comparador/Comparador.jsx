import React, { useState } from 'react';
import './Comparador.css';

export function Comparador({ favoritos }) {
  const [veiculo1Id, setVeiculo1Id] = useState('');
  const [veiculo2Id, setVeiculo2Id] = useState('');

  // Busca os veículos selecionados da lista de favoritos/garagem
  const v1 = favoritos.find((f) => f.id === veiculo1Id);
  const v2 = favoritos.find((f) => f.id === veiculo2Id);

  // Converte a string "R$ 20.124,00" para o número 20124.00 para fazer cálculos
  const parsePreco = (valorString) => {
    if (!valorString) return 0;
    return parseFloat(
      valorString
        .replace('R$', '')
        .replace('.', '')
        .replace(',', '.')
        .trim()
    );
  };

  const preco1 = v1 ? parsePreco(v1.Valor) : 0;
  const preco2 = v2 ? parsePreco(v2.Valor) : 0;

  const diferencaReais = Math.abs(preco1 - preco2);
  const maiorPreco = Math.max(preco1, preco2);
  const diferencaPorcentagem = maiorPreco > 0 
    ? ((diferencaReais / Math.min(preco1, preco2)) * 100).toFixed(1) 
    : 0;

  return (
    <div className="comparador-container">
      <h2>⚖️ Comparador de Veículos</h2>
      <p className="comparador-sub">
        Selecione dois veículos da sua Garagem para comparar os valores lado a lado.
      </p>

      {favoritos.length < 2 ? (
        <div className="comparador-aviso">
          ⚠️ Você precisa ter pelo menos <strong>2 veículos salvos na Garagem</strong> para realizar uma comparação.
        </div>
      ) : (
        <>
          <div className="comparador-seletor-grid">
            <div className="seletor-box">
              <label>Veículo 1:</label>
              <select 
                value={veiculo1Id} 
                onChange={(e) => setVeiculo1Id(e.target.value)}
              >
                <option value="">-- Selecione o 1º Veículo --</option>
                {favoritos.map((fav) => (
                  <option key={fav.id} value={fav.id}>
                    {fav.Marca} {fav.Modelo} ({fav.AnoModelo})
                  </option>
                ))}
              </select>
            </div>

            <div className="seletor-box">
              <label>Veículo 2:</label>
              <select 
                value={veiculo2Id} 
                onChange={(e) => setVeiculo2Id(e.target.value)}
              >
                <option value="">-- Selecione o 2º Veículo --</option>
                {favoritos.map((fav) => (
                  <option key={fav.id} value={fav.id}>
                    {fav.Marca} {fav.Modelo} ({fav.AnoModelo})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TABELA COMPARATIVA LADO A LADO */}
          {v1 && v2 && (
            <div className="tabela-comparativa-wrapper">
              <table className="tabela-comparativa">
                <thead>
                  <tr>
                    <th>Característica</th>
                    <th>{v1.Modelo}</th>
                    <th>{v2.Modelo}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Marca</strong></td>
                    <td>{v1.Marca}</td>
                    <td>{v2.Marca}</td>
                  </tr>
                  <tr>
                    <td><strong>Ano / Modelo</strong></td>
                    <td>{String(v1.AnoModelo).includes('32000') ? 'Zero KM' : v1.AnoModelo}</td>
                    <td>{String(v2.AnoModelo).includes('32000') ? 'Zero KM' : v2.AnoModelo}</td>
                  </tr>
                  <tr>
                    <td><strong>Preço FIPE</strong></td>
                    <td className={preco1 < preco2 ? 'preco-menor' : 'preco-maior'}>
                      {v1.Valor}
                    </td>
                    <td className={preco2 < preco1 ? 'preco-menor' : 'preco-maior'}>
                      {v2.Valor}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Combustível</strong></td>
                    <td>{v1.Combustivel}</td>
                    <td>{v2.Combustivel}</td>
                  </tr>
                  <tr>
                    <td><strong>Código FIPE</strong></td>
                    <td>{v1.CodigoFipe}</td>
                    <td>{v2.CodigoFipe}</td>
                  </tr>
                </tbody>
              </table>

              {/* RESUMO DA DIFERENÇA FINANCEIRA */}
              <div className="comparador-resumo">
                <h3>📊 Análise da Diferença</h3>
                {preco1 === preco2 ? (
                  <p>Ambos os veículos possuem exatamente o mesmo valor FIPE.</p>
                ) : (
                  <p>
                    O modelo <strong>{preco1 > preco2 ? v1.Modelo : v2.Modelo}</strong> é{' '}
                    <strong>R$ {diferencaReais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> ({diferencaPorcentagem}%) mais caro que o{' '}
                    <strong>{preco1 < preco2 ? v1.Modelo : v2.Modelo}</strong>.
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}