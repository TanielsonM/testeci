<template>
  <NuxtErrorBoundary @error="someErrorLogger">
    <template #error="{ error, clearError }">
      errors: {{ error }}
      <button @click="clearError">Limpar Logs.</button>
    </template>
  </NuxtErrorBoundary>
</template>
