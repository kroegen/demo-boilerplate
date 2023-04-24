<template>
  <div class="table">
    <div class="table__header">
      <span class="table__header-title">title</span>
      <span class="table__header-brand">brand</span>
      <span class="table__header-description">description</span>
      <span class="table__header-category">category</span>
      <span class="table__header-price">price</span>
      <span class="table__header-actions"></span>
    </div>
    <div class="table__body">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table {
  --header-height: 60px;

  width: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 50px;
  height: 100%;

  &__header {
    width: 100%;
    display: flex;
    flex-direction: row;
    height: var(--header-height);
    text-transform: capitalize;
    color: var(--grey-color);
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid var(--beige-color);
    flex-shrink: 0;
    padding-right: 16px;

    & > span {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0 5px;
      font-size: 0.75rem;
      height: 100%;
      font-weight: 600;
    }
  }

  &__header-title {
    flex: 1;
  }

  &__header-brand {
    flex: 1;
  }

  &__header-description {
    flex: 3;
  }

  &__header-category {
    flex: 1;
  }

  &__header-price {
    flex: 1;
  }

  &__header-actions {
    flex: 1;
  }

  &__body {
    height: calc(100% - var(--header-height));
    overflow-y: scroll;
    width: 100%;
    display: flex;
    flex-direction: column;
    color: var(--black-color);
  }
}
</style>
