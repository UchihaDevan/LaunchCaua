/* ============================================================
   CONFIGURACAO PRINCIPAL
   ============================================================ */
const CONFIG = {
  // Numero de vagas exibido na barra de urgencia
  vagasRestantes: 8,

  // ATENÇÃO: Configure aqui exato em que o Pitch acontece (em segundos)
  // Ex: Se ocorrer aos 12 minutos e 30 segundos, coloque 750 (12 * 60 + 30)
  tempoDoPitch: 210 // 4 minutos e 10 segundos
};

/* ============================================================
   ESTADO GLOBAL
   ============================================================ */
let boomDisparado = false;/* ============================================================
   INICIALIZACAO
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  atualizarVagas(CONFIG.vagasRestantes);
  iniciarAdmin();
  adicionarBotaoTeste();
  observarRevelacaoVTurb(); // Inicia o observador
});

/* ============================================================
   OBSERVADOR DO VTURB (MÉTODO MUTATION OBSERVER)
   ============================================================ */
function observarRevelacaoVTurb() {
  const ato2El = document.getElementById('ato2');
  if (!ato2El) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        const displayStyle = window.getComputedStyle(ato2El).display;
        // Quando o VTurb remover o "display: none" (mudando para block)
        if (displayStyle !== 'none' && !boomDisparado) {
          ativarEfeitosDoPitch();
        }
      }
    });
  });

  observer.observe(ato2El, { attributes: true });
}

/* ============================================================
   EFEITOS DO BOOM (Som, Flash, Classes)
   ============================================================ */
function ativarEfeitosDoPitch() {
  if (boomDisparado) return;
  boomDisparado = true;

  console.log("💥 CONTEÚDO REVELADO PELO VTURB!");

  const flash = document.querySelector('.flash-overlay');

  // 1. Som (se configurado)
  const audio = document.getElementById('boom-audio');
  if (audio && audio.src) {
    audio.play().catch(() => { });
  }

  // 2. Flash branco
  if (flash) flash.classList.add('ativo');

  // 3. Apos o flash, trocar de ato e revelar secoes
  setTimeout(() => {
    if (flash) flash.classList.remove('ativo');
    document.body.classList.replace('ato-1', 'ato-2');
    revelarSecoesCascata();
    window.scrollBy({ top: 300, behavior: 'smooth' });
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
   ESCUTAR MENSAGENS DO VTURB (postMessage)
   ============================================================ */
window.addEventListener('message', function (event) {
  // Verifica se a mensagem veio do iframe querendo disparar o boom
  if (event.data === 'dispararBoom' || (event.data && event.data.action === 'dispararBoom')) {
    console.log("Recebido comando do VTurb via postMessage");
    dispararBoom();
  }
});

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
    boomDisparado = false; // permite re-disparo no modo de teste
    // Simula a mudanca feita pelo VTurb para testar o observer
    const ato2 = document.getElementById('ato2');
    if (ato2) ato2.style.display = 'block';
    btn.remove();
  });
  document.body.appendChild(btn);
}

/* ============================================================
   PAINEL ADMIN — acessivel via ?admin=true na URL
   ============================================================ */
function iniciarAdmin() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('admin') !== 'true') return;

  const painel = document.getElementById('admin-panel');
  if (!painel) return;
  painel.classList.add('ativo');

  document.getElementById('admin-vagas').value = CONFIG.vagasRestantes;

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
    mostrarFeedbackAdmin('Preview: Ato 1');
  });

  // Preview Ato 2
  document.getElementById('admin-ato2').addEventListener('click', () => {
    boomDisparado = false;
    dispararBoom();
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
