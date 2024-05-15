<template>
  <div :class="containerClasses">
    <div class="loader ease-linear rounded-full border-2 border-t-2 border-gray-200 h-8 w-8 mb-4"></div>
  </div>
</template>

<script>
export default {
  props: {
    alignment: {
      type: String,
      default: "center"
    }
  },
  computed: {
    containerClasses() {
      return {
        "inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50": true,
        "inset-0 flex items-left justify-left bg-white bg-opacity-50 z-50": this.alignment === "left",
        "inset-0 flex items-right justify-right bg-white bg-opacity-50 z-50": this.alignment === "right",
        "inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50": this.alignment === "center"
      };
    }
  }
};
</script>

<style>
.loader {
  border-top-color: #00e4a0;
  -webkit-animation: spinner 1.5s linear infinite;
  animation: spinner 1.5s linear infinite;
}

@-webkit-keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>
