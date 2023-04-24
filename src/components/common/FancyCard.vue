<template>
  <div class="f-card">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.f-card {
  --main-color: var(--blue-color);
  --card-padding: 20px 32px;
  --card-shadow: var(--shadow-medium), var(--shadow-large);

  border-radius: 5px;
  padding: var(--card-padding);
  border: 2px solid var(--main-color);
  box-shadow: var(--card-shadow);
}
</style>
