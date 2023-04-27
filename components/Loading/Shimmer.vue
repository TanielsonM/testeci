<script setup>
const props = defineProps({
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "100%",
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const items = Array.from({ length: props.quantity }, (_, index) => index + 1);
</script>
<template>
  <div
    v-for="(item, index) in items"
    :key="index"
    class="shimmer"
    :style="{ width: width, height: height }"
  >
    <div class="shimmer-line"></div>
  </div>
</template>
<style scoped>
.shimmer {
  position: relative;
  overflow: hidden;
  background-color: #f7f7f7;
  border-radius: 5px;
  margin-bottom: 0.5rem;
}

.shimmer-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    to right,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 40%,
    transparent 60%,
    transparent 100%
  );
  animation: shimmer 1s ease-out infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
