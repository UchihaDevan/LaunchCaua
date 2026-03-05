# 📋 Planejamento — Página Upsell VSL | Curso de Copywriting

> **Status:** Planejamento aprovado — aguardando desenvolvimento  
> **Última atualização:** Março 2026  
> **Responsável:** A definir

---

## 1. Visão Geral do Projeto

### Objetivo
Criar uma página de upsell pós-compra para um curso de copywriting, utilizando uma VSL (Video Sales Letter) como elemento central. A página deve manter o lead focado no vídeo até o momento do pitch e, nesse instante, sofrer uma transformação dramática para maximizar conversões.

### Produto
- **Curso base:** Copywriting para iniciantes (já adquirido pelo lead)
- **Upsell:** Mentoria em grupo / ao vivo (acesso avançado)
- **Nome temporário:** COPY AVANÇADO *(substituir pelo nome definitivo)*
- **Preço:** Acima de R$ 997

### Público-alvo
Iniciantes que já conhecem o básico de copywriting. **Ponto crítico:** esse público reconhece gatilhos mentais, timers falsos e headlines genéricas. A página precisa ser sofisticada o suficiente para não parecer manipuladora.

---

## 2. Conceito Central — "A Página em Dois Atos"

A página possui **dois estados completamente distintos**, separados por um evento de virada disparado em um timestamp configurável do vídeo.

```
┌─────────────────────────────────────────────────────────┐
│  ATO 1 — PRÉ-PITCH          ATO 2 — PÓS-PITCH (BOOM)   │
│  ─────────────────          ──────────────────────────  │
│                             ╔══ HEADLINE VERMELHA ════╗  │
│  "Headline única"           ║  Cards da mentoria      ║  │
│                             ║  Para quem é            ║  │
│  ┌─────────────────┐  BOOM  ║  Depoimentos            ║  │
│  │   PLAYER VSL   │ ─────► ║  Preço + ancoragem      ║  │
│  │                 │        ║  Garantia               ║  │
│  └─────────────────┘        ║  [CTA]  [Recusa]        ║  │
│                             ╚═════════════════════════╝  │
│  Fundo: #111111             Fundo: #FAFAFA               │
│  Foco total                 Conversão total              │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Identidade Visual

### Paleta de Cores

| Variável CSS         | Hex       | Uso                                          |
|----------------------|-----------|----------------------------------------------|
| `--branco`           | `#FFFFFF` | Texto sobre fundos escuros/vermelhos         |
| `--off-white`        | `#FAFAFA` | Fundo principal do Ato 2                     |
| `--cinza-claro`      | `#F2F2F2` | Fundo de seções alternadas no Ato 2          |
| `--grafite`          | `#111111` | Fundo do Ato 1 (hero / foco total)           |
| `--vermelho`         | `#E02020` | Headlines, botões, destaques principais      |
| `--vermelho-escuro`  | `#A01010` | Hover de botões, sombras, profundidade       |
| `--vermelho-suave`   | `#FFF0F0` | Background de cards e alertas no Ato 2       |
| `--texto-principal`  | `#111111` | Corpo do texto                               |
| `--texto-secundario` | `#666666` | Subtítulos, notas, labels                   |

### Tipografia

| Papel             | Fonte               | Peso     | Uso                              |
|-------------------|---------------------|----------|----------------------------------|
| Títulos impacto   | `Bebas Neue`        | Regular  | Headlines principais, números    |
| Subtítulos        | `DM Serif Display`  | Regular  | Frases de apoio, citações        |
| Corpo             | `DM Sans`           | 300–700  | Parágrafos, listas, botões       |

```html
<!-- Google Fonts import -->
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
```

### Estética Geral
- **Tom visual:** Editorial de luxo — referência em revista de negócios premium
- **Ato 1:** Cinematográfico — escuro, silencioso, o vídeo como protagonista absoluto
- **Ato 2:** Vivo, dinâmico, com energia e movimento — mas ainda sofisticado
- **NÃO usar:** Gradientes roxos, fontes Inter/Roboto, layout genérico de curso online

