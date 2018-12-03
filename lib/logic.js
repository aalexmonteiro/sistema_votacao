'use strict';

/*
  Transacao para voto
  @param {gov.tse.eleicao.voto} voto
  @transaction
 */
function voto(vt) {
    // Checa se o eleitor já votou
    if (!vt.seVotouAsset.eleitorVotou) {
        //Checa se o candidato repassado no voto existe
        if (['Joao', 'Jose', 'Maria'].includes(vt.candidatoAsset.nome)) {
            // Computa o voto para o candidato
            vt.candidatoAsset.votosTotais = vt.candidatoAsset.votosTotais + 1;
            return getAssetRegistry('gov.tse.eleicao.candidato')
                .then(function (assetRegistry) {
                    return assetRegistry.update(vt.candidatoAsset);
                })
                .then(function () {
                    // Atualiza o status do eleitor
                    return getAssetRegistry('gov.tse.eleicao.seVotou')
                        .then(function (assetRegistry) {
                            vt.seVotouAsset.eleitorVotou = true;
                            return assetRegistry.update(vt.seVotouAsset);
                        })
                });
        } else {
            throw new Error('Voto não válido! O candidato votado não consta nos registros.');
        }
        
    } else {
        throw new Error('Voto já foi computado! Não é permitido votar mais de uma vez');
    }
}