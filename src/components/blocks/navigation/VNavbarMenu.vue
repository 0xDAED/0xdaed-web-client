<template>
  <div class="navbar navbar-diagonal shadow-sm">
    <div class="navbar-start"></div>
    <div class="navbar-center"></div>
    <div class="navbar-end w-full justify-between gap-2 sm:w-1/2 sm:justify-end">
      <button class="btn btn-ghost btn-circle">
        <div class="indicator">
          <Bell />
          <span class="badge badge-xs badge-primary indicator-item">+99</span>
        </div>
      </button>
      <VBranchSelect />
      <VGroupSelect />
    </div>
  </div>
</template>

<style scoped></style>
