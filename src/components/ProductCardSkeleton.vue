<template>
  <div class="skeleton-card">
    <div class="skeleton-img shimmer" />
    <div class="skeleton-body">
      <div class="skeleton-badge shimmer" />
      <div class="skeleton-name shimmer" />
      <div class="skeleton-name-short shimmer" />
      <div class="skeleton-price shimmer" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 800px 100%;
  animation: shimmer 1.4s infinite linear;
  border-radius: 8px;
}

.skeleton-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.skeleton-img {
  width: 100%;
  height: 150px;
  border-radius: 0;
}

.skeleton-body {
  padding: 10px 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-badge {
  width: 40px;
  height: 18px;
}

.skeleton-name {
  width: 100%;
  height: 14px;
}

.skeleton-name-short {
  width: 65%;
  height: 14px;
}

.skeleton-price {
  width: 50%;
  height: 20px;
  margin-top: 2px;
}
</style>
