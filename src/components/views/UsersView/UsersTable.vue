<template>
  <div class="table">
    <div class="table__header">
      <span class="table__header-image"></span>
      <span class="table__header-name">name</span>
      <span class="table__header-email">email</span>
      <span class="table__header-phone">phone</span>
      <span class="table__header-birthdate">birth Date</span>
      <span class="table__header-actions"></span>
    </div>
    <div class="table__body">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/styles/mixins" as mixins;

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

  &__header-image {
    flex: 1;
    min-width: 100px;
  }

  &__header-name {
    flex: 3;
    min-width: 300px;
  }

  &__header-email {
    flex: 2;
    min-width: 200px;
  }

  &__header-phone {
    flex: 2;
    min-width: 200px;
  }

  &__header-birthdate {
    flex: 2;
    min-width: 200px;
  }

  &__header-actions {
    flex: 2;
    min-width: 200px;
  }

  &__body {
    height: calc(100% - var(--header-height));
    overflow-y: scroll;
    width: 100%;
    display: flex;
    flex-direction: column;
    color: var(--black-color);

    @include mixins.mobile {
      overflow-y: initial;
    }
  }

  @include mixins.mobile {
    padding-left: 0px;
    overflow-y: scroll;
  }
}
</style>
