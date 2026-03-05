/* ============================================================
   CONFIGURACAO PRINCIPAL
   Altere estes valores antes do lancamento (ou use o painel admin)
   ============================================================ */
const CONFIG = {
  // Timestamp em segundos onde o BOOM dispara (ex: 14min32s = 872)
  pitchTimestamp: 22,

  // Numero de vagas exibido na barra de urgencia
  vagasRestantes: 8,

  // Tipo do player: 'youtube' | 'vimeo' | 'panda' | 'iframe-generico'
  // Para Panda Video ou player customizado com API propria, veja a secao
  // "INTEGRACAO DO PLAYER" ao final deste arquivo.
  playerTipo: 'youtube',
};

/* ============================================================
   ESTADO GLOBAL
   ============================================================ */
let boomDisparado = false;
let ytPlayer = null; // instancia da YouTube IFrame API

/* ============================================================
   INICIALIZACAO
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  atualizarVagas(CONFIG.vagasRestantes);
  iniciarAdmin();
  adicionarBotaoTeste();

  // -- PITCH AUTOMATICO (comentado para teste) --
  // Descomente quando o video real estiver configurado:
  //
  // if (CONFIG.playerTipo === 'youtube') {
  //   carregarYouTubeAPI();
  // } else {
  //   monitorarPlayerGenerico();
  // }
});

/* ============================================================
   YOUTUBE IFRAME API
   ============================================================ */
