document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o EmailJS com a sua public key
    emailjs.init('yybRw4DPg4xwDoLVN');
  
    // Configuração inicial para abrir o modal
    var modal = document.getElementById("infoModal");
    var btn = document.getElementById("send-email");
    var span = document.getElementsByClassName("close-button")[0];
    
    btn.onclick = function() {
      modal.style.display = "block";
    }
    
    span.onclick = function() {
      modal.style.display = "none";
    }
    
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }

    const services = [
        { name: 'Gestão de Tráfego', price: 600, description: 'Relatório com métricas e criação de estratégias para crescimento da rede social.', quantity: 1, mandatory: true },
        { name: 'Post', price: 200, description: '1 post semanal no feed. Inclui copy e stories espelhado.', quantity: 0, mandatory: false },
        { name: 'Post Carrosel (Até 5 artes)', price: 300, description: '1 post semanal em formato de carrossel com até 5 imagens. Inclui copy e stories espelhado.', quantity: 0, mandatory: false },
        { name: 'Stories', price: 100, description: 'Criação de 1 storie semanal utilizando identidade visual da empresa. Para stories em vídeo captado, adicione Captação ao pacote.', quantity: 0, mandatory: false },
        { name: 'Reels', price: 300, description: 'Criação de post em vídeo no formato reels de até 90 segundos. Inclui Copy e stories espelhado.', quantity: 0, mandatory: false },
        { name: 'Captação', price: 300, description: '1 visita de captação/mês em 1 locação. Horário comercial. Edição básica para redes sociais.', quantity: 0, mandatory: false, checkbox: true },
        { name: 'Demandas Internas', price: 150, description: 'Diária de serviços sortidos de design em volume e tempo hábil compatíveis, definidos pela PigUp Studio. Demandas solicitadas com ao menos 48h de antecedência.', quantity: 0, mandatory: false, checkbox: true }
    ];

    const tableBody = document.querySelector('#services-table tbody');
    let totalPrice = 600; // Inicializa com o preço da Gestão de Tráfego

    // Preenche a tabela com os serviços
    services.forEach((service, index) => {
        const row = tableBody.insertRow();
        row.className = service.mandatory ? 'gestao-trafego' : '';
        const selectionCell = service.mandatory ? 'Incluído' : service.checkbox ? `<input type="checkbox" class="include-service" data-index="${index}" />` : `<input type="number" value="${service.quantity}" min="0" class="quantity" data-index="${index}" />`;

        row.innerHTML = `
            <td>${service.name}</td>
            <td>${service.description}</td>
            <td>R$ ${service.price.toFixed(2)}</td>
            <td>${selectionCell}</td>
        `;
    });

    updateTotalPrice();

    // Adiciona listeners para checkboxes e inputs de quantidade
    document.querySelectorAll('.include-service, .quantity').forEach(element => {
        element.addEventListener('change', updatePrice);
    });

    function updatePrice() {
        totalPrice = services.reduce((acc, service, index) => {
            if (service.mandatory) {
                return acc + service.price;
            } else if (service.checkbox) {
                const isChecked = document.querySelector(`.include-service[data-index="${index}"]`).checked;
                return acc + (isChecked ? service.price : 0);
            } else {
                const quantity = document.querySelector(`.quantity[data-index="${index}"]`).value;
                return acc + (quantity * service.price);
            }
        }, 0);

        updateTotalPrice();
    }

    function updateTotalPrice() {
        document.getElementById('total-price').textContent = `Preço Total: R$ ${totalPrice.toFixed(2)}`;
    }
  
    // Adiciona o ouvinte de evento de submit para o formulário dentro do modal
    document.getElementById('additional-info-form').addEventListener('submit', function(e) {
      e.preventDefault();
      // Coleta os valores do formulário
      var clientName = document.getElementById('name').value;
      var clientEmail = document.getElementById('email').value;
      var company = document.getElementById('company').value;
      var phone = document.getElementById('phone').value;
  
      // Prepara os serviços selecionados e a mensagem
    let selectedServices = services
        .map((service, index) => {
            // Verifica se a checkbox está marcada ou se é um serviço obrigatório.
            const isChecked = service.checkbox ? document.querySelector(`.include-service[data-index="${index}"]`).checked : false;
            const quantityInput = document.querySelector(`.quantity[data-index="${index}"]`);
            let quantity = 0;
            
            if (service.mandatory) {
                quantity = 1; // Serviços obrigatórios contam como 1
            } else if (isChecked) {
                quantity = 1; // Checkbox marcada conta como 1
            } else if (quantityInput) {
                quantity = parseInt(quantityInput.value, 10); // Pega a quantidade do input se disponível
            }
            
            if (quantity > 0) {
                return `${service.name} (Quantidade: ${quantity}): R$${(service.price * quantity).toFixed(2)}`;
            }
            return '';
        })
        .filter(item => item !== '')
        .join('\n');

    let totalPrice = services.reduce((acc, service, index) => {
        let quantity = 0;
        if (service.mandatory) {
            quantity = 1;
        } else if (service.checkbox && document.querySelector(`.include-service[data-index="${index}"]`).checked) {
            quantity = 1;
        } else if (document.querySelector(`.quantity[data-index="${index}"]`)) {
            quantity = parseInt(document.querySelector(`.quantity[data-index="${index}"]`).value, 10);
        }
        return acc + (quantity * service.price);
    }, 0);
  
      // Objeto com os parâmetros para enviar no e-mail
      let emailParams = {
        to_email1: document.getElementById('email1').value,
        to_email2: document.getElementById('email2').value,
        client_name: clientName,
        client_email: clientEmail,
        company: company,
        phone: phone,
        itemList: selectedServices,
        finalPrice: `R$ ${totalPrice.toFixed(2)}`
      };
  
      // Envia o e-mail usando EmailJS
      emailjs.send('service_v2zyea8', 'template_srtp4fs', emailParams)
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
          alert('Orçamento enviado com sucesso!');
          modal.style.display = "none"; // Fecha o modal após o envio
        }, function(error) {
          console.log('FAILED...', error);
          alert('Falha ao enviar o orçamento. Por favor, tente novamente.');
      });
    });
  });