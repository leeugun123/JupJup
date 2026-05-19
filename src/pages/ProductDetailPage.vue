<template>
  <q-page class="q-pa-md">
    <q-btn flat round dense icon="arrow_back" @click="$router.back()" class="q-mb-md" />
    <div class="row">
      <div class="col-xs-12 col-sm-6">
        <q-img src="https://via.placeholder.com/300" class="rounded-borders" />
      </div>
      <div class="col-xs-12 col-sm-6">
        <h1>딸기 우유</h1>
        <div class="q-mt-md">
          <div class="row items-baseline q-col-gutter-md">
            <div class="col">
              <div class="text-caption text-grey">정가</div>
              <div class="text-h5 text-strike">₩2,500</div>
            </div>
            <div class="col">
              <div class="text-caption text-grey">할인가</div>
              <div class="text-h4 text-primary">₩1,500</div>
            </div>
            <div class="col">
              <div class="text-caption text-grey">할인율</div>
              <div class="text-h5 text-negative">-40%</div>
            </div>
          </div>
        </div>
        <div class="q-mt-md">
          <div class="text-subtitle2 text-weight-bold q-mb-sm">편의점</div>
          <div>CU 강남점</div>
          <div class="text-caption text-grey">서울 강남구</div>
        </div>
        <div class="q-mt-md">
          <div class="text-subtitle2 text-weight-bold q-mb-sm">유통기한</div>
          <div>2026년 5월 21일</div>
        </div>
        <q-btn label="구매하기" color="primary" size="lg" class="full-width q-mt-md" />
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.text-strike {
  text-decoration: line-through;
}
.rounded-borders {
  border-radius: 8px;
}
</style>
