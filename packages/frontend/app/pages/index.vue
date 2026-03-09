<script setup lang="ts">
const searchQuery = ref('')

const ministryCards = [
  {
    title: '主日崇拜',
    icon: 'i-lucide-heart',
    color: 'bg-[var(--color-sage-100)]',
    textColor: 'text-[var(--color-sage-800)]',
    size: 'normal'
  },
  {
    title: '小組團契',
    icon: 'i-lucide-users',
    color: 'bg-[var(--color-warm-100)]',
    textColor: 'text-[var(--color-warm-800)]',
    size: 'normal'
  },
  {
    title: '兒童主日學 & 青少年事工',
    icon: 'i-lucide-sparkles',
    color: 'bg-[var(--color-sand-950)]',
    textColor: 'text-white',
    size: 'wide'
  },
  {
    title: '敬拜團',
    icon: 'i-lucide-music',
    color: 'bg-[var(--color-sand-200)]',
    textColor: 'text-[var(--color-sand-800)]',
    size: 'normal'
  },
  {
    title: '關懷探訪',
    icon: 'i-lucide-hand-heart',
    color: 'bg-[var(--color-sage-200)]',
    textColor: 'text-[var(--color-sage-900)]',
    size: 'normal'
  }
]

const churchSizes = [
  { label: '小型聚會', desc: '10-30人' },
  { label: '中型聚會', desc: '30-80人' },
  { label: '大型聚會', desc: '80人以上' }
]
const selectedSize = ref(1)

const dates = [
  {
    date: '3月16日 (日)',
    times: ['09:30', '11:00', '14:30', '19:00']
  },
  {
    date: '3月23日 (日)',
    times: ['09:30', '11:00', '14:30']
  },
  {
    date: '3月30日 (日)',
    times: ['09:30', '11:00', '14:30', '19:00']
  }
]
const selectedTime = ref({ date: 0, time: 1 })
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-10">
    <div class="flex flex-col lg:flex-row gap-10">
      <!-- Left Column -->
      <div class="flex-1 min-w-0">
        <!-- Hero Text -->
        <div class="mb-8 animate-fade-up">
          <p class="text-sm font-medium text-[var(--color-warm-600)] tracking-wide uppercase mb-3">
            歡迎來到恩典教會
          </p>
          <h1 class="font-display text-4xl md:text-5xl font-bold text-[var(--color-sand-950)] leading-tight">
            在這裡找到你的<br>屬靈的家
          </h1>
        </div>

        <!-- Search Bar -->
        <div class="flex items-center gap-3 mb-10 animate-fade-up stagger-1">
          <UInput
            v-model="searchQuery"
            placeholder="搜尋聚會、活動、事工..."
            icon="i-lucide-search"
            size="lg"
            class="flex-1"
            :ui="{ base: 'rounded-xl bg-white border-[var(--color-sand-200)]' }"
          />
          <UButton
            label="搜尋"
            size="lg"
            class="rounded-xl bg-[var(--color-sand-950)] text-white hover:bg-[var(--color-sand-800)] px-6 shrink-0"
          />
        </div>

        <!-- Ministry Cards Grid -->
        <div class="grid grid-cols-3 gap-4 animate-fade-up stagger-2">
          <div
            v-for="(card, index) in ministryCards"
            :key="card.title"
            :class="[
              'rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg',
              card.color,
              card.size === 'wide' ? 'col-span-2 row-span-1' : '',
              index < 2 ? 'min-h-[140px]' : 'min-h-[130px]'
            ]"
          >
            <UIcon
              :name="card.icon"
              :class="['text-2xl mb-4', card.textColor]"
            />
            <p :class="['text-sm font-semibold leading-snug', card.textColor]">
              {{ card.title }}
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column - Event Registration Sidebar -->
      <div class="w-full lg:w-[380px] shrink-0 animate-fade-up stagger-3">
        <div class="bg-white rounded-3xl border border-[var(--color-sand-200)] p-6 shadow-sm">
          <!-- Title -->
          <h2 class="font-display text-2xl font-bold text-[var(--color-sand-950)] mb-1">
            預約聚會體驗
          </h2>
          <p class="text-sm text-[var(--color-sand-500)] mb-6">
            選擇適合你的聚會
          </p>

          <!-- Size Selection -->
          <div class="flex gap-2 mb-6">
            <button
              v-for="(size, index) in churchSizes"
              :key="size.label"
              :class="[
                'flex-1 rounded-xl border-2 p-3 text-center transition-all duration-200',
                selectedSize === index
                  ? 'border-[var(--color-sage-500)] bg-[var(--color-sage-50)]'
                  : 'border-[var(--color-sand-200)] hover:border-[var(--color-sand-300)]'
              ]"
              @click="selectedSize = index"
            >
              <p :class="['text-xs font-bold', selectedSize === index ? 'text-[var(--color-sage-700)]' : 'text-[var(--color-sand-600)]']">
                {{ size.label }}
              </p>
              <p :class="['text-[11px] mt-0.5', selectedSize === index ? 'text-[var(--color-sage-500)]' : 'text-[var(--color-sand-400)]']">
                {{ size.desc }}
              </p>
            </button>
          </div>

          <!-- Date / Time Selection -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-[var(--color-sand-950)]">
              選擇日期 / 時間
            </h3>
            <UIcon
              name="i-lucide-calendar"
              class="text-[var(--color-sand-400)]"
            />
          </div>

          <div class="space-y-5 mb-6">
            <div
              v-for="(dateGroup, dateIndex) in dates"
              :key="dateGroup.date"
            >
              <p class="text-xs font-medium text-[var(--color-sand-500)] mb-2">
                {{ dateGroup.date }}
              </p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="(time, timeIndex) in dateGroup.times"
                  :key="time"
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200',
                    selectedTime.date === dateIndex && selectedTime.time === timeIndex
                      ? 'bg-[var(--color-sand-950)] text-white border-[var(--color-sand-950)]'
                      : 'border-[var(--color-sand-200)] text-[var(--color-sand-700)] hover:border-[var(--color-sand-400)]'
                  ]"
                  @click="selectedTime = { date: dateIndex, time: timeIndex }"
                >
                  {{ time }}
                </button>
              </div>
            </div>
          </div>

          <!-- Book Button -->
          <div class="flex items-center justify-between pt-4 border-t border-[var(--color-sand-100)]">
            <p class="text-xs text-[var(--color-sand-400)]">
              也可用日曆預約
            </p>
            <UButton
              label="立即預約"
              size="lg"
              class="rounded-xl bg-[var(--color-sage-600)] text-white hover:bg-[var(--color-sage-700)] px-8"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
