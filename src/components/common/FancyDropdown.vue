<template>
  <div class="f-dropdown">
    <div class="f-dropdown__wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.f-dropdown {
  --border-color: var(--blue-color);
  --bg-color: var(--white-color);
  --dropdown-height: auto;
  --dropdown-max-height: 200px;
  --dropdown-min-height: 40px;
  --dropdown-width: 200px;
  --dropdown-padding: 0px;

  background-color: var(--bg-color);
  border: 1px solid;
  border-color: var(--border-color);
  border-radius: 15px;
  box-shadow: var(--shadow-large);
  overflow: hidden;
  position: relative;
  transition: all 0.3s;
  width: var(--dropdown-width);

  &__wrapper {
    padding: var(--dropdown-padding);
    overflow-y: overlay;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    min-height: var(--dropdown-min-height);
    height: var(--dropdown-height);
    max-height: var(--dropdown-max-height);
  }
}
</style>
