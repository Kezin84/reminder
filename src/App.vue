<template>
  <div class="app-layout" :class="{ 'sidebar-collapsed': !isSidebarOpen }">
    <aside class="sidebar">
      <div class="logo">
        <h2 v-if="isSidebarOpen">Mini CRM</h2>
        <button class="toggle-btn" @click="isSidebarOpen = !isSidebarOpen">
          <svg v-if="isSidebarOpen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>
      <nav class="nav-menu">
        <router-link to="/report" class="nav-item" title="Báo cáo công việc">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <span v-if="isSidebarOpen">Báo cáo công việc</span>
        </router-link>
        <router-link to="/customer" class="nav-item" title="Khách hàng">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span v-if="isSidebarOpen">Khách hàng</span>
        </router-link>
      </nav>
    </aside>
    <main class="main-content" ref="mainContentRef" @scroll="handleScroll">
      <router-view />
    </main>

    <!-- Scroll to Top Button -->
    <button 
      class="scroll-to-top" 
      :class="{ 'show': showScrollTop }"
      @click="scrollToTop"
      title="Lên đầu trang"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isSidebarOpen = ref(true)
const mainContentRef = ref(null)
const showScrollTop = ref(false)

const handleScroll = (e) => {
  if (e.target) {
    showScrollTop.value = e.target.scrollTop > 300
  }
}

const handleWindowScroll = () => {
  if (window.scrollY > 300) {
    showScrollTop.value = true
  } else if (!mainContentRef.value || mainContentRef.value.scrollTop <= 300) {
    showScrollTop.value = false
  }
}

const scrollToTop = () => {
  if (mainContentRef.value) {
    mainContentRef.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleWindowScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleWindowScroll)
})
</script>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 45px;
  height: 45px;
  background-color: var(--accent);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(22, 163, 74, 0.4);
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 9999;
}

.scroll-to-top.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.scroll-to-top:hover {
  filter: brightness(1.1);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(22, 163, 74, 0.5);
}

.scroll-to-top:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .scroll-to-top {
    bottom: 80px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
  .scroll-to-top svg {
    width: 20px;
    height: 20px;
  }
}
</style>