---

## 4. Estrutura da Página

### ATO 1 — Estado Pré-Pitch (Foco Total)

**Objetivo:** Zero distração. O lead não tem para onde olhar além do vídeo.

#### Elementos presentes:
1. **Headline única** — acima do player
2. **Player VSL** — centralizado, grande, dominando a tela
3. **Indicador de progresso** — barra discreta abaixo do player *(opcional)*

#### Elementos ausentes (intencionalmente):
- Preço
- Botão de compra
- Depoimentos
- Lista de benefícios
- Menu ou navegação
- Barra de urgência/timer

#### Copy da Headline (Ato 1):
```
"Você aprendeu as técnicas.
A maioria para aqui."
```
> Sem subtítulo. Sem pontuação excessiva. Direto.

#### CSS do Ato 1:
```css
body.ato-1 {
  background: #111111;
  color: #FAFAFA;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.player-wrapper {
  width: min(860px, 92vw);
  aspect-ratio: 16/9;
}
```

---

### O EVENTO "BOOM" — Transição

**Gatilho:** JavaScript escuta o evento de tempo do player. Quando o vídeo atinge o timestamp configurado (ex: `14:32`), a transformação é disparada.

#### Sequência da transição:
1. **Flash branco** na tela inteira — duração: ~120ms — como um corte de câmera
2. **Fundo muda** de `#111111` para `#FAFAFA` — transição: 400ms
3. **Linha vermelha** (`#E02020`) corta a tela horizontalmente separando o player do novo conteúdo — entra em 300ms
4. **Título do Ato 2** surge com efeito de reveal por letra (ou typewriter) — duração: ~800ms
5. **Seções do Ato 2** entram em cascata com `animation-delay` escalonado

#### O player no Ato 2:
- **Não desaparece** — sobe para um formato menor e fixado (sticky) no topo ou canto inferior
- O lead pode continuar assistindo enquanto lê a página

#### Efeito sonoro (opcional):
- Um som sutil de "whoosh" ou "impact" pode acompanhar o flash
- Implementar com `<audio>` e `play()` no gatilho JS

#### Estrutura JS do gatilho:
```javascript
const PITCH_TIMESTAMP = 872; // segundos — CONFIGURÁVEL

player.on('timeupdate', () => {
  if (player.currentTime >= PITCH_TIMESTAMP && !boomDisparado) {
    boomDisparado = true;
    dispararBoom();
  }
});

function dispararBoom() {
  // 1. Flash
  document.querySelector('.flash-overlay').classList.add('ativo');
  
  // 2. Após flash, revelar Ato 2
  setTimeout(() => {
    document.body.classList.replace('ato-1', 'ato-2');
    revelarSecoesCascata();
  }, 120);
}

function revelarSecoesCascata() {
  const secoes = document.querySelectorAll('.secao-ato2');
  secoes.forEach((secao, i) => {
    setTimeout(() => {
      secao.classList.add('visivel');
    }, i * 180); // 180ms de delay entre cada seção
  });
}
```

---

### ATO 2 — Estado Pós-Pitch (Conversão Total)

**Objetivo:** Revelar toda a informação necessária para a decisão de compra, de forma progressiva e impactante.

#### Seções (em ordem de aparição):

---

#### 4.1 Headline da Oferta
- **Tipo:** Título grande em `Bebas Neue`, cor `#E02020`
- **Copy sugerido:**
```
"O que separa quem aprende copy
de quem fatura com ele."
```
- Entra primeiro, antes de qualquer outro elemento

---

#### 4.2 O Gap Honesto (Transição narrativa)
- **Formato:** 2–3 parágrafos curtos em `DM Sans`
- **Tom:** Direto, sem enrolação, sem hipérboles
- **Conteúdo:** Admitir que o curso base ensina o *quê* fazer, mas a mentoria ensina como fazer **funcionar no mundo real** — com feedback direto de quem já errou e acertou
- **Exemplo de copy:**
```
O curso te deu o mapa.
A mentoria te leva pelo caminho — ao lado de quem já percorreu.

Copiar fórmulas funciona até certo ponto.
Depois disso, o que evolui é o julgamento.
E julgamento só se desenvolve com prática e feedback real.
```

