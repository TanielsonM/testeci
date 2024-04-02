((e, t) => {
  e._wf ||
  (
    (e._wf = { id: null, productGreennId: null, token: null }),
    (e._wf.loadData = () =>
      new Promise((t) => {
        let url = `${e._wf.url}/api/product/${e._wf.productGreennId}`;
        // let url = `https://victorapi.innovaweb.com.br/api/product/${e._wf.productGreennId}`;
        if (e._wf.hash_oferta) {
          url = url + `/offer/${e._wf.hash_oferta}`;
        }

        fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then(function (response) {
          return response.json();
        })
        .then((response) => {
          e._wf.dataProduct = response;
          e._wf.currencySymbol =
            response && response.checkout_payment
              ? response.checkout_payment.symbol_base_currency
              : "R$";
          t(1);
        })
        .catch((e) => {
          t(!1), console.error(e);
        });
      })
    ),
    (e._wf.loadTaxa = () =>
      new Promise((t) => {
        let url = `${e._wf.url}/api/global-settings?keys=MONTHLY_INTEREST`;

        fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .catch((e) => {
          t(!1), console.error(e);
        });
      })
    ),
    (e._wf.loadTaxa = () =>
      new Promise((t) => {
        let url = `${e._wf.url}/api/global-settings?keys=MONTHLY_INTEREST`;

        fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then(function (response) {
          return response.json();
        })
        .then((response) => {
          e._wf.taxa = parseFloat(response[0].value);
          t(1);
        })
        .catch((e) => {
          t(!1), console.error(e);
        });
      })
    ),
    (e._wf.loadConfigBtn = (upsell_id) =>
      new Promise((t) => {
        let url = `${e._wf.url}/api/upsell/${
          upsell_id || e._wf.upsellGreennId
        }/metas`;

        fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then(function (response) {
          return response.json();
        })
        .then(async (response) => {
          e._wf.productGreennId = response.product_id;
          e._wf.configsBtn = response.metas;
          var configs = e._wf.configsBtn;
          for (var indice in configs) {
            let config = configs[indice];
            if (config.upsell_key === "link_obrigado") {
              if (config.upsell_value) {
                e._wf.linkObrigado = config.upsell_value;
              }
              document.getElementById("confirm").innerHTML =
                config.upsell_value;
            }
            if (config.upsell_key === "com_oferta") {
              if (config.upsell_value) {
                e._wf.com_oferta = config.upsell_value;
              }
            }
            if (config.upsell_key === "hash_oferta") {
              if (config.upsell_value) {
                e._wf.hash_oferta = config.upsell_value;
              }
            }
            if (config.upsell_key === "link_not_buy") {
              if (config.upsell_value) {
                e._wf.linkNotBuy = config.upsell_value;
              }
            }
          }
          if (!(await e._wf.loadData())) throw "Failed to load data";
          t(1);
        })
        .catch((e) => {
          t(!1), console.error(e);
        });
      })
    ),
    (e._wf.loadDataLast = () =>
      new Promise((t) => {
        let url = `${e._wf.url}/api/upsell/${e._wf.token}`;
        // let url = `https://victorapi.innovaweb.com.br/api/upsell/${e._wf.token}`;

        fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then(function (response) {
          if (response.status === 200) {
            e._wf.tokenIsValid = true;
          }
          return response.json();
        })
        .then((response) => {
          e._wf.userLast = response;
          e._wf.methodLast = response.method;
          var creditCard = `
            <div class="credit-card">
                <div class="custom-input">
                    <svg class="icon" width="31" height="22" viewBox="0 0 31 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect opacity="0.3" x="0.110962" y="0.840088" width="30" height="21" rx="2" fill="#8C8A97"/>
                        <rect x="0.110962" y="5.34009" width="30" height="4.5" fill="#8C8A97"/>
                        <rect opacity="0.3" x="21.111" y="14.3401" width="6" height="3" rx="1" fill="#8C8A97"/>
                    </svg>
                    <input value="**** **** **** ${response.last_digits}  |  Validade ${response.expiration_date}"/>
                    <svg class="icon-ok" width="25" height="25" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.9873 0.840088C3.85185 0.840088 0.487305 4.20463 0.487305 8.34009C0.487305 12.4755 3.85185 15.8401 7.9873 15.8401C12.1228 15.8401 15.4873 12.4755 15.4873 8.34009C15.4873 4.20463 12.1228 0.840088 7.9873 0.840088ZM11.8905 5.82651L7.0444 11.5957C6.99124 11.6591 6.92509 11.7102 6.85044 11.7457C6.77578 11.7813 6.69437 11.8003 6.6117 11.8016H6.60197C6.5211 11.8016 6.44115 11.7846 6.36729 11.7516C6.29343 11.7187 6.22732 11.6706 6.17324 11.6105L4.09632 9.30283C4.04357 9.24688 4.00254 9.18096 3.97564 9.10893C3.94873 9.0369 3.9365 8.96022 3.93965 8.8834C3.9428 8.80657 3.96128 8.73115 3.994 8.66157C4.02672 8.59199 4.07301 8.52965 4.13017 8.47822C4.18732 8.42678 4.25418 8.38729 4.32681 8.36207C4.39945 8.33684 4.47639 8.32639 4.55312 8.33132C4.62985 8.33626 4.70482 8.35648 4.77363 8.39081C4.84243 8.42513 4.90368 8.47286 4.95377 8.53119L6.58682 10.3456L11.0071 5.08444C11.1063 4.9698 11.2466 4.89879 11.3977 4.88675C11.5487 4.87471 11.6985 4.92261 11.8146 5.0201C11.9306 5.11759 12.0036 5.25683 12.0179 5.40772C12.0321 5.55862 11.9864 5.70905 11.8905 5.82651Z" fill="#03B37F"/>
                    </svg>
                </div>
                <select name="installments" id="installments">
                </select>
            </div>
            <div class="check-itens">
                <label class="space-confirm">Entendo que será gerado um novo pagamento para compra deste produto
                    <input id="checkbox-payment" type="checkbox" checked>
                    <span class="checkmark"></span>
                </label>
            </div>
            `;

          var boleto = `
                <div class="boleto">
                    <div class="custom-input">
                        <svg class="icon" width="29" height="22" viewBox="0 0 29 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5708 0.840088H18.3708V21.8401H15.5708V0.840088ZM4.37078 0.840088V21.8401H1.57078C0.797578 21.8401 0.170776 21.2133 0.170776 20.4401V2.24009C0.170776 1.46689 0.797578 0.840088 1.57078 0.840088H4.37078ZM19.7708 0.840088H22.5708V21.8401H19.7708V0.840088ZM25.3708 0.840088H26.7708C27.544 0.840088 28.1708 1.46689 28.1708 2.24009V20.4401C28.1708 21.2133 27.544 21.8401 26.7708 21.8401H25.3708V0.840088Z" fill="#8C8A97"/>
                            <path opacity="0.3" fill-rule="evenodd" clip-rule="evenodd" d="M9.97078 0.840088V21.8401H7.17078V0.840088H9.97078Z" fill="#8C8A97"/>
                        </svg>
                        <input value="Realizar pagamento com Boleto"/>
                        <svg class="icon-ok" width="25" height="25" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.9873 0.840088C3.85185 0.840088 0.487305 4.20463 0.487305 8.34009C0.487305 12.4755 3.85185 15.8401 7.9873 15.8401C12.1228 15.8401 15.4873 12.4755 15.4873 8.34009C15.4873 4.20463 12.1228 0.840088 7.9873 0.840088ZM11.8905 5.82651L7.0444 11.5957C6.99124 11.6591 6.92509 11.7102 6.85044 11.7457C6.77578 11.7813 6.69437 11.8003 6.6117 11.8016H6.60197C6.5211 11.8016 6.44115 11.7846 6.36729 11.7516C6.29343 11.7187 6.22732 11.6706 6.17324 11.6105L4.09632 9.30283C4.04357 9.24688 4.00254 9.18096 3.97564 9.10893C3.94873 9.0369 3.9365 8.96022 3.93965 8.8834C3.9428 8.80657 3.96128 8.73115 3.994 8.66157C4.02672 8.59199 4.07301 8.52965 4.13017 8.47822C4.18732 8.42678 4.25418 8.38729 4.32681 8.36207C4.39945 8.33684 4.47639 8.32639 4.55312 8.33132C4.62985 8.33626 4.70482 8.35648 4.77363 8.39081C4.84243 8.42513 4.90368 8.47286 4.95377 8.53119L6.58682 10.3456L11.0071 5.08444C11.1063 4.9698 11.2466 4.89879 11.3977 4.88675C11.5487 4.87471 11.6985 4.92261 11.8146 5.0201C11.9306 5.11759 12.0036 5.25683 12.0179 5.40772C12.0321 5.55862 11.9864 5.70905 11.8905 5.82651Z" fill="#03B37F"/>
                        </svg>
                    </div>
                </div>
                <div class="check-itens">
                    <label class="space-confirm">Entendo que será gerado um novo boleto para compra deste produto
                        <input id="checkbox-payment" type="checkbox" checked>
                        <span class="checkmark"></span>
                    </label>
                </div>
            `;

          var pix = `
            <div class="pix">
                <div class="custom-input">
                    <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.3" fill-rule="evenodd" clip-rule="evenodd" d="M1.18006 11.2795C0.594276 11.8653 0.594276 12.8151 1.18006 13.4009L4.12182 16.3426C4.70761 16.9284 5.65736 16.9284 6.24314 16.3426L9.18491 13.4009C9.77069 12.8151 9.77069 11.8653 9.18491 11.2795L6.24314 8.33778C5.65736 7.75199 4.70761 7.75199 4.12182 8.33778L1.18006 11.2795ZM15.5005 11.2795C14.9147 11.8653 14.9147 12.8151 15.5005 13.4009L18.4423 16.3426C19.0281 16.9284 19.9778 16.9284 20.5636 16.3426L23.5054 13.4009C24.0911 12.8151 24.0911 11.8653 23.5054 11.2795L20.5636 8.33778C19.9778 7.75199 19.0281 7.75199 18.4423 8.33778L15.5005 11.2795Z" fill="#8C8A97"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.33997 4.11914C7.75419 4.70493 7.75419 5.65467 8.33997 6.24046L11.2817 9.18222C11.8675 9.76801 12.8173 9.76801 13.4031 9.18222L16.3448 6.24046C16.9306 5.65467 16.9306 4.70493 16.3448 4.11914L13.4031 1.17738C12.8173 0.59159 11.8675 0.591591 11.2817 1.17738L8.33997 4.11914ZM8.33997 18.4397C7.75419 19.0255 7.75419 19.9753 8.33997 20.5611L11.2817 23.5028C11.8675 24.0886 12.8173 24.0886 13.4031 23.5028L16.3448 20.5611C16.9306 19.9753 16.9306 19.0255 16.3448 18.4397L13.4031 15.498C12.8173 14.9122 11.8675 14.9122 11.2817 15.498L8.33997 18.4397Z" fill="#8C8A97"/>
                    </svg>
                    <input value="Realizar pagamento com PIX"/>
                    <svg class="icon-ok" width="25" height="25" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.9873 0.840088C3.85185 0.840088 0.487305 4.20463 0.487305 8.34009C0.487305 12.4755 3.85185 15.8401 7.9873 15.8401C12.1228 15.8401 15.4873 12.4755 15.4873 8.34009C15.4873 4.20463 12.1228 0.840088 7.9873 0.840088ZM11.8905 5.82651L7.0444 11.5957C6.99124 11.6591 6.92509 11.7102 6.85044 11.7457C6.77578 11.7813 6.69437 11.8003 6.6117 11.8016H6.60197C6.5211 11.8016 6.44115 11.7846 6.36729 11.7516C6.29343 11.7187 6.22732 11.6706 6.17324 11.6105L4.09632 9.30283C4.04357 9.24688 4.00254 9.18096 3.97564 9.10893C3.94873 9.0369 3.9365 8.96022 3.93965 8.8834C3.9428 8.80657 3.96128 8.73115 3.994 8.66157C4.02672 8.59199 4.07301 8.52965 4.13017 8.47822C4.18732 8.42678 4.25418 8.38729 4.32681 8.36207C4.39945 8.33684 4.47639 8.32639 4.55312 8.33132C4.62985 8.33626 4.70482 8.35648 4.77363 8.39081C4.84243 8.42513 4.90368 8.47286 4.95377 8.53119L6.58682 10.3456L11.0071 5.08444C11.1063 4.9698 11.2466 4.89879 11.3977 4.88675C11.5487 4.87471 11.6985 4.92261 11.8146 5.0201C11.9306 5.11759 12.0036 5.25683 12.0179 5.40772C12.0321 5.55862 11.9864 5.70905 11.8905 5.82651Z" fill="#03B37F"/>
                    </svg>
                </div>
            </div>
            <div class="check-itens">
                <label class="space-confirm">Entendo que será gerado uma nova compra para este produto
                    <input id="checkbox-payment" type="checkbox" checked>
                    <span class="checkmark"></span>
                </label>
            </div>
            `;

          var paypal = `
            <div class="pix">
                <div class="custom-input">
                    <svg class="icon" width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.64165 12.1364C4.49581 12.9239 3.91665 16.5948 3.74581 17.6325C3.73331 17.7064 3.70415 17.7351 3.62081 17.7351H0.512479C0.195813 17.7351 -0.0333541 17.4644 0.00831255 17.165L2.44998 1.91124C2.51248 1.51749 2.87081 1.21808 3.28331 1.21808C9.62915 1.21808 10.1625 1.06632 11.7833 1.68565C14.2875 2.64132 14.5166 4.9464 13.6166 7.44015C12.7208 10.0077 10.5958 11.111 7.77915 11.1439C5.97081 11.1726 4.88331 10.8567 4.64165 12.1364V12.1364ZM14.8791 6.23429C14.8041 6.18097 14.775 6.16046 14.7541 6.28761C14.6708 6.75518 14.5416 7.21046 14.3875 7.66573C12.725 12.3333 8.11665 11.9273 5.86665 11.9273C5.61248 11.9273 5.44581 12.0626 5.41248 12.3128C4.47081 18.0714 4.28331 19.2732 4.28331 19.2732C4.24165 19.5644 4.42915 19.8023 4.72498 19.8023H7.37081C7.72915 19.8023 8.02498 19.5439 8.09581 19.1911C8.12498 18.9696 8.04998 19.4413 8.69581 15.4464C8.88748 14.5441 9.29165 14.6384 9.91665 14.6384C12.875 14.6384 15.1833 13.4571 15.8708 10.0323C16.1416 8.60499 16.0625 7.10382 14.8791 6.23429V6.23429Z" fill="#8C8A97"/>
                    </svg>
                    <input value="Realizar pagamento com Paypal"/>
                    <svg class="icon-ok" width="25" height="25" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.9873 0.840088C3.85185 0.840088 0.487305 4.20463 0.487305 8.34009C0.487305 12.4755 3.85185 15.8401 7.9873 15.8401C12.1228 15.8401 15.4873 12.4755 15.4873 8.34009C15.4873 4.20463 12.1228 0.840088 7.9873 0.840088ZM11.8905 5.82651L7.0444 11.5957C6.99124 11.6591 6.92509 11.7102 6.85044 11.7457C6.77578 11.7813 6.69437 11.8003 6.6117 11.8016H6.60197C6.5211 11.8016 6.44115 11.7846 6.36729 11.7516C6.29343 11.7187 6.22732 11.6706 6.17324 11.6105L4.09632 9.30283C4.04357 9.24688 4.00254 9.18096 3.97564 9.10893C3.94873 9.0369 3.9365 8.96022 3.93965 8.8834C3.9428 8.80657 3.96128 8.73115 3.994 8.66157C4.02672 8.59199 4.07301 8.52965 4.13017 8.47822C4.18732 8.42678 4.25418 8.38729 4.32681 8.36207C4.39945 8.33684 4.47639 8.32639 4.55312 8.33132C4.62985 8.33626 4.70482 8.35648 4.77363 8.39081C4.84243 8.42513 4.90368 8.47286 4.95377 8.53119L6.58682 10.3456L11.0071 5.08444C11.1063 4.9698 11.2466 4.89879 11.3977 4.88675C11.5487 4.87471 11.6985 4.92261 11.8146 5.0201C11.9306 5.11759 12.0036 5.25683 12.0179 5.40772C12.0321 5.55862 11.9864 5.70905 11.8905 5.82651Z" fill="#03B37F"/>
                    </svg>
                </div>
            </div>
            <div class="check-itens">
                <label class="space-confirm">Entendo que será gerado uma nova compra para este produto
                    <input id="checkbox-payment" type="checkbox" checked>
                    <span class="checkmark"></span>
                </label>
            </div>
            `;

          if (
            response.method === "CREDIT_CARD" ||
            response.method === "TWO_CREDIT_CARDS"
          ) {
            document.querySelector("#type-payment").innerHTML = creditCard;
            var select = document.getElementById("installments");

            let pv = e._wf.dataProduct.data.amount;
            let max_installment = 0;
            if (e._wf.dataProduct.data.type === "SUBSCRIPTION") {
              max_installment = parseInt(
                e._wf.dataProduct.data.max_subscription_installments
              );
            } else {
              max_installment = parseInt(
                e._wf.dataProduct.data.max_installments
              );
            }
            let i = e._wf.taxa / 100;
            for (var x = 1; x <= max_installment; x++) {
              let pmt =
                pv / ((Math.pow(1 + i, x) - 1) / (Math.pow(1 + i, x) * i));
              let option = document.createElement("option");
              if (x === 1) {
                option.text =
                  x + "x de R$ " + parseFloat(pv).toFixed(2) + " *";
                option.value = x;
                select.appendChild(option);
              } else {
                option.text = x + "x de R$ " + Number(pmt).toFixed(2) +" *";
                option.value = x;
                select.appendChild(option);
              }
            }
          } else if (response.method === "BOLETO") {
            document.querySelector("#type-payment").innerHTML = boleto;
          } else if (response.method === "PIX") {
            document.querySelector("#type-payment").innerHTML = pix;
          } else if (response.method === "PAYPAL") {
            document.querySelector("#type-payment").innerHTML = paypal;
          }
          t(1);
        })
        .catch((e) => {
          console.error(e);
          t(!1);
        });
      })
    ),
    (e._wf.payment = () =>
      new Promise((t) => {
        document.querySelector(".greenn-btn-comprar").innerHTML =
          "Processando...";
        document.querySelector(".greenn-btn-comprar").disabled = true;
        var upsells = document.querySelectorAll("[data-greenn-upsell]") || [];
        upsells.forEach(function (upsell, index) {
          upsell.disabled = true;
        });

        if (e._wf.tokenIsValid !== true) {
          const oferta =
            e._wf.com_oferta && e._wf.hash_oferta
              ? `/offer/${e._wf.hash_oferta}`
              : "";
          if (e._wf.isSafari) {
            window.location.href = `${e._wf.url2}/${e._wf.productGreennId}${oferta}?up_id=${e._wf.upsellGreennId}`;
          } else {
            window.open(
              `${e._wf.url2}/${e._wf.productGreennId}${oferta}`,
              "_blank"
            );
          }
          document.querySelector(".greenn-btn-comprar").innerHTML =
            "Efetuar Compra";
          document.querySelector(".greenn-btn-comprar").disabled = false;
          var upsells = document.querySelectorAll("[data-greenn-upsell]") || [];
          upsells.forEach(function (upsell, index) {
            upsell.disabled = false;
          });
          return;
        }

        if (document.querySelector("#checkbox-payment")) {
          if (
            (document.querySelector("#checkbox-payment:checked") !== null) ===
            false
          ) {
            document.querySelector(".greenn-btn-comprar").innerHTML =
              "Efetuar Compra";
            document.querySelector(".greenn-btn-comprar").disabled = false;
            var upsells =
              document.querySelectorAll("[data-greenn-upsell]") || [];
            upsells.forEach(function (upsell, index) {
              upsell.disabled = false;
            });
            return;
          }
        }

        if (e._wf.userLast.method === "PAYPAL") {
          if (e._wf.isSafari) {
            window.location.href = `${e._wf.url2}/${e._wf.productGreennId}?fn=${e._wf.userLast.name}&em=${e._wf.userLast.email}&ph=${e._wf.userLast.cellphone}&document=${e._wf.userLast.cpf_cnpj}&up_id=${e._wf.upsellGreennId}`;
          } else {
            window.open(
              `${e._wf.url2}/${e._wf.productGreennId}?fn=${e._wf.userLast.name}&em=${e._wf.userLast.email}&ph=${e._wf.userLast.cellphone}&document=${e._wf.userLast.cpf_cnpj}&up_id=${e._wf.upsellGreennId}`,
              "_blank"
            );
          }
          document.querySelector(".greenn-btn-comprar").innerHTML =
            "Efetuar Compra";
          document.querySelector(".greenn-btn-comprar").disabled = false;
          var upsells = document.querySelectorAll("[data-greenn-upsell]") || [];
          upsells.forEach(function (upsell, index) {
            upsell.disabled = false;
          });
          return;
        }

        if (
          e._wf.dataProduct.data.type === "SUBSCRIPTION" &&
          e._wf.userLast.method !== "CREDIT_CARD" &&
          e._wf.userLast.method !== "TWO_CREDIT_CARDS" &&
          e._wf.userLast.method !== "BOLETO"
        ) {
          const withOffer =
            e._wf.com_oferta && e._wf.hash_oferta
              ? `/offer/${e._wf.hash_oferta}`
              : "";
          if (e._wf.isSafari) {
            window.location.href = `${e._wf.url2}/${e._wf.productGreennId}${withOffer}?fn=${e._wf.userLast.name}&em=${e._wf.userLast.email}&ph=${e._wf.userLast.cellphone}&document=${e._wf.userLast.cpf_cnpj}&up_id=${e._wf.upsellGreennId}`;
          } else {
            window.open(
              `${e._wf.url2}/${e._wf.productGreennId}${withOffer}?fn=${e._wf.userLast.name}&em=${e._wf.userLast.email}&ph=${e._wf.userLast.cellphone}&document=${e._wf.userLast.cpf_cnpj}&up_id=${e._wf.upsellGreennId}`,
              "_blank"
            );
          }
          document.querySelector(".greenn-btn-comprar").innerHTML =
            "Efetuar Compra";
          document.querySelector(".greenn-btn-comprar").disabled = false;
          var upsells = document.querySelectorAll("[data-greenn-upsell]") || [];
          var upsells = document.querySelectorAll("[data-greenn-upsell]") || [];
          upsells.forEach(function (upsell, index) {
            upsell.disabled = false;
          });
          return;
        }

        if (e._wf.tokenIsValid && e._wf.productGreennId) {
          let url = `${e._wf.url}/api/upsell`;
          // let url = 'https://victorapi.innovaweb.com.br/api/upsell';

          var payload = {
            product_id: e._wf.productGreennId,
            upsell_id: e._wf.upsellGreennId,
            token: e._wf.token,
            installments: 1,
            method: e._wf.methodLast,
            hash_offer: e._wf.configsBtn.filter(
              (meta) => meta.upsell_key === "hash_oferta"
            )[0]?.upsell_value,
          };
          if (
            e._wf.userLast.method === "CREDIT_CARD" ||
            e._wf.userLast.method === "TWO_CREDIT_CARDS"
          ) {
            payload = {
              product_id: e._wf.productGreennId,
              upsell_id: e._wf.upsellGreennId,
              token: e._wf.token,
              method: e._wf.methodLast,
              installments: parseInt(
                document.getElementById("installments").value,
                10
              ),
              hash_offer: e._wf.configsBtn.filter(
                (meta) => meta.upsell_key === "hash_oferta"
              )[0]?.upsell_value,
            };
          }

          fetch(url, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
          .then(function (response) {
            return response.json();
          })
          .then((response) => {
            document.querySelector(".greenn-btn-comprar").innerHTML =
              "Efetuar Compra";
            document.querySelector(".greenn-btn-comprar").disabled = false;
            var upsells =
              document.querySelectorAll("[data-greenn-upsell]") || [];
            upsells.forEach(function (upsell, index) {
              upsell.disabled = false;
            });
            if (!response.sales[0].success) {
              var error_html = "";
              var error_message = "";
              switch (response.sales[0].code) {
                case "0001":
                  error_message = "Este cupom que está utilizando não é mais válido.";
                  break;
                case "BANK":
                  error_message = "Algo deu errado com sua compra, por favor, entre em contato com o banco ou emissor do seu cartão.";
                  break;
                case "BLACKLIST_PURCHASE":
                  error_message = `Após inúmeras tentativas de pagamento o banco retornou que seu cartão foi bloqueado, entre em contato com sua operadora de cartão solicitando o desbloqueio e caso já tenha feito, nos avise em <a href="https://greenn.com.br" target="_blank">greenn.com.br</a> para liberarmos aqui.`;
                  break;
                case "INVALID_CVV":
                  error_message = "Código de segurança do cartão inválido, verifique e tente novamente";
                  break;
                case "INVALID_CLIENT_DATA":
                  error_message = "Dados do cliente consta incorretos, verifique e tente novamente";
                  break;
                case "DUPLICATE_PURCHASE":
                  error_message = "Você já efetuou uma compra deste produto";
                  break;
                case "PRODUCT_OUT_OF_STOCK":
                  error_message = "Produto sem estoque. Não foi possível efetivar a compra.";
                  break;
                case "CREDIT_CARD_OPERATOR":
                  error_message = "Algo deu errado com sua compra, por favor, entre em contato com a operadora do seu cartão.";
                  break;
                case "INVALID_DATA":
                  error_message = "Os dados do seu cartão foram inseridos incorretamente, verifique e tente novamente.";
                  break;
                case "INVALID_CREDIT_CARD":
                  error_message = "O cartão usado está desabilitado, bloqueado ou está vencido, entre em contato com o banco ou emissor do cartão.";
                  break;
                case "INSUFFICIENT_FUNDS":
                  error_message = "Não há limite suficiente, Tente com outro cartão ou método de pagamento.";
                  break;
                case "INVALID_PAYMENT_TYPE":
                  error_message = "Método de pagamento inválido, tente com outro cartão ou método de pagamento.";
                  break;
                case "INVALID_INSTALLMENTS":
                  error_message = "Número ou valor das parcelas não foi autorizado, tente com outro cartão ou método de pagamento.";
                  break;
                case "CURRENCY_NOT_SUPPORTED":
                  error_message = "Moeda não suportada.";
                  break;
                case "SUSPECTED_FRAUD":
                  error_message = "Transação não permitida - Entre em contato com o banco ou tente outra forma de pagamento";
                  break;
                case "GENERIC":
                  error_message = "Ocorreu um erro durante o processamento da compra, verifique os dados e tente novamente, em caso de falhas, faça contato conosco para maiores orientações.";
                  break;
                default:
                  error_message = "Ocorreu um erro durante o processamento da compra, verifique os dados e tente novamente, em caso de falhas, faça contato conosco para maiores orientações.";
                  break;
              }
              error_html = `
                  <div class="check-itens">
                      <label class="space-confirm">${error_message}
                      </label>
                  </div>
                  `;

              document.querySelector("#type-payment").innerHTML = error_html;
              document
                .querySelectorAll(".greenn-btn-comprar")
                .forEach((el) => el.setAttribute("disabled", true));
              return;
            }
            if (response.sales[0].success) {
              document
                .getElementById("greenn-upsell-div")
                .classList.remove("ativo");
              if (
                e._wf.userLast.method === "BOLETO" ||
                e._wf.userLast.method === "PIX" ||
                e._wf.userLast.method === "CREDIT_CARD" ||
                e._wf.userLast.method === "TWO_CREDIT_CARDS"
              ) {
                const getThanksLink = () => {
                  let thanksLink = "";

                  if (!e._wf.token) {
                    thanksLink = `${e._wf.url2}/${e._wf.productGreennId}/obrigado?s_id=${response.sales[0].sale_id}&up_id=${e._wf.upsellGreennId}`;
                  } else {
                    thanksLink = `${e._wf.url2}/${e._wf.productGreennId}/obrigado?s_id=${response.sales[0].sale_id}&up_id=${e._wf.upsellGreennId}&token=${e._wf.token}`;
                  }
                  return thanksLink;
                };
                const sendToThanksLink = (thanksLink) => {
                  if (e._wf.isSafari) {
                    window.location.href = thanksLink;
                  } else {
                    window.open(thanksLink, "_blank");
                  }
                };
                sendToThanksLink(getThanksLink());
              }
              return;
            }
          })
          .catch((r) => {
            //erro na compra do upsell, verifica se tem offerta e adiciona ela na rota, para não cair na oferta padrão
            var hashOffer = e._wf.hash_oferta
              ? `/offer/${e._wf.hash_oferta}/`
              : "";

            if (e._wf.tokenIsValid) {
              window.open(
                `${e._wf.url2}/${e._wf.productGreennId}${hashOffer}?fn=${e._wf.userLast.name}&em=${e._wf.userLast.email}&ph=${e._wf.userLast.cellphone}&document=${e._wf.userLast.cpf_cnpj}&up_id=${e._wf.upsellGreennId}`,
                "_blank"
              );
            } else {
              window.open(
                `${e._wf.url2}/${e._wf.productGreennId}${hashOffer}?up_id=${e._wf.upsellGreennId}`,
                "_blank"
              );
            }
            if (e._wf.tokenIsValid) {
              if (e._wf.isSafari) {
                window.location.href = `${e._wf.url2}/${e._wf.productGreennId}${hashOffer}?fn=${e._wf.userLast.name}&em=${e._wf.userLast.email}&ph=${e._wf.userLast.cellphone}&document=${e._wf.userLast.cpf_cnpj}&up_id=${e._wf.upsellGreennId}`;
              } else {
                window.open(
                  `${e._wf.url2}/${e._wf.productGreennId}${hashOffer}?fn=${e._wf.userLast.name}&em=${e._wf.userLast.email}&ph=${e._wf.userLast.cellphone}&document=${e._wf.userLast.cpf_cnpj}&up_id=${e._wf.upsellGreennId}`,
                  "_blank"
                );
              }
            } else {
              if (e._wf.isSafari) {
                window.location.href = `${e._wf.url2}/${e._wf.productGreennId}${hashOffer}?up_id=${e._wf.upsellGreennId}`;
              } else {
                window.open(
                  `${e._wf.url2}/${e._wf.productGreennId}${hashOffer}?up_id=${e._wf.upsellGreennId}`,
                  "_blank"
                );
              }
            }
            return;
          });
        }
      })
    ),
    (e._wf.newPayment = (tt) =>
      new Promise((t) => {
        var hashOffer = e._wf.hash_oferta ? `/offer/${e._wf.hash_oferta}/` : "";

        if (e._wf.tokenIsValid) {
          if (e._wf.isSafari) {
            let anchor = document.createElement("a");
            anchor.href = `${e._wf.url2}/${e._wf.productGreennId}${hashOffer}?fn=${e._wf.userLast.name}&em=${e._wf.userLast.email}&ph=${e._wf.userLast.cellphone}&document=${e._wf.userLast.cpf_cnpj}&up_id=${e._wf.upsellGreennId}`;
            anchor.target = "_blank";
            anchor.click();
          } else {
            window.open(
              `${e._wf.url2}/${e._wf.productGreennId}${hashOffer}?fn=${e._wf.userLast.name}&em=${e._wf.userLast.email}&ph=${e._wf.userLast.cellphone}&document=${e._wf.userLast.cpf_cnpj}&up_id=${e._wf.upsellGreennId}`,
              "_blank"
            );
          }
        } else {
          if (e._wf.isSafari) {
            let anchor = document.createElement("a");
            anchor.href = `${e._wf.url2}/${e._wf.productGreennId}${hashOffer}`;
            anchor.target = "_blank";
            anchor.click();
          } else {
            window.open(
              `${e._wf.url2}/${e._wf.productGreennId}${hashOffer}`,
              "_blank"
            );
          }
        }
      })
    ),
    (e._wf.notBuy = () =>
      new Promise((t) => {
        let link_not_buy = e._wf.linkNotBuy.replace("undefined", "");
        if (e._wf.token) {
          window.location.href = `${link_not_buy}?token=${e._wf.token}`;
        } else {
          window.location.href = `${link_not_buy}`;
        }
        // if (e._wf.tokenIsValid && e._wf.linkNotBuy) {
        //   window.location.href = `${e._wf.linkNotBuy}?fn=${e._wf.userLast.name}&em=${e._wf.userLast.email}&ph=${e._wf.userLast.cellphone}&document=${e._wf.userLast.cpf_cnpj}`;
        // } else {

        // }
      })
    ),
    (e._wf.openModal = () =>
      new Promise((t) => {
        document.getElementById("greenn-upsell-div").classList.toggle("ativo");
        document
          .querySelectorAll(".greenn-btn-comprar")
          .forEach((el) => el.removeAttribute("disabled"));
      })
    ),
    (e._wf.injectBaseHtml = () =>
      new Promise((t) => {
        var css = "";
        css = '@import url(https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap);[hidden]{display:none!important}[disabled]{opacity:.75!important}*{box-sizing:border-box}a{text-decoration:none}img{max-width:100%;display:block}body{font-family:Montserrat,sans-serif}.greenn-modal{position:fixed;top:0;left:0;width:0;height:0;display:none;width:auto}.greenn-modal.ativo{background:rgba(0,0,0,.6);width:100vw;height:100vh;display:block!important;z-index:999999999}.greenn-item-modal{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;border-radius:.3rem;min-width:640px;padding:30px}.greenn-item-modal-titulo{width:100%;margin-bottom:0;line-height:1.5;padding:1rem;margin-top:0;font-family:Montserrat;font-style:normal;font-weight:600;font-size:24px;color:#333}.greenn-item-modal-titulo:after{content:"";width:1rem;height:1rem;background:#00e4a0;position:absolute;left:40px;border-radius:.2rem;z-index:-1;top:58px}.greenn-fechar-modal{float:right;font-size:1.5rem;font-weight:700;line-height:1;color:#333;position:relative;left:-20px;top:-45px;cursor:pointer}.greenn-item-modal-parcelas{padding:40px 20px;display:flex;align-items:center;justify-content:space-around}.greenn-item-img{max-width:33%;display:inline-block;max-height:150px;text-align:center}.greenn-item-img img{width:100%;max-width:155px;border-radius:3px}.greenn-item-parcelas{max-width:67%;display:inline-block;padding-right:15px;padding-left:15px}.greenn-nome-produto{font-size:20px;margin-bottom:.5rem;font-weight:600;line-height:1.2;margin-top:0;color:#333;text-align:center}.greenn-parcelas{width:100%;text-align:center}.greenn-parcelas-input{display:block;width:100%;height:50px;padding:.375rem .75rem;font-size:13px;font-weight:400;line-height:1.5;color:#333;border:1px solid #e5e5e5;border-radius:5px;transition:border-color .15s ease-in-out,box-shadow .15s ease-in-out}.parcelas-input:focus{color:#495057;background-color:#fff;border-color:#80bdff;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.greenn-footer-modal{display:flex;align-items:center;padding:20px}.greenn-compra-processada{font-size:x-small;position:relative}.greenn-img-logo{display:inline-block;vertical-align:middle;border-style:none;max-width:60px}.greenn-btn-group{margin-left:auto;display:flex;gap:20px}.greenn-btn-person{display:inline-block;font-weight:400;color:#000;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:transparent;border:none;padding:0 45px;height:50px;font-size:16px;line-height:1.5;font-family:Montserrat;font-style:normal;font-weight:600;border-radius:5px;cursor:pointer}.greenn-btn-cancelar{background:#f7f7f7;color:#b5b9c5}.greenn-btn-comprar{color:#fff;background:#00e4a0;border:none;border-radius:5px}@media screen and (max-width:899px){.greenn-item-modal-parcelas{flex-direction: column}.greenn-btn-group{flex-direction: column-reverse;width:100%}.greenn-item-modal{padding:0}.greenn-item-modal-titulo:after{top:26px;left:11px}.greenn-item-parcelas{margin:0 auto;display:block;margin-top:15px}.greenn-item-img{display:block;margin:0 auto}.greenn-item-modal{min-width:90%}.greenn-nome-produto{font-size:1.25em}.greenn-item-parcelas{max-width:none}.greenn-footer-modal{flex-direction:column}.greenn-btn-group{margin-left:auto;gap:20px;display:flex}}.center-text p{text-align:center;font-weight:300;font-size:12px;line-height:1.5;color:#333;margin:0;padding:15px 0}p.greenn-parcelas{font-weight:400;font-size:14px;text-align:start;color:#333}[data-anima=top]{animation:showTop .5s forwards}@keyframes showTop{from{opacity:0;transform:translate3d(0,-20px,0)}to{opacity:1;transform:translate3d(0,0,0)}}.modal-upsell{margin-bottom:10px;padding:35px 30px;border-radius:5px}.modal-container.mostrar{display:flex}.success .icon{width:100px;height:100px;border-radius:50%;background:#03b37f;color:#fff;font-size:45px;display:flex;justify-content:center;align-items:center}.success .message{font-size:24px}.success{display:none}.failed{display:none}.failed .icon{width:100px;height:100px;border-radius:50%;background:#dc3545;color:#fff;font-size:45px;display:flex;justify-content:center;align-items:center}.failed .message{font-size:24px}#loading{width:100%;height:300px;display:none;align-items:center;justify-content:center}.justify-content-center{display:flex;justify-content:center}.text-center{text-align:center;margin:40px 0}h5{font-size:30px;font-weight:300;font-family:Montserrat;font-style:normal}.product-info{border-top:1px #f1f1f1 solid;border-bottom:1px #f1f1f1 solid;margin:20px 0;padding:20px 0;display:flex;align-items:center;justify-content:space-between}.footer{display:flex;justify-content:space-between}.footer b{font-size:22px}.footer small{display:block;text-align:right}p{font-family:Montserrat;font-style:normal}#product-title{font-weight:600;font-size:16px;line-height:20px;color:#333;margin-bottom:7px}.body{margin-top:20px;margin-bottom:30px}.credit-card{display:grid;grid-template-columns:9fr;gap:10px}.custom-input{border:1px solid #e5e5e5;border-radius:5px;padding:5px;display:flex;align-items:center;height:45px;pointer-events:none;background:#fff}.body input{font-style:normal;font-weight:400;font-size:13px;letter-spacing:.01em;color:#333}.custom-input input{height:100%;width:100%;padding-left:15px;border:none;margin:10px;font-family:Montserrat;background:0 0}.custom-input .icon{margin-left:10px}.custom-input .icon-ok{margin-right:10px}.custom-input input:focus-visible{outline:0!important}#installments{height:100%;width:100%;font-family:Montserrat;border:1px solid #e5e5e5;border-radius:5px;padding:15px;-webkit-appearance:none;-moz-appearance:none;background:0 0;background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgOCA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMS4yMzA3NCAwLjQyMzM0QzAuMzc2Mzg2IDAuNDIzMzQgLTAuMDg0NTIzMSAxLjQyNTQ2IDAuNDcxNDgzIDIuMDc0MTNMMy4yOTcyNiA1LjM3MDg3QzMuNjk2MzYgNS44MzY0OSA0LjQxNjY4IDUuODM2NDkgNC44MTU3NyA1LjM3MDg3TDcuNjQxNTUgMi4wNzQxM0M4LjE5NzU2IDEuNDI1NDYgNy43MzY2NSAwLjQyMzM0IDYuODgyMyAwLjQyMzM0SDEuMjMwNzRaIiBmaWxsPSIjQjVCOUM1Ii8+Cjwvc3ZnPgo=);background-repeat:no-repeat;background-position-x:95%;background-position-y:50%;cursor:pointer}#installments:focus-visible{outline:0!important}.credit-card p{font-weight:400;font-size:13px;color:#8c8a97}#confirm{cursor:pointer;font-family:Montserrat;font-style:normal;transition:all .3s}#new-payment{width:100%;border-radius:5px;background:0 0;color:#333;border:none;height:50px;cursor:pointer;font-family:Montserrat;font-size:13px;line-height:16px;margin-top:3px}.zoom:hover{transition:all .3s;transform:scale(1.01)}.shake:hover{animation:shake .82s infinite cubic-bezier(.36,.07,.19,.97) both}.pulse:hover{animation:pulse 1.25s infinite cubic-bezier(.66,0,0,1)}.footer{display:block}.footer p{font-family:Montserrat;font-style:normal;font-weight:400;font-size:10px;line-height:150%;color:#8c8a97}.footer div{margin-bottom:10px}.footer a{font-family:Montserrat;font-style:normal;font-weight:400;font-size:10px;line-height:150%;text-decoration:none}.space-confirm{display:block;position:relative;padding-left:35px;margin-bottom:12px;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;font-family:Montserrat;font-style:normal;margin:0;font-size:14px;color:#333;align-items:center;font-weight:400!important}.space-confirm input{position:absolute;opacity:0;cursor:pointer;height:0;width:0}.checkmark{position:absolute;top:0;left:0;width:15px;height:15px;background-color:#fff;border:solid 2px #03b37f;border-radius:2px}.space-confirm input:checked~.checkmark{background-color:#03b37f}.checkmark:after{content:"";position:absolute;display:none}.space-confirm input:checked~.checkmark:after{display:block}.space-confirm .checkmark:after{left:2px;top:-2;width:5px;height:9px;border:solid #fff;border-width:0 3px 3px 0;-webkit-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.check-itens{margin-top:20px}#not-buy-link{text-decoration:none!important;cursor:pointer}@media only screen and (max-width:600px){.credit-card{grid-template-columns:1fr}}@media only screen and (min-height:800px){.modal-container{padding:0}}@keyframes pulse{0%{transform:scale(.97);box-shadow:0 0 0 0 var(--maincolor)}70%{transform:scale(1);box-shadow:0 0 0 6px transparent}100%{transform:scale(.97);box-shadow:0 0 0 0 transparent}}@keyframes shake{10%,90%{transform:translate3d(-1px,0,0)}20%,80%{transform:translate3d(2px,0,0)}30%,50%,70%{transform:translate3d(-1px,0,0)}40%,60%{transform:translate3d(1px,0,0)}}';
        var head = document.head || document.getElementsByTagName("head")[0];
        var style = document.createElement("style");
        head.appendChild(style);

        style.type = "text/css";

        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }

        document.body.insertAdjacentHTML(
          "beforeend",
          '<div id="greenn-upsell-div" class="greenn-modal" data-anima="top"> <form id="greenn-upsell-form"> <input type="hidden" id="greenn-hash-upsell" name="hash_upsell" value=""/><div class="greenn-item-modal"> <h2 class="greenn-item-modal-titulo">Comprar Junto</h2> <div class="greenn-fechar-modal greenn-fechar">×</div><div class="greenn-item-modal-parcelas"> <div class="greenn-item-img"> <img id="greenn-imagem-upsell" src="" alt="Imagem do produto"/> </div><div class="greenn-item-parcelas"> <p class="greenn-nome-produto" id="greenn-nome-upsell"></p><div id="type-payment"></div></div></div><div class="greenn-footer-modal"> <div class="greenn-btn-group"> <button class="greenn-btn-person greenn-btn-cancelar greenn-fechar" type="button" > Cancelar </button> <button class="greenn-btn-person greenn-btn-comprar" onclick="event.preventDefault(); window.greennUpSell();"> Efetuar Compra </button> </div></div><div class="center-text"><p>Greenn © 2022 - Todos os direitos reservados</p></div></div></form> </div>'
        );

        e._wf.greennModal = document.querySelector(".greenn-modal");
        e._wf.greennForm = document.getElementById("greenn-upsell-form");

        e._wf.addListeners();
        e._wf.loadDataLast();

        var product = e._wf.dataProduct;

        if (
          product.data &&
          product.data.images &&
          product.data.images.length &&
          document.getElementById("greenn-imagem-upsell").getAttribute("src") != product.data.images[0].path
        ) {
          document
            .getElementById("greenn-imagem-upsell")
            .setAttribute("src", product.data.images[0].path);
        }
        document.getElementById("greenn-nome-upsell").innerHTML = product.data.name;
      })
    ),
    (e._wf.injectBaseHtml2 = async (t) => {
      // e._wf.greennModal = document.querySelector(".greenn-modal");
      // e._wf.greennForm = document.getElementById("greenn-upsell-form");

      e._wf.loadDataLast();

      var product = e._wf.dataProduct;

      if (
        product.data &&
        product.data.images &&
        product.data.images.length &&
        document.getElementById("greenn-imagem-upsell").getAttribute("src") !=
          product.data.images[0].path
      ) {
        document
          .getElementById("greenn-imagem-upsell")
          .setAttribute("src", product.data.images[0].path);
      }
      document.getElementById("greenn-nome-upsell").innerHTML = product.data.name;
    }),
    (e._wf.addEventUpsell = async (t) => {
        await e._wf.loadConfigBtn();
        await e._wf.loadData();
        await e._wf.injectBaseHtml2();

        if (t) {
          e._wf.openModal();
        } else {
          e._wf.payment();
        }
    }),
    (e._wf.addEventUpsellNew = async (t) => {
      await e._wf.loadConfigBtn();
      await e._wf.loadData();
      await e._wf.newPayment();
    }),
    (e._wf.addListeners = async (t) => {
      //   const newPayment = document.getElementById("new-payment");
      //   newPayment.addEventListener("click", (f) => {
      //     e._wf.newPayment();
      //   });

      var upsellsNew =
        document.querySelectorAll("[data-greenn-upsell-new]") || [];
      upsellsNew.forEach(function (upsell, index) {
        upsell.addEventListener("click", (f) => {
          e._wf.upsellGreennId = upsell.getAttribute("data-greenn-upsell-new");

          e._wf.addEventUpsellNew();
        });
      });

      var upsells = document.querySelectorAll("[data-greenn-upsell]") || [];
      upsells.forEach(function (upsell, index) {
        upsell.addEventListener("click", (f) => {
          e._wf.upsellGreennId = upsell.getAttribute("data-greenn-upsell");
          e._wf.upsellGreennType = upsell.getAttribute("data-greenn-one-click");

          e._wf.addEventUpsell(
            upsell.getAttribute("data-greenn-one-click") === "false"
          );
        });
      });

      var fecharModal = document.querySelectorAll(".greenn-fechar");
      fecharModal.forEach(function (item) {
        item.addEventListener("click", function () {
          document
            .getElementById("greenn-upsell-div")
            .classList.remove("ativo");
        });
      });

      // if (e._wf.linkNotBuyActive) {
      //   const notbuy = document.getElementById("not-buy-link");
      //   notbuy.addEventListener("click", (f) => {
      //     e._wf.notBuy();
      //   });
      // }
    }),
    (e._wf.init = async (t) => {
      var upsells = document.querySelectorAll("[data-greenn-upsell]") || [];

      let upsell_id = "";
      upsells.forEach(function (upsell, index) {
        upsell.setAttribute("id", "btn-greenn-upsell");
        e._wf.upsellGreennId = upsell.getAttribute("data-greenn-upsell");
        e._wf.upsellGreennType = upsell.getAttribute("data-greenn-one-click");
        upsell_id = upsell.getAttribute("data-greenn-upsell");
      });

      var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      e._wf.isSafari = isSafari || isIOS;

      // e._wf.url = "http://localhost:81";
      e._wf.url = "https://apipay.greenn.com.br";

      // e._wf.url2 = "http://localhost:3000";
      e._wf.url2 = "https://pay.greenn.com.br";

      const urlParams = new URLSearchParams(window.location.search);
      e._wf.token = urlParams.get("token");

      const notbuybtn = document.getElementById("not-buy-link");
      let href = "";

      if (notbuybtn) {
        href = notbuybtn.href;
      }

      if (e._wf.token && notbuybtn) {
        notbuybtn.href = href + "?token=" + e._wf.token;
        notbuybtn.addEventListener("click", (f) => {
          e._wf.notBuy();
        });
      }

      window.greennUpSellChangeMethod = e._wf.newPayment;
      window.greennUpSell = e._wf.payment;
      window.greennUpSellDeny = e._wf.notBuy;
      window.greennFunctionOpenModal = e._wf.openModal;

      await e._wf.loadTaxa();
      await e._wf.loadConfigBtn(e._wf.upsellGreennId);
      if (!(await e._wf.loadData())) throw "Failed to load data";
      await e._wf.injectBaseHtml();
      //   await e._wf.loadDataLast();
    }),
    e._wf.init(t));
})(window, document);
