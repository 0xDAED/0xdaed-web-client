<template>
  <div class="drawer drawer-open">
    <input id="main-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <VNavbarMenu />
      <router-view />
      <!-- footer ebat -->
    </div>

    <div class="drawer-side is-drawer-close:overflow-visible">
      <div class="bg-base-200 flex min-h-full flex-col items-start">
        <!-- sidebar content -->
        <VAsideMenu />
      </div>
    </div>
  </div>
</template>