---

#### 4.3 O Que É a Mentoria
- **Formato:** Cards ou lista limpa com ícones
- **Informações a incluir:**
  - Frequência das sessões (ex: 2x por mês, ao vivo)
  - Formato (Zoom, grupos de até X pessoas)
  - Duração de cada sessão
  - O que acontece nas sessões (revisão de copies, perguntas, exercícios ao vivo)
  - Período de acesso

> ⚠️ **Preencher com dados reais antes do desenvolvimento**

---

#### 4.4 Para Quem É — e Para Quem NÃO É
- **Formato:** Duas colunas ou dois blocos
- **Objetivo:** Credibilidade. Público de copy sabe que "é para todo mundo" é sinal de produto fraco.

**Para quem É:**
- Quem terminou (ou está terminando) o curso base
- Quem quer validação externa antes de lançar copies para clientes
- Quem aprende melhor com feedback do que com conteúdo solo

**Para quem NÃO É:**
- Quem ainda não passou pelo material do curso base
- Quem busca um atalho sem praticar
- Quem não tem tempo para participar das sessões ao vivo

---

#### 4.5 Resultados de Alunos (Prova Social)
- **Formato:** Depoimentos com foto, nome, nicho e resultado específico
- **Regra:** Nada de "mudou minha vida". Resultados com números e contexto.
- **Exemplos de formato:**
```
"Em 30 dias aplicando o feedback da mentoria,
fechei meu primeiro cliente de R$ 2.400."
— [Nome], nicho: e-commerce, cidade: SP
```
- Mínimo: 3 depoimentos
- Ideal: 5–6, alternando nichos diferentes

> ⚠️ **Inserir depoimentos reais antes do lançamento**

---

#### 4.6 Preço + Ancoragem
- **Preço:** Acima de R$ 997 *(definir valor exato)*
- **Ancoragem honesta:** Não comparar com "cursos similares de R$ 5.000". Comparar com o custo real de errar sozinho — ex: tempo perdido, clientes perdidos, proposta mal precificada.
- **Formato:**
  - Preço antigo riscado (se houver desconto de lançamento)
  - Preço atual em destaque
  - Parcelamento visível (ex: 12x de R$ XX)
  - Nota sobre o que está incluído no valor

---

#### 4.7 Garantia
- **Período:** 7 dias *(confirmar)*
- **Tom:** Simples, sem asteriscos, sem letras miúdas
- **Copy sugerido:**
```
7 dias de garantia incondicional.
Se não for para você, devolvemos tudo.
Sem burocracia, sem perguntas.
```

---

#### 4.8 CTA + Recusa Consciente
- **Botão principal:** `[QUERO ENTRAR NA MENTORIA]`
  - Cor: `#E02020` | Hover: `#A01010`
  - Tamanho: Generoso, impossível ignorar
- **Link de recusa** abaixo do botão (texto pequeno, sem destaque):
  - `"Prefiro continuar sem feedback por enquanto"`
  - Essa frase **verbaliza o custo** de não comprar — técnica clássica de copy que funciona especialmente bem com público que conhece a técnica

---

#### 4.9 Barra de Urgência/Escassez
- **Aparece apenas no Ato 2**, nunca antes
- **Tipo de escassez:** Vagas limitadas na turma de mentoria (mais crível que timer genérico)
- **Exemplo:** `"Restam 8 vagas na turma de Abril"`
- Posição: Fixa no topo após o boom, ou acima do CTA

---

## 5. Painel de Controle (Admin)

Para facilitar ajustes sem mexer no código principal, implementar um painel oculto acessível via query string na URL:

```
https://seusite.com/upsell?admin=true
```

