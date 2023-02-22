<script setup>
const form = ref({
  zipcode: "",
  public_place: "",
  number: "",
  city: "",
  neighborhood: "",
  complement: "",
  state: "",
});
</script>

<template>
  <form class="grid w-full grid-cols-12 gap-3">
    <BaseInput
      :label="$t('forms.address.inputs.zipcode.label')"
      :placeholder="$t('forms.address.inputs.zipcode.placeholder')"
      class="col-span-12 xl:col-span-3"
      v-mask="'#####-###'"
      v-model="form.zipcode"
    />
    <BaseInput
      :label="$t('forms.address.inputs.public_place.label')"
      :placeholder="$t('forms.address.inputs.public_place.placeholder')"
      class="col-span-12 xl:col-span-6"
      v-model="form.public_place"
    />
    <BaseInput
      :label="$t('forms.address.inputs.number.label')"
      :placeholder="$t('forms.address.inputs.number.placeholder')"
      class="col-span-12 xl:col-span-3"
      v-mask="'###########'"
      v-model="form.number"
    />
    <BaseInput
      :label="$t('forms.address.inputs.city.label')"
      :placeholder="$t('forms.address.inputs.city.placeholder')"
      class="col-span-12 xl:col-span-6"
      v-model="form.city"
    />
    <BaseInput
      :label="$t('forms.address.inputs.neighborhood.label')"
      :placeholder="$t('forms.address.inputs.neighborhood.placeholder')"
      class="col-span-12 xl:col-span-6"
      v-model="form.neighborhood"
    />
    <BaseInput
      :label="$t('forms.address.inputs.complement.label')"
      :placeholder="$t('forms.address.inputs.complement.placeholder')"
      class="col-span-12 xl:col-span-8"
      v-model="form.complement"
    />
    <BaseInput
      :label="$t('forms.address.inputs.state.label')"
      :placeholder="$t('forms.address.inputs.state.placeholder')"
      class="col-span-12 xl:col-span-4"
      v-model="form.state"
    />
  </form>
</template>
