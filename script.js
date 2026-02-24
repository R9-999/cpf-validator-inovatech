document.getElementById("cpf").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, '');

  if (value.length > 11) value = value.slice(0, 11);

  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  e.target.value = value;
});

function validarCPF() {
  let cpf = document.getElementById("cpf").value;
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    mostrarResultado(false);
    return;
  }

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++)
    soma += parseInt(cpf.substring(i-1, i)) * (11 - i);

  resto = (soma * 10) % 11;

  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) {
    mostrarResultado(false);
    return;
  }

  soma = 0;
  for (let i = 1; i <= 10; i++)
    soma += parseInt(cpf.substring(i-1, i)) * (12 - i);

  resto = (soma * 10) % 11;

  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) {
    mostrarResultado(false);
    return;
  }

  mostrarResultado(true);
}

function mostrarResultado(valido) {
  const resultado = document.getElementById("resultado");
  const cpf = document.getElementById("cpf").value;

  if (valido) {
    resultado.textContent = "CPF VÁLIDO ✅";
    resultado.style.color = "lightgreen";
  } else {
    resultado.textContent = "CPF INVÁLIDO ❌";
    resultado.style.color = "red";
  }

  salvarNoHistorico(cpf, valido);
}

// Carregar histórico ao abrir a página
document.addEventListener("DOMContentLoaded", carregarHistorico);

function salvarNoHistorico(cpf, valido) {
  let historico = JSON.parse(localStorage.getItem("historicoCPF")) || [];

  historico.push({
    numero: cpf,
    status: valido ? "VÁLIDO" : "INVÁLIDO"
  });

  localStorage.setItem("historicoCPF", JSON.stringify(historico));
  carregarHistorico();
}

function carregarHistorico() {
  let historico = JSON.parse(localStorage.getItem("historicoCPF")) || [];
  let lista = document.getElementById("historico");

  lista.innerHTML = "";

  historico.forEach(item => {
    let li = document.createElement("li");
    li.textContent = `${item.numero} - ${item.status}`;
    lista.appendChild(li);
  });
}

function limparHistorico() {
  localStorage.removeItem("historicoCPF");
  carregarHistorico();
}