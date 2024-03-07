document.addEventListener('DOMContentLoaded', () => {
    emailjs.init({
        publicKey:'yybRw4DPg4xwDoLVN'
    }); // Substitua com seu ID de usuário do EmailJS

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

    document.getElementById('send-email').addEventListener('click', function() {
        let selectedServices = services
        .map((service, index) => { // Mova o uso do index para cá
            const isChecked = service.checkbox ? document.querySelector(`.include-service[data-index="${index}"]`).checked : true;
            const quantity = document.querySelector(`.quantity[data-index="${index}"]`) ? document.querySelector(`.quantity[data-index="${index}"]`).value : 1;
            if (service.mandatory || isChecked || quantity > 0) {
                return `${service.name}: R$${service.price.toFixed(2)}${service.checkbox || !service.mandatory ? '' : ' x ' + quantity}`;
            }
            return '';
        })
        .filter(item => item !== '') // Remove strings vazias
        .join('\n');
      
        let emailParams = {
          email1: document.getElementById('email1').value,
          email2: document.getElementById('email2').value,
          itemList: selectedServices,
          finalPrice: `R$ ${totalPrice.toFixed(2)}`
        };
      
        emailjs.send('service_v2zyea8', 'template_srtp4fs', emailParams)
          .then(function(response) {
             console.log('SUCCESS!', response.status, response.text);
             alert('Orçamento enviado com sucesso!');
          }, function(error) {
             console.log('FAILED...', error);
             alert('Falha ao enviar o orçamento. Por favor, tente novamente.');
        });
    
    });
});