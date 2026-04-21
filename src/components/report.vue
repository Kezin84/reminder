<template>
  <div class="report-container">
    <header class="header">
      <div class="title-section">
        <h1>Quản Lý Báo Cáo</h1>
        <p class="subtitle">Theo dõi và cập nhật trạng thái công việc</p>
      </div>
      <div class="header-actions">
        <button class="btn-excel" @click="exportExcel">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>Xuất Excel</span>
        </button>
        <button class="btn-primary" @click="openAddModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>Thêm Báo Cáo Mới</span>
        </button>
      </div>
    </header>

    <!-- Thẻ thống kê -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon total">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ filteredReports.length }}</span>
          <span class="stat-label">Tổng cộng</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon pending">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ pendingCount }}</span>
          <span class="stat-label">Chưa hoàn thành</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon done">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ completedCount }}</span>
          <span class="stat-label">Đã hoàn thành</span>
        </div>
      </div>
    </div>

    <div class="filters">
      <div class="filter-row top-row">
        <div class="filter-group">
          <label>Thứ Tự</label>
          <select v-model="filters.sortOrder">
            <option value="desc">Mới nhất trước</option>
            <option value="asc">Cũ nhất trước</option>
          </select>
        </div>
        <div class="date-filter">
          <label>Từ</label>
          <input type="date" v-model="filters.dateFrom" :max="filters.dateTo" @change="fetchReports" @click="$event.target.showPicker()" />
          <label>Đến</label>
          <input type="date" v-model="filters.dateTo" :min="filters.dateFrom" @change="fetchReports" @click="$event.target.showPicker()" />
        </div>
        <div class="filter-actions">
          <button class="btn-secondary" @click="fetchReports">Refresh</button>
        </div>
      </div>

      <div class="filter-row bottom-row">
        <div class="filter-group">
          <label>Độ Quan Trọng</label>
          <select v-model="filters.tag">
            <option value="">Tất cả</option>
            <option value="ƯU TIÊN">ƯU TIÊN</option>
            <option value="BÌNH THƯỜNG">BÌNH THƯỜNG</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Phân Loại</label>
          <select v-model="filters.phan_loai">
            <option value="">Tất cả</option>
            <option value="CÔNG VIỆC">Công việc</option>
            <option value="ĐỜI SỐNG">Đời sống</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Trạng Thái</label>
          <select v-model="filters.trang_thai">
            <option value="">Tất cả</option>
            <option value="Chưa xử lý">Chưa xử lý</option>
            <option value="Hoàn thành">Hoàn thành</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Bảng Dữ Liệu (PC) -->
    <div class="table-wrapper desktop-only">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Đang tải dữ liệu báo cáo...</p>
      </div>
      <table v-else class="report-table">
        <thead>
          <tr>
            <th width="5%">STT</th>
            <th width="15%">Thời Gian</th>
            <th width="10%">Phân Loại</th>
            <th width="30%">Nội Dung</th>
            <th width="15%">Ghi Chú</th>
            <th width="10%">Độ Quan Trọng</th>
            <th width="10%">Trạng Thái</th>
            <th width="5%" class="text-right">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="reports.length === 0">
            <td colspan="8" class="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>
              <p>Không có báo cáo nào khớp với tìm kiếm của bạn.</p>
            </td>
          </tr>
          <tr v-for="(report, index) in filteredReports" :key="report.id" class="animate-row clickable-row" @click="openEditModal(report)">
            <td class="col-index">{{ index + 1 }}</td>
            <td class="col-time">
              <div class="time-display">
                <div class="time-row time-main">
                  <span class="time-hm">{{ formatDisplayTime(report.thoi_gian).time }}</span>&nbsp;&nbsp;
                  <span class="time-thu">{{ formatDisplayTime(report.thoi_gian).thu }}</span>
                </div>
                <div class="time-row time-sub">{{ formatDisplayTime(report.thoi_gian).date }}</div>
              </div>
            </td>
            <td><span class="badge" :class="getCategoryClass(report.phan_loai)">{{ report.phan_loai || 'Chưa phân loại' }}</span></td>
            <td class="col-content">{{ report.noi_dung }}</td>
            <td class="col-note">{{ report.ghi_chu }}</td>
            <td>
              <div class="tag-list" v-if="report.tag">
                <span class="tag" v-for="t in splitTags(report.tag)" :key="t" :class="getTagClass(t)">{{ t }}</span>
              </div>
            </td>
            <td>
              <div class="status-pill-tag" :class="getStatusPillClass(report.trang_thai)">
                {{ report.trang_thai || 'N/A' }}
              </div>
            </td>
            <td class="col-actions text-right">
              <button v-if="report.trang_thai !== 'Hoàn thành'" class="btn-icon success" @click.stop="markAsCompleted(report)" title="Đánh dấu Hoàn thành">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </button>
              <button class="btn-icon delete" @click.stop="confirmDelete(report.id)" title="Xoá">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-list mobile-only">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Đang tải dữ liệu báo cáo...</p>
      </div>
      <div v-else-if="reports.length === 0" class="empty-state" style="padding: 3rem;">
        <p>Không có báo cáo nào.</p>
      </div>
      <div v-else v-for="(report, index) in filteredReports" :key="'card-' + report.id" 
           class="report-card" :class="getStatusBorderClass(report.trang_thai)" @click="openEditModal(report)">
        
        <!-- Hàng 1: STT & Thời gian -->
        <div class="card-row-header">
          <span class="card-id">#{{ index + 1 }}</span>
          <div class="card-time-group">
            <div class="time-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>{{ formatDisplayTime(report.thoi_gian).time }}</span>
              <span class="sep">•</span>
              <span class="day-text">{{ formatDisplayTime(report.thoi_gian).thu }}</span>
            </div>
            <div class="time-secondary">{{ formatDisplayTime(report.thoi_gian).date }}</div>
          </div>
          <div class="status-pill-mini" :class="getStatusPillClass(report.trang_thai)">{{ report.trang_thai }}</div>
        </div>

        <!-- Hàng 2: Tag -->
        <div class="card-row-tags">
          <span class="category-badge" :class="getCategoryClass(report.phan_loai)">{{ report.phan_loai }}</span>
          <span v-if="report.tag" v-for="t in splitTags(report.tag)" :key="t" class="tag-mini" :class="getTagClass(t)">{{ t }}</span>
        </div>

        <!-- Hàng 3: Nội dung -->
        <div class="card-row-content">
          <div class="content-title">{{ report.noi_dung }}</div>
        </div>

        <!-- Hàng 4: Ghi chú -->
        <div class="card-row-note" v-if="report.ghi_chu">
          <div class="content-note">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>{{ report.ghi_chu }}</span>
          </div>
        </div>

        <!-- Hàng 5: Hoàn thành, Xoá -->
        <div class="card-row-actions">
          <button v-if="report.trang_thai !== 'Hoàn thành'" class="btn-action-full success" @click.stop="markAsCompleted(report)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Hoàn thành</span>
          </button>
          <button class="btn-action-full delete" @click.stop="confirmDelete(report.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            <span>Xoá</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div class="modal-overlay" v-if="isModalOpen" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Chỉnh Sửa Báo Cáo' : 'Thêm Báo Cáo Mới' }}</h2>
          <button class="btn-close" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <form @submit.prevent="saveReport">
          <div class="form-group row">
            <div class="col">
              <label>Phân Loại</label>
              <div class="select-wrapper">
                <select v-model="formData.phan_loai">
                  <option value="CÔNG VIỆC">CÔNG VIỆC</option>
                  <option value="ĐỜI SỐNG">ĐỜI SỐNG</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Thời Gian</label>
            <div class="time-picker-row">
              <div class="time-box">
                <div class="picker-item">
                  <span class="item-label">Giờ</span>
                  <div class="select-wrapper small-select">
                    <select v-model="timeInputs.hour">
                      <option v-for="h in 24" :key="h" :value="String(h-1).padStart(2, '0')">{{ String(h-1).padStart(2, '0') }}</option>
                    </select>
                  </div>
                </div>
                <span class="colon mt-label">:</span>
                <div class="picker-item">
                  <span class="item-label">Phút</span>
                  <div class="select-wrapper small-select">
                    <select v-model="timeInputs.minute">
                      <option v-for="m in 60" :key="m" :value="String(m-1).padStart(2, '0')">{{ String(m-1).padStart(2, '0') }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="date-box">
                <div class="picker-item">
                  <span class="item-label">Thứ</span>
                  <div class="select-wrapper small-select">
                    <select v-model="timeInputs.thu">
                      <option value="2">Thứ 2</option>
                      <option value="3">Thứ 3</option>
                      <option value="4">Thứ 4</option>
                      <option value="5">Thứ 5</option>
                      <option value="6">Thứ 6</option>
                      <option value="7">Thứ 7</option>
                      <option value="8">CN</option>
                    </select>
                  </div>
                </div>
                <div class="picker-item">
                  <span class="item-label">Ngày</span>
                  <div class="select-wrapper small-select">
                    <select v-model="timeInputs.day">
                      <option v-for="d in daysInMonth" :key="d" :value="String(d).padStart(2, '0')">{{ String(d).padStart(2, '0') }}</option>
                    </select>
                  </div>
                </div>
                <span class="slash mt-label">/</span>
                <div class="picker-item">
                  <span class="item-label">Tháng</span>
                  <div class="select-wrapper small-select">
                    <select v-model="timeInputs.month">
                      <option v-for="m in 12" :key="m" :value="String(m).padStart(2, '0')">{{ String(m).padStart(2, '0') }}</option>
                    </select>
                  </div>
                </div>
                <span class="slash mt-label">/</span>
                <div class="picker-item">
                  <span class="item-label">Năm</span>
                  <div class="select-wrapper small-select">
                    <select v-model="timeInputs.year">
                      <option v-for="y in 20" :key="y" :value="String(2023 + y)">{{ 2023 + y }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label>Nội Dung <span class="required">*</span></label>
            <textarea v-model="formData.noi_dung" required placeholder="Mô tả chi tiết nội dung báo cáo..." rows="3"></textarea>
          </div>

          <div class="form-group">
            <label>Ghi Chú</label>
            <textarea v-model="formData.ghi_chu" placeholder="Các ghi chú bổ sung nếu có..." rows="1"></textarea>
          </div>

          <div class="form-group row">
            <div class="col">
              <label>Độ quan trọng</label>
              <div class="select-wrapper">
                <select v-model="formData.tag">
                    <option value="BÌNH THƯỜNG">BÌNH THƯỜNG</option>
                  <option value="ƯU TIÊN">ƯU TIÊN</option>
                  
                </select>
              </div>
            </div>
            <div class="col" v-if="isEditing">
              <label>Trạng Thái</label>
              <div class="status-toggle-btns">
                <button 
                  type="button" 
                  :class="['btn-toggle', formData.trang_thai === 'Hoàn thành' ? 'active-success' : '']"
                  @click="formData.trang_thai = 'Hoàn thành'"
                >
                  Hoàn thành
                </button>
                <button 
                  type="button" 
                  :class="['btn-toggle', formData.trang_thai === 'Chưa xử lý' ? 'active-warning' : '']"
                  @click="formData.trang_thai = 'Chưa xử lý'"
                >
                  Chưa xử lý
                </button>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeModal" :disabled="saving">Huỷ Bỏ</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              <span v-if="saving" class="spinner-small"></span>
              <template v-if="saving">
                {{ isEditing ? 'Đang Lưu...' : 'Đang Thêm...' }}
              </template>
              <template v-else>
                {{ isEditing ? 'Lưu Báo Cáo' : 'Thêm Báo Cáo' }}
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Chọn Tháng/Năm Tải Excel -->
    <div class="modal-overlay" v-if="isExportModalOpen" @click.self="isExportModalOpen = false">
      <div class="modal" style="max-width: 400px;">
        <div class="modal-header">
          <h2>Tải Báo Cáo Excel</h2>
          <button class="btn-close" @click="isExportModalOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="form-group row">
          <div class="col">
            <label>Tháng</label>
            <div class="select-wrapper">
              <select v-model="exportInputs.month">
                <option v-for="m in 12" :key="m" :value="String(m).padStart(2, '0')">Tháng {{ m }}</option>
              </select>
            </div>
          </div>
          <div class="col">
            <label>Năm</label>
            <div class="select-wrapper">
              <select v-model="exportInputs.year">
                <option v-for="y in 20" :key="y" :value="String(2023 + y)">{{ 2023 + y }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="isExportModalOpen = false">Huỷ Bỏ</button>
          <button type="button" class="btn-primary" @click="doExportExcel">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Tải Xuống
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import * as XLSX from 'xlsx-js-style'

// ==========================================
// THAY THẾ URL WEB APP CỦA BẠN VÀO ĐÂY
// ==========================================
const API_URL = 'https://script.google.com/macros/s/AKfycbx1yDOQLxYgJb5w30KmxQHF8AYUZln_5q58HCKP4zlUmtJye6aJBiSt3oyT0j_3QaigdQ/exec'

const reports = ref([])
const loading = ref(false)
const saving = ref(false)

const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const filters = ref({
  tag: '',
  phan_loai: '',
  trang_thai: '',
  dateFrom: getTodayStr(),
  dateTo: getTodayStr(),
  sortOrder: 'desc'
})

// Parse ngày từ chuỗi thời gian backend: "HH:MM /thu /DD/MM/YYYY"
const parseDateFromReport = (thoi_gian) => {
  try {
    const parts = thoi_gian.split(' /');
    if (parts.length === 3) {
      const timePart = parts[0];
      const datePart = parts[2];
      const [hour, minute] = timePart.split(':');
      const [d, m, y] = datePart.split('/');
      return new Date(Number(y), Number(m) - 1, Number(d), Number(hour), Number(minute));
    }
  } catch (e) {}
  return null;
}

// Helper định dạng hiển thị thời gian
const formatDisplayTime = (thoi_gian) => {
  if (!thoi_gian) return { time: '', thu: '', date: '' };
  const parts = thoi_gian.split(' /');
  if (parts.length === 3) {
    const timePart = parts[0];
    const thuPart = parts[1].trim();
    const datePart = parts[2];
    
    const [h, m] = timePart.split(':');
    const thuText = thuPart === '8' ? 'Chủ Nhật' : `Thứ ${thuPart}`;
    
    return {
      time: `${h} : ${m}`,
      thu: thuText,
      date: datePart.split('/').join(' / ')
    };
  }
  return { time: thoi_gian, thu: '', date: '' };
}

const filteredReports = computed(() => {
  let result = reports.value.filter(r => {
    if (filters.value.tag && r.tag !== filters.value.tag) return false;
    if (filters.value.phan_loai && r.phan_loai !== filters.value.phan_loai) return false;
    if (filters.value.trang_thai && r.trang_thai !== filters.value.trang_thai) return false;
    
    if (filters.value.dateFrom || filters.value.dateTo) {
      const reportDate = parseDateFromReport(r.thoi_gian);
      if (!reportDate) return false;
      if (filters.value.dateFrom) {
        const from = new Date(filters.value.dateFrom);
        from.setHours(0, 0, 0, 0);
        if (reportDate < from) return false;
      }
      if (filters.value.dateTo) {
        const to = new Date(filters.value.dateTo);
        to.setHours(23, 59, 59, 999);
        if (reportDate > to) return false;
      }
    }
    return true;
  });

  // Sắp xếp
  result.sort((a, b) => {
    const dateA = parseDateFromReport(a.thoi_gian) || 0;
    const dateB = parseDateFromReport(b.thoi_gian) || 0;
    if (filters.value.sortOrder === 'desc') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  return result;
})

const pendingCount = computed(() => filteredReports.value.filter(r => r.trang_thai === 'Chưa xử lý').length)
const completedCount = computed(() => filteredReports.value.filter(r => r.trang_thai === 'Hoàn thành').length)

// Watchers để đảm bảo dateFrom <= dateTo
watch(() => filters.value.dateFrom, (newVal) => {
  if (newVal && filters.value.dateTo && newVal > filters.value.dateTo) {
    filters.value.dateTo = newVal;
  }
})

watch(() => filters.value.dateTo, (newVal) => {
  if (newVal && filters.value.dateFrom && newVal < filters.value.dateFrom) {
    filters.value.dateFrom = newVal;
  }
})

const applyFilters = () => {
  // filteredReports là computed, nó sẽ tự động cập nhật giao diện khi filters thay đổi.
  // Chúng ta không cần gọi fetchReports() ở đây trừ khi muốn lọc từ server.
}

const isModalOpen = ref(false)
const isEditing = ref(false)
const formData = ref({
  id: '',
  phan_loai: 'CÔNG VIỆC',
  noi_dung: '',
  ghi_chu: '',
  tag: 'BÌNH THƯỜNG',
  trang_thai: 'Chưa xử lý'
})

const timeInputs = ref({
  hour: '00',
  minute: '00',
  thu: '2',
  day: '01',
  month: '01',
  year: '2026'
})

const daysInMonth = computed(() => {
  return new Date(Number(timeInputs.value.year), Number(timeInputs.value.month), 0).getDate();
})

let isUpdatingDateFromThu = false;
let isUpdatingThuFromDate = false;

watch(() => timeInputs.value.thu, (newThu) => {
  if (isUpdatingThuFromDate) return;
  isUpdatingDateFromThu = true;

  const { day, month, year } = timeInputs.value;
  const dObj = new Date(Number(year), Number(month) - 1, Number(day));
  const currentJsDay = dObj.getDay();
  
  // Tính khoảng cách từ thứ 2 (0: thứ 2, 1: thứ 3,... 6: chủ nhật)
  const offsetFromMonday = currentJsDay === 0 ? 6 : currentJsDay - 1;
  
  // Tìm ngày Thứ 2 của tuần hiện tại
  const mondayObj = new Date(dObj);
  mondayObj.setDate(dObj.getDate() - offsetFromMonday);
  
  // Tính khoảng cách của Thứ mới so với Thứ 2
  const targetThu = Number(newThu);
  const targetOffset = targetThu === 8 ? 6 : targetThu - 2;
  
  // Áp dụng khoảng cách mới để ra ngày tương ứng
  const targetDateObj = new Date(mondayObj);
  targetDateObj.setDate(mondayObj.getDate() + targetOffset);
  
  timeInputs.value.day = String(targetDateObj.getDate()).padStart(2, '0');
  timeInputs.value.month = String(targetDateObj.getMonth() + 1).padStart(2, '0');
  timeInputs.value.year = String(targetDateObj.getFullYear());

  // Nhả flag sau một chút để tránh vòng lặp watch
  setTimeout(() => { isUpdatingDateFromThu = false; }, 10);
})

watch([() => timeInputs.value.day, () => timeInputs.value.month, () => timeInputs.value.year], ([d, m, y]) => {
  if (isUpdatingDateFromThu) return;
  isUpdatingThuFromDate = true;

  let validDay = Number(d);
  const maxDay = new Date(Number(y), Number(m), 0).getDate();
  if (validDay > maxDay) validDay = maxDay; 

  const dObj = new Date(Number(y), Number(m) - 1, validDay);
  if (!isNaN(dObj.getTime())) {
    const thu = dObj.getDay();
    timeInputs.value.thu = String(thu === 0 ? 8 : thu + 1);
  }

  setTimeout(() => { isUpdatingThuFromDate = false; }, 10);
})

const getNowTimeInputs = () => {
  const now = new Date();
  const thu = now.getDay();
  return {
    hour: String(now.getHours()).padStart(2, '0'),
    minute: String(now.getMinutes()).padStart(2, '0'),
    thu: String(thu === 0 ? 8 : thu + 1),
    day: String(now.getDate()).padStart(2, '0'),
    month: String(now.getMonth() + 1).padStart(2, '0'),
    year: String(now.getFullYear())
  };
}

const parseTimeString = (timeStr) => {
  try {
    const parts = timeStr.split(' /');
    if (parts.length === 3) {
      const timePart = parts[0]; 
      const thuPart = parts[1].trim(); 
      const datePart = parts[2]; 
      
      const [hour, minute] = timePart.split(':');
      const [d, m, y] = datePart.split('/');
      
      return { 
        hour, minute, 
        thu: thuPart,
        day: d.padStart(2, '0'), 
        month: m.padStart(2, '0'), 
        year: y 
      };
    }
  } catch (e) {
    console.error("Lỗi parse ngày:", e);
  }
  return getNowTimeInputs();
}

const formatTimeString = () => {
  const { hour, minute, thu, day, month, year } = timeInputs.value;
  let validDay = Number(day);
  const maxDay = new Date(Number(year), Number(month), 0).getDate();
  if (validDay > maxDay) validDay = maxDay;

  const validDayStr = String(validDay).padStart(2, '0');
  
  return `${hour}:${minute} /${thu} /${validDayStr}/${month}/${year}`;
}

// Chia tags ra mảng để render giao diện đẹp hơn
const splitTags = (tagString) => {
  if (!tagString) return [];
  return tagString.split(',').map(t => t.trim()).filter(t => t);
}

// Fetch dữ liệu từ Google App Script
const fetchReports = async () => {
  if (API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
     console.warn("Vui lòng cập nhật API_URL của Google Apps Script.");
     // Dữ liệu mẫu tạm thời để xem giao diện
     reports.value = [
       { id: '1', phan_loai: 'CÔNG VIỆC', thoi_gian: '14:30 /3 /22/4/2026', noi_dung: 'Hoàn thiện báo cáo', ghi_chu: 'Gửi sếp lúc 5h', tag: 'ƯU TIÊN', trang_thai: 'Chưa xử lý' },
       { id: '2', phan_loai: 'ĐỜI SỐNG', thoi_gian: '09:15 /2 /21/4/2026', noi_dung: 'Mua cà phê', ghi_chu: '', tag: 'BÌNH THƯỜNG', trang_thai: 'Hoàn thành' }
     ];
     return;
  }

  loading.value = true
  try {
    const url = new URL(API_URL)
    url.searchParams.append('action', 'get')
    if (filters.value.tag) url.searchParams.append('tag', filters.value.tag)
    if (filters.value.phan_loai) url.searchParams.append('phan_loai', filters.value.phan_loai)
    if (filters.value.trang_thai) url.searchParams.append('trang_thai', filters.value.trang_thai)

    const response = await fetch(url.toString())
    const result = await response.json()
    if (result.status === 'success') {
      reports.value = result.data
    } else {
      alert('Lỗi khi tải dữ liệu: ' + result.message)
    }
  } catch (error) {
    console.error('Lỗi fetch data:', error)
  } finally {
    loading.value = false
  }
}

// Mở Modal
const openAddModal = () => {
  isEditing.value = false
  formData.value = {
    id: '',
    phan_loai: 'CÔNG VIỆC',
    noi_dung: '',
    ghi_chu: '',
    tag: 'BÌNH THƯỜNG',
    trang_thai: 'Chưa xử lý'
  }
  timeInputs.value = getNowTimeInputs();
  isModalOpen.value = true
}

const openEditModal = (report) => {
  isEditing.value = true
  formData.value = { ...report }
  timeInputs.value = parseTimeString(report.thoi_gian);
  isModalOpen.value = true
}

const closeModal = () => {
  if (saving.value) return; // Không đóng khi đang lưu
  isModalOpen.value = false
}

// Lưu (Thêm/Sửa)
const saveReport = async () => {
  if (API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
     alert("Vui lòng cập nhật API_URL của Google Apps Script để lưu thực tế.");
     closeModal();
     return;
  }

  formData.value.thoi_gian = formatTimeString();

  saving.value = true
  try {
    const action = isEditing.value ? 'update' : 'add'
    const payload = {
      action: action,
      ...formData.value
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    
    const result = await response.json()
    
    if (result.status === 'success') {
      isModalOpen.value = false
      saving.value = false
      fetchReports() 
    } else {
      alert('Lỗi lưu dữ liệu: ' + result.message)
    }
  } catch (error) {
    console.error('Lỗi khi lưu:', error)
    alert('Có lỗi xảy ra trong quá trình lưu dữ liệu.')
  } finally {
    saving.value = false
  }
}

// Đánh dấu hoàn thành nhanh từ List
const markAsCompleted = async (report) => {
  if (API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
     alert("Tính năng này cần cấu hình API_URL");
     return;
  }
  
  if (!confirm('Xác nhận đánh dấu báo cáo này là Hoàn thành?')) return;

  const originalStatus = report.trang_thai;
  report.trang_thai = 'Hoàn thành';
  
  try {
    const payload = {
      action: 'update',
      ...report
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    
    const result = await response.json()
    if (result.status !== 'success') {
      alert('Lỗi cập nhật: ' + result.message)
      report.trang_thai = originalStatus;
    }
  } catch (error) {
    console.error('Lỗi khi lưu:', error)
    report.trang_thai = originalStatus;
  }
}

// Xoá
const confirmDelete = async (id) => {
  if (API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
      alert("Tính năng xoá cần cấu hình API_URL");
      return;
  }
  
  if (confirm('Bạn có chắc chắn muốn xoá báo cáo này không? Hành động này không thể hoàn tác.')) {
    try {
      const response = await fetch(`${API_URL}?action=delete&id=${id}`)
      const result = await response.json()
      if (result.status === 'success') {
        fetchReports()
      } else {
        alert('Lỗi khi xoá: ' + result.message)
      }
    } catch (error) {
      console.error('Lỗi delete:', error)
    }
  }
}

// Helpers giao diện
const getCategoryClass = (cat) => {
  switch (cat?.toUpperCase()) {
    case 'CÔNG VIỆC': return 'cat-work'
    case 'ĐỜI SỐNG': return 'cat-life'
    default: return 'cat-default'
  }
}

const getStatusDotClass = (status) => {
  switch (status) {
    case 'Hoàn thành': return 'bg-emerald-500 shadow-emerald-500/50'
    case 'Chưa xử lý': return 'bg-amber-500 shadow-amber-500/50'
    default: return 'bg-slate-300'
  }
}

const getStatusPillClass = (status) => {
  switch (status) {
    case 'Hoàn thành': return 'pill-success'
    case 'Chưa xử lý': return 'pill-warning'
    default: return 'pill-default'
  }
}

const getTagClass = (tag) => {
  switch (tag?.toUpperCase()) {
    case 'ƯU TIÊN': return 'tag-priority'
    case 'BÌNH THƯỜNG': return 'tag-normal'
    default: return 'tag-default'
  }
}

const getStatusBorderClass = (status) => {
  switch (status) {
    case 'Hoàn thành': return 'border-status-success'
    case 'Chưa xử lý': return 'border-status-warning'
    default: return ''
  }
}

const isExportModalOpen = ref(false)
const exportInputs = ref({
  month: String(new Date().getMonth() + 1).padStart(2, '0'),
  year: String(new Date().getFullYear())
})

const exportExcel = () => {
  exportInputs.value.month = String(new Date().getMonth() + 1).padStart(2, '0');
  exportInputs.value.year = String(new Date().getFullYear());
  isExportModalOpen.value = true;
}

const doExportExcel = () => {
  const exportMonth = exportInputs.value.month;
  const exportYear = exportInputs.value.year;
  isExportModalOpen.value = false;

  const excelData = [
    ['BẢNG THEO DÕI CÔNG VIỆC', '', '', ''],
    [`THÁNG ${exportMonth}/${exportYear}`, '', '', ''],
    ['Công ty: Cổ Phần Tích Hợp Hệ Thống Nam Trường Sơn', '', '', ''],
    ['Nhân viên:  LÊ PHI SƠN', '', '', ''],
    ['', '', '', ''],
    ['Ngày', 'Thứ', 'Buổi sáng ', 'Buổi chiều']
  ];

  const daysInExportMonth = new Date(Number(exportYear), Number(exportMonth), 0).getDate();

  for (let d = 1; d <= daysInExportMonth; d++) {
    const dateObj = new Date(Number(exportYear), Number(exportMonth) - 1, d);
    const jsDay = dateObj.getDay();
    const thuStr = jsDay === 0 ? 'CN' : String(jsDay + 1);

    const targetDateStr = `${String(d).padStart(2, '0')}/${String(exportMonth).padStart(2, '0')}/${exportYear}`;
    
    const dayReports = reports.value.filter(r => 
      r.phan_loai === 'CÔNG VIỆC' && r.thoi_gian.includes(targetDateStr)
    );

    let morningTasks = [];
    let afternoonTasks = [];

    dayReports.forEach(r => {
      const parts = r.thoi_gian.split(' /');
      if (parts.length > 0) {
        const timePart = parts[0];
        const hour = parseInt(timePart.split(':')[0], 10);
        
        if (hour >= 6 && hour <= 12) {
          morningTasks.push(r.noi_dung);
        } else if (hour > 12) {
          afternoonTasks.push(r.noi_dung);
        }
      }
    });

    excelData.push([
      d,
      thuStr,
      morningTasks.length > 0 ? morningTasks.join('\n') : '',
      afternoonTasks.length > 0 ? afternoonTasks.join('\n') : ''
    ]);
  }

  // Footer: 4 dòng liên tục có border, merge 4 cột
  const footerStartRow = excelData.length;
  excelData.push(['Nhận xét của Trưởng bộ phận', '', '', '']);
  excelData.push(['', '', '', '']);
  excelData.push(['Nhận xét của BGĐ', '', '', '']);
  excelData.push(['', '', '', '']);

  const ws = XLSX.utils.aoa_to_sheet(excelData);
  
  // Định dạng style
  const borderAll = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" }
  };

  const titleStyle = { font: { bold: true, sz: 14, name: "Times New Roman" }, alignment: { horizontal: "center", vertical: "center" } };
  const subtitleStyle = { font: { bold: true, sz: 12, name: "Times New Roman" }, alignment: { horizontal: "center", vertical: "center" } };
  const infoStyle = { font: { bold: true, sz: 12, name: "Times New Roman" }, alignment: { horizontal: "left", vertical: "center" } };
  const headerStyle = { font: { bold: true, sz: 12, name: "Times New Roman" }, alignment: { horizontal: "center", vertical: "center", wrapText: true }, border: borderAll };
  const dateStyle = { font: { sz: 12, name: "Times New Roman" }, alignment: { horizontal: "center", vertical: "center", wrapText: true }, border: borderAll };
  const contentStyle = { font: { sz: 12, name: "Times New Roman" }, alignment: { horizontal: "left", vertical: "center", wrapText: true }, border: borderAll };
  const contentEmptyStyle = { font: { sz: 12, name: "Times New Roman" }, alignment: { horizontal: "left", vertical: "center", wrapText: true }, border: borderAll, fill: { fgColor: { rgb: "B8CCE4" } } };
  const footerLabelStyle = { font: { bold: true, sz: 12, name: "Times New Roman" }, alignment: { horizontal: "left", vertical: "center" }, border: borderAll };
  const footerEmptyStyle = { font: { sz: 12, name: "Times New Roman" }, border: borderAll };

  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
      
      const cell = ws[cellAddress];
      if (R === 0) cell.s = titleStyle;
      else if (R === 1) cell.s = subtitleStyle;
      else if (R === 2 || R === 3) cell.s = infoStyle;
      else if (R === 5) cell.s = headerStyle;
      else if (R > 5 && R <= 5 + daysInExportMonth) {
        if (C === 0 || C === 1) cell.s = dateStyle;
        else {
          // Cột buổi sáng / buổi chiều: trống thì tô màu xanh nhạt
          cell.s = (!cell.v || cell.v === '') ? contentEmptyStyle : contentStyle;
        }
      } else if (R >= footerStartRow) {
        // Footer rows: tất cả đều có border
        if (R === footerStartRow || R === footerStartRow + 2) {
          cell.s = footerLabelStyle; // Dòng có text: in đậm + border
        } else {
          cell.s = footerEmptyStyle; // Dòng trống: chỉ border
        }
      }
    }
  }

  // Gộp ô (Merge cells)
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Title
    { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, // Subtitle
    { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } }, // Info 1
    { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } }, // Info 2
    // Footer: merge 4 dòng
    { s: { r: footerStartRow, c: 0 }, e: { r: footerStartRow, c: 3 } },
    { s: { r: footerStartRow + 1, c: 0 }, e: { r: footerStartRow + 1, c: 3 } },
    { s: { r: footerStartRow + 2, c: 0 }, e: { r: footerStartRow + 2, c: 3 } },
    { s: { r: footerStartRow + 3, c: 0 }, e: { r: footerStartRow + 3, c: 3 } },
  ];

  ws['!cols'] = [
    { wch: 8 }, 
    { wch: 8 }, 
    { wch: 60 }, 
    { wch: 60 }  
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Báo Cáo");
  
  XLSX.writeFile(wb, `Bao_Cao_Cong_Viec_${exportMonth}_${exportYear}.xlsx`);
}

onMounted(() => {
  fetchReports()
})
</script>

<style scoped>
/* =========================================
   THIẾT KẾ: MODERN, CLEAN & PREMIUM 
   Dựa trên CSS thuần, với Micro-animations
========================================= */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.report-container {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 2rem 2.5rem;
  background-color: #f8fafc;
  min-height: 100vh;
  color: #0f172a;
  box-sizing: border-box;
}

/* --- HEADER --- */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.title-section h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.025em;
}

.title-section .subtitle {
  color: #64748b;
  margin: 0;
  font-size: 0.95rem;
}

/* --- BUTTONS --- */
button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  color: white;
  padding: 0.8rem 1.5rem;
  box-shadow: 0 4px 12px -2px rgba(79, 70, 229, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -2px rgba(79, 70, 229, 0.4);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #334155;
  padding: 0.75rem 1.5rem;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
  color: #0f172a;
}

.btn-excel {
  background-color: #10b981;
  color: white;
  padding: 0.8rem 1.5rem;
  box-shadow: 0 4px 12px -2px rgba(16, 185, 129, 0.3);
}

.btn-excel:hover {
  background-color: #059669;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -2px rgba(16, 185, 129, 0.4);
}

/* --- FILTERS --- */
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;
}

.filter-group {
  position: relative;
  flex: 2;
}

.filter-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.filter-group input {
  width: 100%;
  padding-left: 2.75rem !important;
}

.filters input, .filters select {
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  outline: none;
  font-size: 0.95rem;
  color: #334155;
  transition: all 0.2s;
  background-color: #f8fafc;
}

.filters select {
  flex: 1;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.filters input:focus, .filters select:focus {
  border-color: #6366f1;
  background-color: white;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

/* --- TABLE --- */
.table-wrapper {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.02), 0 4px 6px -4px rgba(0, 0, 0, 0.01);
  border: 1px solid #f1f5f9;
  overflow-x: auto;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.report-table th {
  background-color: #f8fafc;
  padding: 1.25rem 1.5rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
}

.report-table td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  font-size: 0.95rem;
  color: #334155;
}

.animate-row {
  animation: fadeIn 0.4s ease forwards;
  opacity: 0;
}

.report-table tr:nth-child(1) { animation-delay: 0.05s; }
.report-table tr:nth-child(2) { animation-delay: 0.1s; }
.report-table tr:nth-child(3) { animation-delay: 0.15s; }
.report-table tr:nth-child(4) { animation-delay: 0.2s; }
.report-table tr:nth-child(5) { animation-delay: 0.25s; }

.report-table tr:last-child td {
  border-bottom: none;
}

.report-table tr:hover td {
  background-color: #f8fafc;
}

.col-time {
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 500;
}

.col-content {
  line-height: 1.5;
  color: #0f172a;
  font-weight: 500;
}

.col-note {
  color: #64748b;
  font-size: 0.85rem;
}

.text-right {
  text-align: right;
}

.btn-icon {
  background: transparent;
  padding: 0.5rem;
  border-radius: 8px;
  color: #94a3b8;
  margin-left: 0.5rem;
}

.btn-icon:hover {
  background-color: #f1f5f9;
}

.btn-icon.edit:hover { color: #3b82f6; background-color: #eff6ff; }
.btn-icon.delete:hover { color: #ef4444; background-color: #fef2f2; }

/* --- BADGES & TAGS & STATUS --- */
/* Desktop Badge solid styles */
.badge {
  padding: 0.35rem 0.85rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white !important;
  border: none;
}

.badge.cat-work { background-color: #3b82f6; }
.badge.cat-life { background-color: #10b981; }
.badge.cat-default { background-color: #94a3b8; }

.tag {
  color: white !important;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  border: none;
}

.tag.tag-priority { background-color: #e11d48; }
.tag.tag-normal { background-color: #64748b; }
.tag.tag-default { background-color: #94a3b8; }

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag {
  background-color: #f1f5f9;
  color: #475569;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #e2e8f0;
}

.status-container {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid #e2e8f0;
  font-weight: 500;
  font-size: 0.85rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(255,255,255,1), 0 0 4px 1px currentColor;
}

.bg-emerald-500 { background-color: #10b981; }
.shadow-emerald-500\/50 { box-shadow: 0 0 6px rgba(16, 185, 129, 0.5); }

.bg-amber-500 { background-color: #f59e0b; }
.shadow-amber-500\/50 { box-shadow: 0 0 6px rgba(245, 158, 11, 0.5); }

.bg-slate-400 { background-color: #94a3b8; }
.shadow-slate-400\/50 { box-shadow: 0 0 6px rgba(148, 163, 184, 0.5); }


/* --- MODAL --- */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease forwards;
}

.modal {
  background: white;
  width: calc(100% - 2rem);
  max-width: 600px;
  max-height: 95vh;
  overflow-y: auto;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.modal-header h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1.5rem;
  font-weight: 700;
}

.btn-close {
  background: transparent;
  color: #94a3b8;
  padding: 0.5rem;
  border-radius: 50%;
}

.btn-close:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.form-group {
  margin-bottom: 0.75rem;
}

.form-group.row {
  display: flex;
  gap: 1rem;
}

.form-group.row .col {
  flex: 1;
}

label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.5rem;
}

.required { color: #ef4444; }
.hint { color: #94a3b8; font-weight: 400; font-size: 0.75rem; }

input[type="text"], textarea, select {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.95rem;
  color: #1e293b;
  transition: all 0.2s;
  box-sizing: border-box;
  background-color: #f8fafc;
}

textarea {
  resize: vertical;
  line-height: 1.5;
}

.select-wrapper {
  position: relative;
}

.select-wrapper select {
  appearance: none;
  cursor: pointer;
}

.select-wrapper::after {
  content: '';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  pointer-events: none;
}

input:focus, textarea:focus, select:focus {
  border-color: #6366f1;
  background-color: white;
  outline: none;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.btn-cancel {
  background: transparent;
  color: #64748b;
  padding: 0.8rem 1.5rem;
}

.btn-cancel:hover {
  background: #f1f5f9;
  color: #0f172a;
}

/* --- STATES (Loading, Empty) --- */
.loading-state, .empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-state svg {
  color: #cbd5e1;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}

/* --- ANIMATIONS --- */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* --- RESPONSIVE --- */
@media (max-width: 1024px) {
  .report-container { padding: 1.5rem; }
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  .form-group.row {
    flex-direction: row; /* Keep as row to save height */
    gap: 1rem;
  }
  .report-table {
    display: block;
  }
  .report-table th, .report-table td {
    white-space: nowrap;
  }
}
/* --- TIME PICKER --- */
.time-picker-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}
.time-box {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #f8fafc;
  padding: 0.25rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
}
.time-box:focus-within {
  border-color: #6366f1;
  background-color: white;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}
.small-select select {
  padding: 0.3rem 1.25rem 0.3rem 0.4rem;
  border: none;
  background-color: transparent;
  box-shadow: none !important;
  font-weight: 600;
  font-size: 0.95rem;
  min-width: 50px;
}
.small-select select:focus {
  box-shadow: none;
  background-color: transparent;
}
.colon {
  font-weight: bold;
  color: #475569;
}
.date-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}
.date-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.95rem;
  color: #1e293b;
  background-color: #f8fafc;
  outline: none;
  transition: all 0.2s;
}
.date-input:focus {
  border-color: #6366f1;
  background-color: white;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}
.day-badge {
  background-color: #e0e7ff;
  color: #4338ca;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
}
.slash {
  font-weight: bold;
  color: #94a3b8;
}
.picker-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}
.item-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.mt-label {
  margin-top: 1rem;
}
.day-badge-wrapper {
  height: 38px;
  display: flex;
  align-items: center;
}
.status-toggle-btns {
  display: flex;
  gap: 0.5rem;
  background: #f8fafc;
  padding: 0.35rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
}
.btn-toggle {
  flex: 1;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  transition: all 0.2s;
  box-shadow: none;
}
.btn-toggle:hover {
  background: #e2e8f0;
  color: #334155;
}
.btn-toggle.active-success {
  background: #10b981;
  color: white;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}
.btn-toggle.active-warning {
  background: #f59e0b;
  color: white;
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
}
.btn-icon.success {
  color: #10b981;
}
.btn-icon.success:hover {
  background-color: #d1fae5;
  color: #047857;
}
.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s;
}
.clickable-row:hover {
  background-color: #f1f5f9 !important;
}
.col-index {
  font-weight: 700;
  color: #64748b;
  font-size: 0.95rem;
  text-align: center;
}
.header-actions {
  display: flex;
  gap: 1rem;
}
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* --- STAT CARDS --- */
.stats-row {
  display: flex;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}
.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 8px -2px rgba(0,0,0,0.04);
  transition: all 0.2s;
}
.stat-card:hover {
  box-shadow: 0 4px 16px -4px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-icon.total {
  background: #eff6ff;
  color: #3b82f6;
}
.stat-icon.pending {
  background: #fef3c7;
  color: #f59e0b;
}
.stat-icon.done {
  background: #d1fae5;
  color: #10b981;
}
.stat-info {
  display: flex;
  flex-direction: column;
}
.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}
.stat-label {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-top: 0.2rem;
}

/* Date filter */
.date-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.date-filter label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
  white-space: nowrap;
}
.date-filter input[type="date"] {
  padding: 0.65rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  outline: none;
  font-size: 0.9rem;
  color: #334155;
  background-color: #f8fafc;
  transition: all 0.2s;
  font-family: inherit;
}
.date-filter input[type="date"]:focus {
  border-color: #6366f1;
  background-color: white;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

/* --- MOBILE CARD VIEW --- */
.mobile-only { display: none !important; }
.desktop-only { display: block; }

@media (max-width: 768px) {
  input, select, textarea {
    font-size: 16px !important;
  }
  .desktop-only { display: none !important; }
  .mobile-only { display: flex !important; flex-direction: column; gap: 0.75rem; }

  .report-container {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions button {
    flex: 1;
  }

  .title-section h1 {
    font-size: 1.5rem;
  }

  .filters {
    flex-direction: column;
  }

  .filters select {
    width: 100%;
  }

  .stats-row {
    flex-direction: column;
    gap: 0.75rem;
  }

  .date-filter {
    flex-wrap: wrap;
  }

  .date-filter input[type="date"] {
    flex: 1;
    min-width: 0;
  }
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.report-card {
  background: white;
  border-radius: 20px;
  padding: 1.25rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 4px 12px -2px rgba(0,0,0,0.03);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.pill-success { background: #10b981 !important; color: white !important; }
.pill-warning { background: #f59e0b !important; color: white !important; }
.pill-default { background: #94a3b8 !important; color: white !important; }

.status-pill-tag {
  display: inline-flex;
  padding: 0.35rem 0.85rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.status-pill-mini {
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  text-transform: uppercase;
  color: white !important;
}

.report-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -8px rgba(0,0,0,0.1);
  border-color: #e2e8f0;
}

.border-status-success { border-left: 5px solid #10b981 !important; }
.border-status-warning { border-left: 5px solid #f59e0b !important; }

/* --- NEW CARD STYLES (REARRANGED) --- */
.card-row-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.card-time-group {
  flex: 1;
}

.time-primary {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 700;
  color: #1e293b;
  font-size: 0.95rem;
}

.time-primary svg { color: #6366f1; }

.time-secondary {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 0.1rem;
}



.card-row-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.card-row-content {
  margin-bottom: 0.75rem;
}

.content-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
}

.card-row-note {
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  border-left: 3px solid #e2e8f0;
}

.content-note {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  font-style: italic;
  line-height: 1.5;
}

.content-note svg {
  margin-top: 0.2rem;
  flex-shrink: 0;
  opacity: 0.7;
}

.card-row-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
}

.btn-action-full {
  flex: 1;
  padding: 0.6rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  transition: all 0.2s;
}

.btn-action-full.success {
  background: #10b981;
  color: white;
  border: 1px solid #059669;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

.btn-action-full.delete {
  background: #ef4444;
  color: white;
  border: 1px solid #dc2626;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
}

.btn-action-full:active {
  transform: scale(0.95);
  box-shadow: none;
}

.category-badge {
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  color: white;
}

.cat-work { background: #3b82f6; }
.cat-life { background: #10b981; }
.cat-default { background: #94a3b8; }

.tag-mini {
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  color: white;
}

.tag-priority { background: #e11d48; }
.tag-normal { background: #64748b; }
.tag-default { background: #94a3b8; }
.filters {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px -2px rgba(0,0,0,0.04);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  margin-bottom: 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: #64748b;
}

.filter-group select {
  min-width: 160px;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8fafc;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.filter-actions {
  margin-left: auto;
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  .filter-actions {
    margin-left: 0;
  }
  .date-filter {
    flex-direction: column;
    align-items: stretch;
  }
  .modal {
    padding: 1.25rem;
    padding-bottom: 1.5rem;
    border-radius: 16px;
    width: calc(100% - 1.5rem);
  }
  .modal-actions {
    margin-top: 1rem;
    padding-top: 0.75rem;
  }
  .modal-header {
    margin-bottom: 0.75rem;
  }
}
</style>