function carregarYouTubeAPI() {
  if (window.YT) {
    criarPlayerYT();
    return;
  }
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

// Callback global chamado pela API do YouTube quando carregada
window.onYouTubeIframeAPIReady = function () {
  criarPlayerYT();
};

function criarPlayerYT() {
  const iframe = document.getElementById('vsl-player');
  if (!iframe) return;

  ytPlayer = new YT.Player('vsl-player', {
    events: {
      onStateChange: onPlayerStateChange,
      onReady: onPlayerReady,
    },
  });
}

function onPlayerReady(event) {
  // Inicia monitoramento de tempo via polling (mais compativel)
  setInterval(() => {
    if (!ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') return;

    const tempo = ytPlayer.getCurrentTime();
    const duracao = ytPlayer.getDuration();

    atualizarProgressBar(tempo, duracao);
    verificarBoom(tempo);
  }, 1000);
}

function onPlayerStateChange(event) {
  // YT.PlayerState.PLAYING = 1
}

/* ============================================================
   MONITORAMENTO DE TEMPO — logica central
   ============================================================ */
function verificarBoom(tempoAtual) {
  if (!boomDisparado && tempoAtual >= CONFIG.pitchTimestamp) {
    boomDisparado = true;
    dispararBoom();
  }
}

function atualizarProgressBar(tempo, duracao) {
  if (!duracao || duracao === 0) return;
  const pct = (tempo / duracao) * 100;
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = pct + '%';
}

/* ============================================================
   O BOOM — sequencia de transicao
   ============================================================ */
function dispararBoom() {
  const flash = document.querySelector('.flash-overlay');

  // 1. Tocar som (se configurado)
  const audio = document.getElementById('boom-audio');
  if (audio && audio.src) {
    audio.play().catch(() => {}); // ignora erro de autoplay
  }

  // 2. Flash branco
  if (flash) {
    flash.classList.add('ativo');
  }

  // 3. Apos o flash, trocar de ato e revelar secoes
  setTimeout(() => {
    if (flash) flash.classList.remove('ativo');
    document.body.classList.replace('ato-1', 'ato-2');
    ativarPlayerSticky();
    revelarSecoesCascata();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 120);
}

function revelarSecoesCascata() {
  const secoes = document.querySelectorAll('.secao-ato2');
  secoes.forEach((secao, i) => {
    setTimeout(() => {
      secao.classList.add('visivel');
    }, i * 180);
  });
}

/* ============================================================
   PLAYER STICKY — aparece no ato 2
   ============================================================ */
function ativarPlayerSticky() {
  const stickyWrapper = document.getElementById('player-sticky');
  const stickyIframe = document.getElementById('vsl-player-sticky');
  const mainIframe = document.getElementById('vsl-player');

  if (!stickyWrapper || !stickyIframe || !mainIframe) return;

  // Copia o src do player principal para o sticky, mantendo o tempo
  // Para YouTube: usa o parametro start (aproximado)
  let src = mainIframe.src || mainIframe.getAttribute('src') || '';

  if (CONFIG.playerTipo === 'youtube' && ytPlayer) {
    const tempoAtual = Math.floor(ytPlayer.getCurrentTime());
    // Reconstroi a URL com autoplay e ponto de inicio
    const videoId = extrairYouTubeId(src);
    if (videoId) {
      src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&start=${tempoAtual}&controls=1&rel=0&modestbranding=1`;
    }
  }

  stickyIframe.src = src;
  stickyWrapper.classList.add('ativo');

  // Pausa o player principal para evitar audio duplo
  if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
    ytPlayer.pauseVideo();
  }
}

function extrairYouTubeId(url) {
  const match = url.match(/embed\/([^?&]+)/);
  return match ? match[1] : null;
}

/* ============================================================
   VAGAS RESTANTES
   ============================================================ */
function atualizarVagas(numero) {
  const el = document.getElementById('vagas-restantes');
  if (el) el.textContent = numero;
  CONFIG.vagasRestantes = numero;
}

/* ============================================================
   BOTAO DE TESTE — visivel apenas em localhost / 127.0.0.1
   ============================================================ */
function adicionarBotaoTeste() {
  const isLocal = ['localhost', '127.0.0.1', ''].includes(location.hostname);
  if (!isLocal) return;

  const btn = document.createElement('button');
  btn.textContent = 'DISPARAR BOOM (teste)';
  btn.id = 'btn-teste-boom';
  btn.style.cssText = `
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 9999;
    background: #e02020;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  `;
  btn.addEventListener('click', () => {
    boomDisparado = false;
    dispararBoom();
    btn.remove();
  });
  document.body.appendChild(btn);
}

/* ============================================================
   PAINEL ADMIN — acessivel via ?admin=true
   ============================================================ */
function iniciarAdmin() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('admin') !== 'true') return;

  const painel = document.getElementById('admin-panel');
  if (!painel) return;
  painel.classList.add('ativo');

  // Preenche campos com valores atuais
  document.getElementById('admin-timestamp').value = CONFIG.pitchTimestamp;
  document.getElementById('admin-vagas').value = CONFIG.vagasRestantes;

  // Salvar timestamp
  document.getElementById('admin-salvar-ts').addEventListener('click', () => {
    const val = parseInt(document.getElementById('admin-timestamp').value, 10);
    if (!isNaN(val) && val >= 0) {
      CONFIG.pitchTimestamp = val;
      boomDisparado = false; // permite re-disparo ao mudar o timestamp
      mostrarFeedbackAdmin('Timestamp atualizado: ' + val + 's');
    }
  });

  // Atualizar vagas
  document.getElementById('admin-salvar-vagas').addEventListener('click', () => {
    const val = parseInt(document.getElementById('admin-vagas').value, 10);
    if (!isNaN(val) && val >= 0) {
      atualizarVagas(val);
      mostrarFeedbackAdmin('Vagas atualizadas: ' + val);
    }
  });

  // Forcar boom
  document.getElementById('admin-forcarboom').addEventListener('click', () => {
    boomDisparado = false;
    dispararBoom();
    mostrarFeedbackAdmin('BOOM disparado!');
  });

  // Preview Ato 1
  document.getElementById('admin-ato1').addEventListener('click', () => {
    boomDisparado = false;
    document.body.classList.remove('ato-2');
    document.body.classList.add('ato-1');
    document.querySelectorAll('.secao-ato2').forEach(s => s.classList.remove('visivel'));
    const sticky = document.getElementById('player-sticky');
    if (sticky) sticky.classList.remove('ativo');
    mostrarFeedbackAdmin('Preview: Ato 1');
  });

  // Preview Ato 2
  document.getElementById('admin-ato2').addEventListener('click', () => {
    boomDisparado = true;
    document.body.classList.remove('ato-1');
    document.body.classList.add('ato-2');
    revelarSecoesCascata();
    mostrarFeedbackAdmin('Preview: Ato 2');
  });

  // Minimizar painel
  const toggleBtn = document.getElementById('admin-toggle');
  const adminBody = document.getElementById('admin-body');
  toggleBtn.addEventListener('click', () => {
    adminBody.classList.toggle('minimizado');
    toggleBtn.textContent = adminBody.classList.contains('minimizado') ? '+' : '−';
  });
}

function mostrarFeedbackAdmin(msg) {
  const hint = document.querySelector('.admin-hint');
  if (!hint) return;
  const original = hint.innerHTML;
  hint.style.color = '#4caf50';
  hint.textContent = msg;
  setTimeout(() => {
    hint.style.color = '';
    hint.innerHTML = original;
  }, 2000);
}

/* ============================================================
   INTEGRACAO DO PLAYER — instrucoes

   Para trocar o player de YouTube para outro:

   1. VIMEO:
      - Carregue a Vimeo Player API: https://player.vimeo.com/api/player.js
      - Crie: const player = new Vimeo.Player(iframe);
      - Use: player.on('timeupdate', data => verificarBoom(data.seconds));
      - Use: player.on('timeupdate', data => atualizarProgressBar(data.seconds, data.duration));

   2. PANDA VIDEO:
      - Consulte a documentacao da API do Panda Video
      - Normalmente expoe um evento de tempo via postMessage ou callback
      - Chame verificarBoom(segundos) dentro do handler de tempo

   3. PLAYER GENERICO (iframe sem API):
      - Nao e possivel acessar o tempo de um iframe cross-origin sem API
      - Use a funcao monitorarPlayerGenerico() abaixo para disparar o boom
        manualmente via painel admin ou via um botao oculto de teste

   ============================================================ */
function monitorarPlayerGenerico() {
  // Placeholder para integracao com outros players
  // Chame verificarBoom(segundoAtual) dentro do callback do seu player
  console.info('[LaunchCaua] Player generico configurado. Implemente a API de tempo do seu player aqui.');
}
