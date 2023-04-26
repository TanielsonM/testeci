<script lang="ts" setup>

getTagManager() {
      let data = {
        id: this.id_product,
      };
      serviceCheckout.readAll(data).then((response) => {
        const resp = JSON.parse(response.data);
        const pixels = resp.data.pixels;

        const hasTagManager =
          pixels && pixels.length
            ? pixels.filter((item) => item.type == "GOOGLETAGMANAGER")
            : [];

        // fluxo tagmanager manual
        if (hasTagManager.length) {
          if (!this.isCheckout) {
            hasTagManager.forEach((item) => {
              (function (w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                  "gtm.start": new Date().getTime(),
                  event: "gtm.js",
                });
                var f = d.getElementsByTagName(s)[0],
                  j = d.createElement(s),
                  dl = l != "dataLayer" ? "&l=" + l : "";
                j.async = true;
                j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
                f.parentNode.insertBefore(j, f);
              })(window, document, "script", "dataLayer", item.pixel_id);
            });
          }

          // enviando o evento de checkout para o tagmanager
          this.onPurchaseEvent();
        }
      });
    },
</script>
<template></template>
