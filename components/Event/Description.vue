<script setup>
import { useProductStore } from "~~/store/product";
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
const { product } = useProductStore();
</script>

<template>
  <div class="mb-3">
    <p class="text-[16px] font-[700] text-main-color"> {{ $t("pre_checkout.details") }} </p>
    <p class="block w-full text-[15px] font-[400] leading-relaxed text-input-color mb-3">
      <MdPreview v-model="product.description" style="background-color: transparent;" previewTheme="github" />
    </p>
  </div>
</template>

<style>
.md-editor-preview-wrapper {
  position: relative;
  flex: 1;
  box-sizing: border-box;
  overflow: auto;
  padding: 10px 0px;
}

.md-editor-preview {
  word-break: break-word;
}
</style>
