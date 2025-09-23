// === Captura elementos do DOM ===
const botoesAdicionar = document.querySelectorAll('.btn-adicionar');
const modalCarrinho   = document.getElementById('modal-carrinho');
const listaCarrinho   = document.getElementById('lista-carrinho');
const totalCarrinhoEl = document.getElementById('total-carrinho');
const btnVerCarrinho  = document.getElementById('btn-ver-carrinho');
const btnFecharCarrinho = document.getElementById('btn-fechar-carrinho');
const btnEnviarWhatsapp = document.getElementById('btn-enviar-whatsapp');
const contadorItens   = document.getElementById('contador-itens');
const btnLimparCarrinho = document.getElementById('btn-limpar-carrinho');

const selectTipoEntrega   = document.getElementById('tipo-entrega');
const selectFormaPagamento = document.getElementById('forma-pagamento');
const inputTroco          = document.getElementById('troco');
const campoEndereco       = document.getElementById('campo-endereco');
const inputEndereco       = document.getElementById('endereco');

const TAXA_ENTREGA = 8.0;
let carrinho = [];

// === Funções ===
function atualizarContador() {
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  if (contadorItens) contadorItens.textContent = totalItens;
}

function calcularSubtotal() {
  return carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
}

function atualizarListaCarrinho() {
  if (!listaCarrinho || !totalCarrinhoEl) return;
  listaCarrinho.innerHTML = '';
  let subtotal = calcularSubtotal();

  carrinho.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.quantidade}x ${item.nome}`;

    const precoItem = item.preco * item.quantidade;
    const spanPreco = document.createElement('span');
    spanPreco.textContent = `R$ ${precoItem.toFixed(2).replace('.', ',')}`;
    li.appendChild(spanPreco);

    // Botão remover
    const btnRemover = document.createElement('button');
    btnRemover.textContent = '✖';
    btnRemover.style.marginLeft = '8px';
    btnRemover.style.cursor = 'pointer';
    btnRemover.addEventListener('click', () => {
      if (item.quantidade > 1) {
        item.quantidade--;
      } else {
        carrinho.splice(index, 1);
      }
      atualizarListaCarrinho();
      atualizarContador();
    });
    li.appendChild(btnRemover);

    listaCarrinho.appendChild(li);
  });

  // taxa de entrega
  let total = subtotal;
  if (selectTipoEntrega && selectTipoEntrega.value === 'Entrega') {
    total += TAXA_ENTREGA;
  }
  totalCarrinhoEl.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}

function adicionarAoCarrinho(nome, preco) {
  const idx = carrinho.findIndex(item => item.nome === nome && item.preco === preco);
  if (idx > -1) {
    carrinho[idx].quantidade++;
  } else {
    carrinho.push({ nome, preco, quantidade: 1 });
  }
  atualizarContador();
  atualizarListaCarrinho();
}

function verificarTipoEntrega() {
  if (campoEndereco && selectTipoEntrega) {
    campoEndereco.style.display =
      selectTipoEntrega.value === 'Entrega' ? 'block' : 'none';
  }
}

// === Eventos ===
if (btnVerCarrinho) {
  btnVerCarrinho.addEventListener('click', () => {
    verificarTipoEntrega(); // <-- garante que o campo de endereço apareça
    atualizarListaCarrinho();
    modalCarrinho.classList.remove('hidden');
  });
}

if (btnFecharCarrinho) {
  btnFecharCarrinho.addEventListener('click', () => {
    modalCarrinho.classList.add('hidden');
  });
}

if (btnLimparCarrinho) {
  btnLimparCarrinho.addEventListener('click', () => {
    carrinho = [];
    atualizarListaCarrinho();
    atualizarContador();
  });
}

if (selectTipoEntrega) {
  selectTipoEntrega.addEventListener('change', () => {
    verificarTipoEntrega();
    atualizarListaCarrinho();
  });
}

if (btnEnviarWhatsapp) {
  btnEnviarWhatsapp.addEventListener('click', () => {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    const tipoEntrega = selectTipoEntrega ? selectTipoEntrega.value : '';
    const formaPagamento = selectFormaPagamento ? selectFormaPagamento.value : '';
    const endereco = (tipoEntrega === 'Entrega' && inputEndereco) ? inputEndereco.value.trim() : '';
    let troco = inputTroco ? inputTroco.value.trim() : '';

    if (!troco || troco === '0' || troco === '0,00' || troco === '0.00') {
      troco = 'Não precisa de troco';
    } else {
      troco = `Precisa de troco para R$ ${troco}`;
    }

    let mensagem = 'Olá, gostaria de fazer o pedido:%0A';
    carrinho.forEach(item => {
      mensagem += `- ${item.quantidade}x ${item.nome}%0A`;
    });

    let total = calcularSubtotal();
    if (tipoEntrega === 'Entrega') total += TAXA_ENTREGA;

    mensagem += `%0ATotal: R$ ${total.toFixed(2).replace('.', ',')}`;
    mensagem += `%0ATipo de Pedido: ${tipoEntrega}`;
    if (tipoEntrega === 'Entrega' && endereco) {
      mensagem += `%0AEndereço: ${encodeURIComponent(endereco)}`;
    }
    mensagem += `%0AForma de Pagamento: ${formaPagamento}`;
    mensagem += `%0A${troco}`;

    const numeroWhatsapp = '5511999999999'; // ajuste para o número da hamburgueria
    const url = `https://wa.me/${numeroWhatsapp}?text=${mensagem}`;
    window.open(url, '_blank');
  });
}

if (botoesAdicionar) {
  botoesAdicionar.forEach(btn => {
    btn.addEventListener('click', () => {
      const nome = btn.getAttribute('data-produto');
      const preco = parseFloat(btn.getAttribute('data-preco'));
      adicionarAoCarrinho(nome, preco);
    });
  });
}

// === Inicialização ===
verificarTipoEntrega();
atualizarContador();
atualizarListaCarrinho();