### Funcionalidades do painel:
| Controle               | Descrição                                              |
|------------------------|--------------------------------------------------------|
| `PITCH_TIMESTAMP`      | Definir o momento exato (em segundos) do boom          |
| Forçar Boom            | Botão para disparar a transição manualmente (para teste)|
| Preview Ato 1          | Visualizar apenas o estado inicial                     |
| Preview Ato 2          | Visualizar o estado pós-boom sem assistir ao vídeo     |
| Vagas restantes        | Editar número exibido na barra de escassez             |

---

## 6. Copywriting — Princípios Guia

> Este público conhece técnicas de copy. A página precisa **demonstrar** domínio, não apenas **afirmar**.

### O que fazer:
- Frases curtas. Peso em cada palavra.
- Admitir limitações do produto (para quem NÃO é)
- Resultados com números e contexto específico
- Escassez baseada em realidade (vagas reais, não timer de 10min)
- A página em si deve ser a prova de que o copy funciona

### O que evitar:
- Exclamações excessivas
- "Descubra o segredo dos copywriters ricos"
- Timers falsos ou urgência fabricada
- Depoimentos genéricos sem resultado concreto
- Listar 47 bônus — uma oferta clara vale mais

---

## 7. Arquitetura de Arquivos Sugerida

```
/upsell-copy-avancado
│
├── index.html              # Página principal
├── style.css               # Estilos separados (ou inline no HTML)
├── script.js               # Lógica do boom + admin panel
│
├── assets/
│   ├── fonts/              # Fontes locais (se não usar Google Fonts)
│   ├── img/
│   │   ├── depoimentos/    # Fotos dos alunos
│   │   └── icones/         # Ícones das seções
│   └── audio/
│       └── boom.mp3        # Som da transição (opcional)
│
└── PLANEJAMENTO.md         # Este arquivo
```

---

## 8. Checklist Antes do Desenvolvimento

- [ ] Definir nome definitivo do curso e da mentoria
- [ ] Definir preço exato da mentoria
- [ ] Definir timestamp do pitch no vídeo
- [ ] Coletar depoimentos reais com resultados específicos
- [ ] Definir detalhes da mentoria (frequência, formato, duração, vagas)
- [ ] Definir período da garantia
- [ ] Definir número de vagas da turma (para escassez real)
- [ ] Ter o vídeo VSL finalizado e hospedado (Vimeo, Panda Video, YouTube)
- [ ] Confirmar plataforma de pagamento (Hotmart, Kiwify, etc.) para link do CTA

---

## 9. Checklist de QA Antes do Lançamento

- [ ] Testar evento de tempo do player em diferentes browsers
- [ ] Testar boom em mobile (iOS Safari, Android Chrome)
- [ ] Verificar que o Ato 2 está 100% oculto antes do boom (sem flash de conteúdo)
- [ ] Testar painel admin com `?admin=true`
- [ ] Verificar que o player continua tocando durante/após a transição
- [ ] Testar link de pagamento do CTA
- [ ] Validar responsividade em 375px, 768px, 1280px, 1440px
- [ ] Verificar velocidade de carregamento (PageSpeed Insights)

---

## 10. Referências e Decisões Registradas

| Decisão                    | Escolha                          | Motivo                                              |
|----------------------------|----------------------------------|-----------------------------------------------------|
| Paleta                     | Vermelho + Branco + Grafite      | Autoridade, urgência e sofisticação sem ser genérico|
| Tipografia principal        | Bebas Neue                       | Impacto visual nos títulos, caráter forte           |
| Escassez                   | Vagas limitadas (não timer)      | Público de copy identifica timers falsos             |
| Upsell principal           | Mentoria em grupo ao vivo        | Complementa o curso sem competir com ele            |
| Tom de copy                | Direto, sem hipérboles           | Público já conhece técnicas — respeitar isso        |
| Estrutura da página        | Dois atos com evento de virada   | Mantém foco no vídeo e gera impacto no pitch        |

---

*Planejamento elaborado com base em análise estratégica de páginas de upsell de alta conversão, boas práticas de VSL e comportamento de público com conhecimento em marketing digital.*
