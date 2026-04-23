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

    <!-- Elite Filters -->
    <div class="elite-filter-panel">
      <div class="elite-filter-accent"></div>
      <div class="elite-filter-header">
        <div class="elite-filter-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          <span>Bộ lọc nâng cao</span>
        </div>
        <button class="elite-refresh-btn" @click="fetchReports">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 2v6h6M21.5 22v-6h-6"/><path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2"/></svg>
          Làm mới
        </button>
      </div>

      <div class="elite-filter-body">
        <div class="elite-filter-row">
          <div class="elite-date-group group-tabs" style="flex: 0 0 auto; min-width: auto; max-width: none;">
            <label style="opacity: 0; user-select: none;" class="mobile-hidden-label">Chế độ</label>
            <div class="elite-mode-tabs">
              <button type="button" :class="{ active: filters.filterMode === 'day' }" @click="filters.filterMode = 'day'">Ngày</button>
              <button type="button" :class="{ active: filters.filterMode === 'month' }" @click="filters.filterMode = 'month'">Tháng</button>
              <button type="button" :class="{ active: filters.filterMode === 'year' }" @click="filters.filterMode = 'year'">Năm</button>
            </div>
          </div>

          <div class="elite-date-group group-period" style="min-width: 90px; max-width: 120px;">
            <label>Buổi</label>
            <CustomSelect v-model="filters.period" :options="periodOptions" />
          </div>

          <template v-if="filters.filterMode === 'day'">
            <div class="elite-date-group group-date">
              <label>Từ ngày</label>
              <input type="date" v-model="filters.dateFrom" :max="filters.dateTo" @change="fetchReports" @click="e => e.target.showPicker && e.target.showPicker()" class="elite-input" />
            </div>
            <span class="elite-range-sep">→</span>
            <div class="elite-date-group group-date">
              <label>Đến ngày</label>
              <input type="date" v-model="filters.dateTo" :min="filters.dateFrom" @change="fetchReports" @click="e => e.target.showPicker && e.target.showPicker()" class="elite-input" />
            </div>
          </template>

          <template v-if="filters.filterMode === 'month'">
            <div class="elite-date-group group-date">
              <label>Từ tháng</label>
              <input type="month" v-model="filters.monthFrom" :max="filters.monthTo" @change="fetchReports" @click="e => e.target.showPicker && e.target.showPicker()" class="elite-input" />
            </div>
            <span class="elite-range-sep">→</span>
            <div class="elite-date-group group-date">
              <label>Đến tháng</label>
              <input type="month" v-model="filters.monthTo" :min="filters.monthFrom" @change="fetchReports" @click="e => e.target.showPicker && e.target.showPicker()" class="elite-input" />
            </div>
          </template>

          <template v-if="filters.filterMode === 'year'">
            <div class="elite-date-group group-date">
              <label>Từ năm</label>
              <input type="number" v-model="filters.yearFrom" :max="filters.yearTo" @change="fetchReports" placeholder="2024" class="elite-input" />
            </div>
            <span class="elite-range-sep">→</span>
            <div class="elite-date-group group-date">
              <label>Đến năm</label>
              <input type="number" v-model="filters.yearTo" :min="filters.yearFrom" @change="fetchReports" placeholder="2025" class="elite-input" />
            </div>
          </template>
        </div>

        <div class="elite-filter-divider"></div>

        <div class="elite-filter-row">
          <div class="elite-select-group">
            <label>Sắp xếp</label>
            <CustomSelect v-model="filters.sortOrder" :options="sortOptions" />
          </div>
          <div class="elite-select-group">
            <label>Độ quan trọng</label>
            <CustomSelect v-model="filters.tag" :options="priorityOptions" />
          </div>
          <div class="elite-select-group">
            <label>Phân loại</label>
            <CustomSelect v-model="filters.phan_loai" :options="typeOptions" />
          </div>
          <div class="elite-select-group">
            <label>Trạng thái</label>
            <CustomSelect v-model="filters.trang_thai" :options="statusOptions" />
          </div>
        </div>
      </div>
    </div>

    <!-- Thẻ thống kê -->
    <div class="stats-row">
      <div class="stat-card card-total" 
           :class="{ 'elite-active': filters.trang_thai === 'Tất cả' || !filters.trang_thai }"
           @click="onCardClick('Tất cả')">
        <div class="stat-icon total">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">Tổng cộng</span>
          <span class="stat-value">{{ totalCount }} <span class="unit-text">việc</span></span>
        </div>
      </div>
      <div class="stat-card card-pending" 
           :class="{ 'elite-active': filters.trang_thai === 'Chưa xử lý' }"
           @click="onCardClick('Chưa xử lý')">
        <div class="stat-icon pending">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">Chưa hoàn thành</span>
          <span class="stat-value">{{ pendingCount }} <span class="unit-text">việc</span></span>
        </div>
      </div>
      <div class="stat-card card-done" 
           :class="{ 'elite-active': filters.trang_thai === 'Hoàn thành' }"
           @click="onCardClick('Hoàn thành')">
        <div class="stat-icon done">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">Đã hoàn thành</span>
          <span class="stat-value">{{ completedCount }} <span class="unit-text">việc</span></span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-bar">
      <button class="mobile-action-btn empty-days" @click="showEmptyDays">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        Báo lịch trống
      </button>
      <button class="mobile-action-btn excel" @click="exportExcel">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Xuất Excel
      </button>
      <button class="mobile-action-btn add" @click="openAddModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Thêm mới
      </button>
    </div>

    <!-- Bảng Dữ Liệu (PC) -->
    <div ref="tableSection">
      <!-- Bảng Dữ Liệu (PC) -->
      <div class="elite-table-container desktop-only">
        <div class="elite-table-toolbar">
          <div class="toolbar-left">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line></svg>
            <h3>DANH SÁCH BÁO CÁO</h3>
          </div>
          <div class="toolbar-right">
            <span class="record-badge">{{ filteredReports.length }} việc</span>
          </div>
        </div>
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Đang tải dữ liệu báo cáo...</p>
        </div>
        <div v-else class="elite-table-scroll">
          <table class="elite-table">
            <thead>
              <tr>
                <th width="5%">STT</th>
                <th width="15%">Thời Gian</th>
                <th width="10%">Phân Loại</th>
                <th width="20%">Nội Dung</th>
                <th width="15%">Ghi Chú</th>
                <th width="10%">Độ Quan Trọng</th>
                <th width="10%">Trạng Thái</th>
                <th width="10%">  Created_time</th>
                <th width="5%" class="text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredReports.length === 0">
                <td colspan="9" class="empty-state">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>
                  <p>Không có báo cáo nào khớp với tìm kiếm của bạn.</p>
                </td>
              </tr>
              <tr v-for="(report, index) in filteredReports" :key="report.id" class="elite-row" :class="{ 'highlight-row': report.id === highlightedReportId, 'deleting-row': deletingIds.includes(report.id) }" @click="openEditModal(report)">
                <td><span class="row-index">{{ index + 1 }}</span></td>
                <td>
                  <div class="elite-time-cell">
                    <div class="elite-time-main">
                      <span class="elite-time-hm">{{ formatDisplayTime(report.thoi_gian).time }}</span>
                      <span class="elite-time-thu">{{ formatDisplayTime(report.thoi_gian).thu }}</span>
                      <span class="elite-time-period" :class="formatDisplayTime(report.thoi_gian).period === 'Sáng' ? 'is-morning' : 'is-afternoon'">
                        {{ formatDisplayTime(report.thoi_gian).period }}
                      </span>
                    </div>
                    <div class="elite-time-date">{{ formatDisplayTime(report.thoi_gian).date }}</div>
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
                  <div class="status-pill-tag" :class="getStatusPillClass(report.trang_thai)">{{ report.trang_thai || 'N/A' }}</div>
                </td>
                <td style="font-size: 0.8rem; color: #64748b;">
                  {{ report.created_time || '' }}
                </td>
                <td class="col-actions text-right">
                  <button v-if="report.trang_thai !== 'Hoàn thành'" class="elite-action-btn success" @click.stop="markAsCompleted(report)" title="Hoàn thành">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </button>
                  <button class="elite-action-btn delete" @click.stop="confirmDelete(report.id)" title="Xoá">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card-list mobile-only">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Đang tải dữ liệu báo cáo...</p>
        </div>
        <div v-else-if="filteredReports.length === 0" class="empty-state" style="padding: 3rem;">
          <p>Không có báo cáo nào.</p>
        </div>
        <div v-else v-for="(report, index) in filteredReports" :key="'card-' + report.id" 
             class="report-card" :class="[getStatusBorderClass(report.trang_thai), { 'highlight-card': report.id === highlightedReportId, 'deleting-row': deletingIds.includes(report.id) }]" @click="openEditModal(report)">
          
          <!-- Hàng 1: STT & Thời gian -->
          <div class="card-row-header">
            <span class="card-id">#{{ index + 1 }}</span>
            <div class="card-time-group">
              <div class="time-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>{{ formatDisplayTime(report.thoi_gian).time }}</span>
                <span class="period-tag-mini" :class="formatDisplayTime(report.thoi_gian).period === 'Sáng' ? 'is-morning' : 'is-afternoon'">
                  {{ formatDisplayTime(report.thoi_gian).period }}
                </span>
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
            <button class="btn-action-full delete" @click.stop="confirmDelete(report.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              <span>Xoá</span>
            </button>
            <button v-if="report.trang_thai !== 'Hoàn thành'" class="btn-action-full success" @click.stop="markAsCompleted(report)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Hoàn thành</span>
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Elite Modal Form -->
    <div class="elite-modal-overlay" v-if="isModalOpen" @click.self="closeModal">
      <div class="elite-modal">
        <div class="elite-modal-header">
          <div class="elite-modal-title-wrapper" style="display: flex; flex-direction: column; gap: 0.25rem;">
            <div class="elite-modal-title">
              <svg v-if="!isEditing" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              <h2>{{ isEditing ? 'Chỉnh Sửa Báo Cáo' : 'Thêm Báo Cáo Mới' }}</h2>
            </div>
            <div v-if="isEditing && formData.created_time" class="mobile-only" style="font-size: 0.75rem; color: #64748b; font-style: italic; margin-left: 1.8rem;">
              Được tạo lúc: {{ formData.created_time }}
            </div>
          </div>
          <button class="elite-btn-close" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <form @submit.prevent="saveReport" class="elite-modal-body">
          <div class="elite-form-row">
            <div class="elite-form-group">
              <label>Phân Loại</label>
              <select v-model="formData.phan_loai" class="elite-select">
                <option value="CÔNG VIỆC">CÔNG VIỆC</option>
                <option value="ĐỜI SỐNG">ĐỜI SỐNG</option>
              </select>
            </div>
            <div class="elite-form-group">
              <label>Độ quan trọng</label>
              <select v-model="formData.tag" class="elite-select">
                <option value="BÌNH THƯỜNG">BÌNH THƯỜNG</option>
                <option value="ƯU TIÊN">ƯU TIÊN</option>
              </select>
            </div>
          </div>

          <div class="elite-form-group">
            <label>Thời Gian</label>
            <div class="elite-quick-times">
              <button type="button" class="elite-quick-btn" :class="{ active: isMorning }" @click="setMorningTime">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                SÁNG
              </button>
              <button type="button" class="elite-quick-btn" :class="{ active: isAfternoon }" @click="setAfternoonTime">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                CHIỀU
              </button>
            </div>
            
            <div class="elite-time-picker">
              <div class="time-part">
                <div class="picker-item">
                  <span>Giờ</span>
                  <select v-model="timeInputs.hour" class="elite-select-mini">
                    <option v-for="h in 24" :key="h" :value="String(h-1).padStart(2, '0')">{{ String(h-1).padStart(2, '0') }}</option>
                  </select>
                </div>
                <span class="time-sep">:</span>
                <div class="picker-item">
                  <span>Phút</span>
                  <select v-model="timeInputs.minute" class="elite-select-mini">
                    <option v-for="m in 60" :key="m" :value="String(m-1).padStart(2, '0')">{{ String(m-1).padStart(2, '0') }}</option>
                  </select>
                </div>
              </div>
              
              <div class="date-part">
                <div class="picker-item">
                  <span>Thứ</span>
                  <select v-model="timeInputs.thu" class="elite-select-mini">
                    <option value="2">Thứ 2</option>
                    <option value="3">Thứ 3</option>
                    <option value="4">Thứ 4</option>
                    <option value="5">Thứ 5</option>
                    <option value="6">Thứ 6</option>
                    <option value="7">Thứ 7</option>
                    <option value="8">CN</option>
                  </select>
                </div>
                <div class="picker-item">
                  <span>Ngày</span>
                  <select v-model="timeInputs.day" class="elite-select-mini">
                    <option v-for="d in daysInMonth" :key="d" :value="String(d).padStart(2, '0')">{{ String(d).padStart(2, '0') }}</option>
                  </select>
                </div>
                <span class="date-sep">/</span>
                <div class="picker-item">
                  <span>Tháng</span>
                  <select v-model="timeInputs.month" class="elite-select-mini">
                    <option v-for="m in 12" :key="m" :value="String(m).padStart(2, '0')">{{ String(m).padStart(2, '0') }}</option>
                  </select>
                </div>
                <span class="date-sep">/</span>
                <div class="picker-item">
                  <span>Năm</span>
                  <select v-model="timeInputs.year" class="elite-select-mini">
                    <option v-for="y in 20" :key="y" :value="String(2023 + y)">{{ 2023 + y }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div class="elite-form-group">
            <div class="form-group-header">
              <label>Nội Dung <span class="required">*</span></label>
              <div class="header-actions-group">
                <button type="button" class="elite-voice-btn" @click="startVoiceRecognition('noi_dung')" :class="{ 'is-recording': isRecordingVoice === 'noi_dung' }" title="Nhập liệu bằng giọng nói">
                  <svg v-if="isRecordingVoice !== 'noi_dung'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12"></rect></svg>
                </button>
                <button type="button" class="elite-quote-btn" @click="openCustomerModal">
                  BÁO GIÁ
                </button>
              </div>
            </div>
            <textarea v-model="formData.noi_dung" required placeholder="Mô tả chi tiết nội dung báo cáo..." rows="3" class="elite-input"></textarea>
          </div>

          <div class="elite-form-group">
            <div class="form-group-header">
              <label>Ghi Chú</label>
              <button type="button" class="elite-voice-btn" @click="startVoiceRecognition('ghi_chu')" :class="{ 'is-recording': isRecordingVoice === 'ghi_chu' }" title="Nhập liệu bằng giọng nói">
                <svg v-if="isRecordingVoice !== 'ghi_chu'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12"></rect></svg>
              </button>
            </div>
            <textarea v-model="formData.ghi_chu" placeholder="Các ghi chú bổ sung nếu có..." rows="1" class="elite-input"></textarea>
          </div>

          <div class="elite-form-group" v-if="isEditing">
            <label>Trạng Thái</label>
            <div class="elite-status-toggle">
              <button 
                type="button" 
                :class="['toggle-btn', formData.trang_thai === 'Hoàn thành' ? 'active-success' : '']"
                @click="formData.trang_thai = 'Hoàn thành'"
              >
                Hoàn thành
              </button>
              <button 
                type="button" 
                :class="['toggle-btn', formData.trang_thai === 'Chưa xử lý' ? 'active-warning' : '']"
                @click="formData.trang_thai = 'Chưa xử lý'"
              >
                Chưa xử lý
              </button>
            </div>
          </div>

          <div class="elite-modal-actions form-actions-grid">
            <button type="button" class="elite-btn-cancel" @click="closeModal" :disabled="saving">Huỷ Bỏ</button>
            <button v-if="!isEditing" type="button" class="btn-add-empty" @click="saveReport({ openEmpty: true })" :disabled="saving">
              THÊM & LÀM TIẾP MỤC TRỐNG
            </button>
            <button v-if="!isEditing" type="button" class="btn-add-continue" @click="saveReport({ continue: true })" :disabled="saving">
              <span v-if="saving" class="spinner-small"></span>
              THÊM & LÀM TIẾP
            </button>
            <button v-if="!isEditing || hasChanges" type="submit" class="elite-btn-primary btn-add-primary" :disabled="saving">
              <span v-if="saving" class="spinner-small"></span>
              <template v-if="saving">
                {{ isEditing ? 'Đang Lưu...' : 'Đang Thêm...' }}
              </template>
              <template v-else>
                {{ isEditing ? 'Lưu Báo Cáo' : 'THÊM & XONG' }}
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Chọn Tháng/Năm Tải Excel -->
    <div class="elite-modal-overlay" v-if="isExportModalOpen" @click.self="isExportModalOpen = false">
      <div class="elite-modal" style="max-width: 420px;">
        <div class="elite-modal-header">
          <div class="elite-modal-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <h2>Tải Báo Cáo Excel</h2>
          </div>
          <button class="elite-btn-close" @click="isExportModalOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="elite-modal-body">
          <div class="elite-form-row" style="gap: 1rem;">
            <div class="elite-form-group" style="flex: 1;">
              <label>Tháng</label>
              <select v-model="exportInputs.month" class="elite-select">
                <option v-for="m in 12" :key="m" :value="String(m).padStart(2, '0')">Tháng {{ m }}</option>
              </select>
            </div>
            <div class="elite-form-group" style="flex: 1;">
              <label>Năm</label>
              <select v-model="exportInputs.year" class="elite-select">
                <option v-for="y in 20" :key="y" :value="String(2023 + y)">{{ 2023 + y }}</option>
              </select>
            </div>
          </div>
          <div class="elite-modal-actions">
            <button type="button" class="elite-btn-cancel" @click="isExportModalOpen = false">Huỷ Bỏ</button>
            <button type="button" class="elite-btn-primary" @click="doExportExcel">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Tải Xuống
            </button>
          </div>
        </div>
      </div>
    </div>



    <!-- Modal Chọn Khách Hàng -->
    <div class="elite-modal-overlay" v-if="showCustomerModal" @click.self="showCustomerModal = false">
      <div class="elite-modal" style="max-width: 550px; display: flex; flex-direction: column; max-height: 85vh;">
        <div class="elite-modal-header" style="flex-shrink: 0;">
          <div class="elite-modal-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <h2>Chọn Khách Hàng</h2>
          </div>
          <button class="elite-btn-close" @click="showCustomerModal = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="elite-modal-body" style="flex: 1; overflow-y: hidden; display: flex; flex-direction: column; gap: 1.2rem;">
          <div class="elite-form-group" style="margin-bottom: 0; flex-shrink: 0;">
            <input type="text" v-model="customerSearch" placeholder="Tìm tên khách hàng hoặc công ty..." class="elite-input" style="width: 100%; box-sizing: border-box; padding: 0.8rem 1.2rem; border-radius: 9999px;" />
          </div>
          
          <div style="max-height: 240px; overflow-y: auto; border: 1.5px solid #e2e8f0; border-radius: 16px; background: rgba(248, 250, 252, 0.6); margin-bottom: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div v-if="loadingCustomers" style="padding: 3rem 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;">
              <span style="color: #10b981; font-weight: 600; font-size: 0.95rem; letter-spacing: 0.02em;">Đang tải dữ liệu khách hàng...</span>
              <div style="width: 100%; max-width: 200px; height: 6px; background: #e2e8f0; border-radius: 999px; overflow: hidden; position: relative;">
                <div style="position: absolute; top: 0; left: 0; height: 100%; background: #10b981; border-radius: 999px; animation: progress-indeterminate 1.5s infinite ease-in-out;"></div>
              </div>
            </div>
            <ul v-else class="customer-list-modal" style="list-style: none; padding: 0; margin: 0;">
              <li v-for="c in filteredCustomersList" :key="c.ma_khach_hang" @click="insertCustomerQuote(c)" class="customer-list-item">
                <span class="c-name">{{ c.ten_khach_hang }}</span>
                <span v-if="c.ten_cong_ty" class="c-company">{{ c.ten_cong_ty }}</span>
                <span v-if="c.so_dien_thoai_ca_nhan" class="c-phone">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  {{ c.so_dien_thoai_ca_nhan }}
                </span>
              </li>
              <li v-if="filteredCustomersList.length === 0 && !loadingCustomers" style="padding: 3rem; text-align: center; color: #94a3b8; font-style: italic; font-weight: 500;">
                Không tìm thấy khách hàng nào.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Báo Lịch Trống -->
    <div class="elite-modal-overlay" v-if="isEmptyDaysModalOpen" @click.self="isEmptyDaysModalOpen = false" style="z-index: 999999;">
      <div class="elite-modal" style="max-width: 500px;">
        <div class="elite-modal-header">
          <div class="elite-modal-title" style="display: flex; align-items: flex-start; gap: 0.6rem;">
            <div style="margin-top: 0.15rem; color: #4f46e5;">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.4rem; flex: 1;">
              <h2 style="margin: 0; line-height: 1.3;">DANH SÁCH NGÀY TRỐNG</h2>
              <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                <span v-if="emptyDays.length > 0" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 0.2rem 0.6rem; border-radius: 8px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(239, 68, 68, 0.2); white-space: nowrap;">Có {{ emptyDays.length }} buổi</span>
                <div style="display: flex; background: #f1f5f9; padding: 2px; border-radius: 8px;">
                  <button @click="emptyDaysViewMode = 'list'" :style="emptyDaysViewMode === 'list' ? 'background: white; color: #4f46e5; box-shadow: 0 1px 3px rgba(0,0,0,0.1);' : 'background: transparent; color: #64748b;'" style="padding: 4px 12px; border: none; font-size: 0.8rem; font-weight: 600; border-radius: 6px; cursor: pointer;">Danh Sách</button>
                  <button @click="emptyDaysViewMode = 'calendar'" :style="emptyDaysViewMode === 'calendar' ? 'background: white; color: #4f46e5; box-shadow: 0 1px 3px rgba(0,0,0,0.1);' : 'background: transparent; color: #64748b;'" style="padding: 4px 12px; border: none; font-size: 0.8rem; font-weight: 600; border-radius: 6px; cursor: pointer;">Tổng Quan</button>
                </div>
              </div>
            </div>
          </div>
          <button class="elite-btn-close" @click="isEmptyDaysModalOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="elite-modal-body">
          <div v-if="emptyDaysViewMode === 'list'">
            <div v-if="emptyDays.length === 0" class="empty-state" style="padding: 2rem;">
              <p>Không có buổi nào trống trong khoảng thời gian này.</p>
            </div>
            <div v-else class="empty-days-list" style="max-height: 400px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.8rem; padding: 0.5rem;">
              <div v-for="(slot, idx) in emptyDays" :key="idx" class="empty-day-item" @click="openAddModalWithSlot(slot)" style="padding: 0.8rem; background: #f8fafc; border-radius: 16px; border: 1.5px solid #e2e8f0; display: flex; flex-direction: column; align-items: center; gap: 0.2rem; transition: all 0.2s; cursor: pointer;">
                <span style="font-size: 0.65rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">{{ getThuText(slot.date) }}</span>
                <span style="font-size: 0.95rem; font-weight: 700; color: #1e293b;">{{ formatDateDMY(slot.date) }}</span>
                <span :class="slot.period === 'Sáng' ? 'empty-badge-morning' : 'empty-badge-afternoon'" style="margin-top: 0.4rem;">
                  {{ slot.period === 'Sáng' ? 'Trống Sáng' : 'Trống Chiều' }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="empty-calendar-view" style="max-height: 450px; overflow-y: auto; padding: 0.5rem;">
            <div v-for="month in emptyDaysCalendar" :key="month.year + '-' + month.month" style="margin-bottom: 1.5rem;">
              <h3 style="font-size: 1rem; color: #1e293b; margin-bottom: 0.8rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.4rem;">Tháng {{ month.month }} / {{ month.year }}</h3>
              <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; margin-bottom: 0.5rem;">
                <div v-for="day in ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']" :key="day" style="font-size: 0.75rem; font-weight: 700; color: #64748b;">{{ day }}</div>
              </div>
              <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;">
                <div v-for="(day, idx) in month.days" :key="idx" 
                     style="min-height: 65px; border-radius: 6px; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; padding: 4px; position: relative;"
                     :style="day ? (day.inRange ? 'background: #f8fafc; border: 1px solid #e2e8f0;' : 'background: #f1f5f9; opacity: 0.5;') : 'background: transparent;'">
                  <span v-if="day" style="font-size: 0.8rem; font-weight: 600;" :style="day.isSunday ? 'color: #ef4444;' : 'color: #334155;'">{{ day.dayNum }}</span>
                  <div v-if="day && day.inRange" style="display: flex; flex-direction: column; gap: 2px; margin-top: auto; width: 100%;">
                    <div v-if="!day.isSunday && day.emptyMorning" @click="openAddModalWithSlot({ date: day.date, period: 'Sáng' })" style="background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; font-size: 0.6rem; font-weight: 700; border-radius: 4px; width: 100%; cursor: pointer; text-align: center;">Sáng</div>
                    <div v-if="!day.isSunday && !day.isSaturday && day.emptyAfternoon" @click="openAddModalWithSlot({ date: day.date, period: 'Chiều' })" style="background: #fdf4ff; color: #a21caf; border: 1px solid #fbcfe8; font-size: 0.6rem; font-weight: 700; border-radius: 4px; width: 100%; cursor: pointer; text-align: center;">Chiều</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="elite-modal-actions" style="margin-top: 1.5rem;">
            <button type="button" class="elite-btn-primary" @click="isEmptyDaysModalOpen = false" style="width: 100%; justify-content: center;">Đóng</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal Xác Nhận Xóa -->
    <div class="elite-modal-overlay" v-if="isDeleteModalOpen" @click.self="isDeleteModalOpen = false" style="z-index: 999999;">
      <div class="elite-modal" style="max-width: 400px;">
        <div class="elite-modal-header">
          <div class="elite-modal-title" style="display: flex; align-items: flex-start; gap: 0.6rem;">
            <div style="margin-top: 0.15rem; color: #ef4444;">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <h2 style="margin: 0; line-height: 1.3;">Xóa báo cáo?</h2>
          </div>
          <button class="elite-btn-close" @click="isDeleteModalOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="elite-modal-body">
          <p style="color: #475569; font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.5;">Bạn có chắc chắn muốn xóa báo cáo này không? Hành động này không thể hoàn tác.</p>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button class="btn-secondary" @click="isDeleteModalOpen = false" style="padding: 0.6rem 1.25rem;">Hủy</button>
            <button class="btn-primary" @click="executeDelete" style="background: #ef4444; padding: 0.6rem 1.25rem; display: flex; align-items: center; gap: 0.5rem; border: none; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              Xóa ngay
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ghi Âm Giọng Nói -->
    <div class="elite-modal-overlay" v-if="isVoiceModalOpen" @click.self="cancelVoiceRecording" style="z-index: 999999;">
      <div class="elite-modal" style="max-width: 420px;">
        <div class="elite-modal-header" style="justify-content: center; padding-bottom: 0; border-bottom: none;">
          <div class="elite-modal-title" style="flex-direction: column; align-items: center; gap: 0.8rem; margin: 0 auto;">
            <div class="voice-recording-indicator" :class="{ 'is-listening': isListening }">
              <svg v-if="isListening" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect></svg>
            </div>
            <h2 style="font-size: 1.25rem;">{{ isListening ? 'Đang nghe...' : 'Đã tạm dừng' }}</h2>
          </div>
        </div>
        <div class="elite-modal-body" style="padding-top: 1rem;">
          <div class="voice-transcript-box">
            <span v-if="voiceTranscript">{{ voiceTranscript }}</span>
            <span v-else class="voice-placeholder">Hãy nói nội dung bạn muốn nhập...</span>
          </div>
          <div class="elite-modal-actions" style="justify-content: center; gap: 0.8rem; margin-top: 1.5rem;">
            <button type="button" class="elite-btn-cancel" @click="cancelVoiceRecording">Huỷ</button>
            <button type="button" class="elite-btn-secondary" @click="retryVoiceRecording" style="background: rgba(245, 158, 11, 0.1); color: #d97706; border-color: rgba(245, 158, 11, 0.2);">Nói lại</button>
            <button type="button" class="elite-btn-primary" @click="confirmVoiceRecording">Xong</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import * as XLSX from 'xlsx-js-style'
import CustomSelect from './CustomSelect.vue'

const sortOptions = [
  { value: 'desc', label: 'Mới nhất' },
  { value: 'asc', label: 'Cũ nhất' }
]

const periodOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'Sáng', label: 'Sáng' },
  { value: 'Chiều', label: 'Chiều' }
]

const priorityOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'ƯU TIÊN', label: 'Ưu tiên' },
  { value: 'BÌNH THƯỜNG', label: 'Bình thường' }
]

const typeOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'CÔNG VIỆC', label: 'Công việc' },
  { value: 'ĐỜI SỐNG', label: 'Đời sống' }
]

const statusOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'Chưa xử lý', label: 'Chưa xử lý' },
  { value: 'Hoàn thành', label: 'Hoàn thành' }
]

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

const getThisMonthStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const getThisYearStr = () => {
  return new Date().getFullYear().toString();
}

const filters = ref({
  tag: '',
  phan_loai: '',
  trang_thai: '',
  filterMode: 'day',
  dateFrom: getTodayStr(),
  dateTo: getTodayStr(),
  monthFrom: getThisMonthStr(),
  monthTo: getThisMonthStr(),
  yearFrom: getThisYearStr(),
  yearTo: getThisYearStr(),
  sortOrder: 'desc',
  period: ''
})

const isRecordingVoice = ref(null);
const isVoiceModalOpen = ref(false);
const voiceTargetField = ref('');
const voiceTranscript = ref('');
const isListening = ref(false);
let recognition = null;

const startVoiceRecognition = (field) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Vui lòng sử dụng Chrome, Edge hoặc Safari.");
    return;
  }

  voiceTargetField.value = field;
  voiceTranscript.value = '';
  isVoiceModalOpen.value = true;
  
  startListening();
}

const startListening = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (recognition) recognition.stop();

  recognition = new SpeechRecognition();
  recognition.lang = 'vi-VN';
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isListening.value = true;
    isRecordingVoice.value = voiceTargetField.value;
  };

  recognition.onresult = (event) => {
    let fullTranscript = '';
    for (let i = 0; i < event.results.length; ++i) {
      fullTranscript += event.results[i][0].transcript;
    }
    voiceTranscript.value = fullTranscript;
  };

  recognition.onerror = (event) => {
    console.error('Lỗi nhận diện giọng nói:', event.error);
    isListening.value = false;
  };

  recognition.onend = () => {
    isListening.value = false;
    isRecordingVoice.value = null;
  };

  recognition.start();
}

const cancelVoiceRecording = () => {
  if (recognition) recognition.stop();
  isVoiceModalOpen.value = false;
  isListening.value = false;
  isRecordingVoice.value = null;
  voiceTranscript.value = '';
}

const retryVoiceRecording = () => {
  voiceTranscript.value = '';
  startListening();
}

const confirmVoiceRecording = () => {
  if (recognition) recognition.stop();
  if (voiceTranscript.value) {
    if (formData.value[voiceTargetField.value]) {
      formData.value[voiceTargetField.value] += ' ' + voiceTranscript.value;
    } else {
      formData.value[voiceTargetField.value] = voiceTranscript.value;
    }
  }
  isVoiceModalOpen.value = false;
  isListening.value = false;
  isRecordingVoice.value = null;
  voiceTranscript.value = '';
}

const tableSection = ref(null)

const scrollToTable = () => {
  nextTick(() => {
    if (tableSection.value) {
      tableSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

const onCardClick = (status) => {
  filters.value.trang_thai = status;
  scrollToTable();
}

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
    const hourNum = parseInt(h);
    const periodText = hourNum < 12 ? 'Sáng' : 'Chiều';
    
    return {
      time: `${h} : ${m}`,
      thu: thuText,
      date: datePart.split('/').join(' / '),
      period: periodText
    };
  }
  return { time: thoi_gian, thu: '', date: '', period: '' };
}

const baseFilteredReports = computed(() => {
  let result = reports.value.filter(r => {
    if (filters.value.tag && r.tag !== filters.value.tag) return false;
    if (filters.value.phan_loai && r.phan_loai !== filters.value.phan_loai) return false;
    if (filters.value.period) {
      const displayTime = formatDisplayTime(r.thoi_gian);
      if (displayTime.period !== filters.value.period) return false;
    }
    
    if (filters.value.filterMode === 'day' && (filters.value.dateFrom || filters.value.dateTo)) {
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
    } else if (filters.value.filterMode === 'month' && (filters.value.monthFrom || filters.value.monthTo)) {
      const reportDate = parseDateFromReport(r.thoi_gian);
      if (!reportDate) return false;
      if (filters.value.monthFrom) {
        const [y, m] = filters.value.monthFrom.split('-');
        const from = new Date(Number(y), Number(m) - 1, 1, 0, 0, 0, 0);
        if (reportDate < from) return false;
      }
      if (filters.value.monthTo) {
        const [y, m] = filters.value.monthTo.split('-');
        const to = new Date(Number(y), Number(m), 0, 23, 59, 59, 999);
        if (reportDate > to) return false;
      }
    } else if (filters.value.filterMode === 'year' && (filters.value.yearFrom || filters.value.yearTo)) {
      const reportDate = parseDateFromReport(r.thoi_gian);
      if (!reportDate) return false;
      if (filters.value.yearFrom) {
        const from = new Date(Number(filters.value.yearFrom), 0, 1, 0, 0, 0, 0);
        if (reportDate < from) return false;
      }
      if (filters.value.yearTo) {
        const to = new Date(Number(filters.value.yearTo), 11, 31, 23, 59, 59, 999);
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

const filteredReports = computed(() => {
  return baseFilteredReports.value.filter(r => {
    if (filters.value.trang_thai && filters.value.trang_thai !== 'Tất cả' && r.trang_thai !== filters.value.trang_thai) return false;
    return true;
  });
});

const totalCount = computed(() => baseFilteredReports.value.length)
const pendingCount = computed(() => baseFilteredReports.value.filter(r => r.trang_thai === 'Chưa xử lý').length)
const completedCount = computed(() => baseFilteredReports.value.filter(r => r.trang_thai === 'Hoàn thành').length)

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

watch(() => filters.value.monthFrom, (newVal) => {
  if (newVal && filters.value.monthTo && newVal > filters.value.monthTo) filters.value.monthTo = newVal;
})

watch(() => filters.value.monthTo, (newVal) => {
  if (newVal && filters.value.monthFrom && newVal < filters.value.monthFrom) filters.value.monthFrom = newVal;
})

watch(() => filters.value.yearFrom, (newVal) => {
  if (newVal && filters.value.yearTo && Number(newVal) > Number(filters.value.yearTo)) filters.value.yearTo = newVal;
})

watch(() => filters.value.yearTo, (newVal) => {
  if (newVal && filters.value.yearFrom && Number(newVal) < Number(filters.value.yearFrom)) filters.value.yearFrom = newVal;
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

const setMorningTime = () => {
  timeInputs.value.hour = '08';
  timeInputs.value.minute = '00';
}

const setAfternoonTime = () => {
  timeInputs.value.hour = '13';
  timeInputs.value.minute = '00';
}

const isMorning = computed(() => {
  const h = Number(timeInputs.value.hour);
  return h >= 0 && h < 12;
})

const isAfternoon = computed(() => {
  const h = Number(timeInputs.value.hour);
  return h >= 12 && h < 24;
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

const openAddModalWithSlot = (slot) => {
  isEmptyDaysModalOpen.value = false;
  isEditing.value = false;
  formData.value = {
    id: '',
    phan_loai: 'CÔNG VIỆC',
    noi_dung: '',
    ghi_chu: '',
    tag: 'BÌNH THƯỜNG',
    trang_thai: 'Chưa xử lý'
  };
  
  const d = slot.date;
  const thu = d.getDay();
  timeInputs.value = {
    hour: slot.period === 'Sáng' ? '08' : '14',
    minute: '00',
    thu: String(thu === 0 ? 8 : thu + 1),
    day: String(d.getDate()).padStart(2, '0'),
    month: String(d.getMonth() + 1).padStart(2, '0'),
    year: String(d.getFullYear())
  };
  isModalOpen.value = true;
}

const originalData = ref(null);
const originalTimeInputs = ref(null);

const hasChanges = computed(() => {
  if (!isEditing.value) return true;
  if (!originalData.value || !originalTimeInputs.value) return false;
  
  const formKeys = ['phan_loai', 'noi_dung', 'ghi_chu', 'tag', 'trang_thai'];
  for (const k of formKeys) {
    if (formData.value[k] !== originalData.value[k]) return true;
  }
  
  const timeKeys = ['hour', 'minute', 'thu', 'day', 'month', 'year'];
  for (const k of timeKeys) {
    if (timeInputs.value[k] !== originalTimeInputs.value[k]) return true;
  }
  
  return false;
});

const openEditModal = (report) => {
  isEditing.value = true
  formData.value = { ...report }
  originalData.value = { ...report }
  timeInputs.value = parseTimeString(report.thoi_gian);
  originalTimeInputs.value = { ...timeInputs.value }
  isModalOpen.value = true
}

const closeModal = () => {
  if (saving.value) return; // Không đóng khi đang lưu
  isModalOpen.value = false
}

// --- BÁO GIÁ KHÁCH HÀNG ---
const customersList = ref([])
const showCustomerModal = ref(false)
const customerSearch = ref('')
const loadingCustomers = ref(false)

const fetchCustomersForQuote = async () => {
  loadingCustomers.value = true;
  try {
    const url = new URL(API_URL)
    url.searchParams.append('sheet', 'khach_hang')
    url.searchParams.append('action', 'get')
    const response = await fetch(url.toString())
    const result = await response.json()
    if (result.status === 'success') {
      customersList.value = result.data || []
    }
  } catch(e) {
    console.error(e)
  } finally {
    loadingCustomers.value = false;
  }
}

const openCustomerModal = () => {
  showCustomerModal.value = true;
  if (customersList.value.length === 0) {
    fetchCustomersForQuote();
  }
}

const filteredCustomersList = computed(() => {
  if (!customerSearch.value) return customersList.value;
  const q = customerSearch.value.toLowerCase();
  return customersList.value.filter(c => 
    (c.ten_khach_hang && c.ten_khach_hang.toLowerCase().includes(q)) ||
    (c.ten_cong_ty && c.ten_cong_ty.toLowerCase().includes(q))
  );
})

const insertCustomerQuote = (customer) => {
  const nameToUse = customer.ten_cong_ty || customer.ten_khach_hang;
  const quoteText = `Báo giá ${nameToUse}`;
  formData.value.noi_dung = quoteText;
  showCustomerModal.value = false;
  customerSearch.value = '';
}

// Lưu (Thêm/Sửa)
const highlightedReportId = ref(null)

const saveReport = async (options = {}) => {
  const isContinue = !!options.continue;
  const isOpenEmpty = !!options.openEmpty;
  
  if ((isContinue || isOpenEmpty) && !formData.value.noi_dung) {
    return;
  }

  if (API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
     alert("Vui lòng cập nhật API_URL của Google Apps Script để lưu thực tế.");
     if (!isContinue) closeModal();
     return;
  }

  formData.value.thoi_gian = formatTimeString();

  saving.value = true
  
  // Tạo độ trễ giả 500ms để hiển thị trạng thái "Đang lưu..." (UX)
  await new Promise(r => setTimeout(r, 500));

  const action = isEditing.value ? 'update' : 'add'
  const payload = {
    action: action,
    ...formData.value
  }

  // Cập nhật UI ngay lập tức
  const tempId = action === 'add' ? `temp_${Date.now()}` : formData.value.id;
  
  let newCreatedTime = formData.value.created_time;
  if (action === 'add') {
    const now = new Date();
    const pad = n => String(n).padStart(2, "0");
    newCreatedTime = `${pad(now.getHours())}:${pad(now.getMinutes())} ${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()}`;
  }

  const newReport = {
    ...formData.value,
    id: tempId,
    created_time: newCreatedTime
  };

  if (action === 'add') {
    reports.value.unshift(newReport);
  } else {
    const index = reports.value.findIndex(r => r.id === tempId);
    if (index !== -1) {
      reports.value[index] = newReport;
    }
  }

  // Tắt loading và xử lý đóng modal/reset
  if (!isContinue && !isOpenEmpty) {
    isModalOpen.value = false;
  } else if (isOpenEmpty) {
    isModalOpen.value = false;
    showEmptyDays();
  } else {
    formData.value.noi_dung = '';
  }
  saving.value = false;

  // Highlight dòng vừa tác động
  highlightedReportId.value = tempId;
  setTimeout(() => {
    if (highlightedReportId.value === tempId) {
      highlightedReportId.value = null;
    }
  }, 3000);

  // Xử lý gửi dữ liệu ngầm
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    
    const result = await response.json()
    if (result.status === 'success') {
      if (action === 'add' && result.id) {
        const idx = reports.value.findIndex(r => r.id === tempId);
        if (idx !== -1) {
          reports.value[idx].id = result.id;
        }
        if (highlightedReportId.value === tempId) {
          highlightedReportId.value = result.id;
        }
      }
    } else {
      console.error('Lưu ngầm thất bại:', result.message)
    }
  } catch (error) {
    console.error('Lỗi khi lưu ngầm:', error)
  }
}

// Chọn hàng loạt
const selectedReports = ref([])

const toggleSelectAll = (event) => {
  if (event.target.checked) {
    selectedReports.value = filteredReports.value.map(r => r.id);
  } else {
    selectedReports.value = [];
  }
}

const isAllSelected = computed(() => {
  return filteredReports.value.length > 0 && selectedReports.value.length === filteredReports.value.length;
})

const bulkMarkCompleted = async () => {
  if (selectedReports.value.length === 0) return;
  if (!confirm(`Xác nhận đánh dấu hoàn thành ${selectedReports.value.length} công việc đã chọn?`)) return;
  
  saving.value = true;
  try {
    const promises = selectedReports.value.map(async id => {
      const report = reports.value.find(r => r.id === id);
      if (report && report.trang_thai !== 'Hoàn thành') {
        report.trang_thai = 'Hoàn thành';
        await fetch(API_URL, {
          method: 'POST',
          body: JSON.stringify({ action: 'update', ...report })
        });
      }
    });
    await Promise.all(promises);
    selectedReports.value = [];
  } catch (error) {
    console.error('Lỗi bulk update', error);
    alert('Có lỗi xảy ra khi cập nhật hàng loạt.');
  }
  saving.value = false;
}

const bulkDelete = async () => {
  if (selectedReports.value.length === 0) return;
  if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedReports.value.length} công việc đã chọn? Hành động này không thể hoàn tác.`)) return;
  
  saving.value = true;
  try {
    const promises = selectedReports.value.map(id => fetch(`${API_URL}?action=delete&id=${id}`));
    await Promise.all(promises);
    reports.value = reports.value.filter(r => !selectedReports.value.includes(r.id));
    selectedReports.value = [];
  } catch (error) {
    console.error('Lỗi bulk delete', error);
    alert('Có lỗi xảy ra khi xóa hàng loạt.');
  }
  saving.value = false;
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
const isDeleteModalOpen = ref(false)
const deleteTarget = ref(null)
const isDeleting = ref(false)
const deletingIds = ref([])

const confirmDelete = (id) => {
  if (API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
      alert("Tính năng xoá cần cấu hình API_URL");
      return;
  }
  deleteTarget.value = id;
  isDeleteModalOpen.value = true;
}

const executeDelete = async () => {
  if (!deleteTarget.value) return;
  const id = deleteTarget.value;
  
  isDeleting.value = true;
  deletingIds.value = [id];
  isDeleteModalOpen.value = false;
  
  try {
    // Gọi API xoá
    const response = await fetch(`${API_URL}?action=delete&id=${id}`)
    const result = await response.json()
    
    if (result.status === 'success') {
      // Đợi hiệu ứng animation chạy xong (400ms)
      await new Promise(r => setTimeout(r, 400));
      reports.value = reports.value.filter(r => r.id !== id);
    } else {
      alert('Lỗi khi xoá: ' + result.message)
    }
  } catch (error) {
    console.error('Lỗi delete:', error)
  }
  
  deletingIds.value = [];
  isDeleting.value = false;
  deleteTarget.value = null;
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

const isEmptyDaysModalOpen = ref(false)
const emptyDays = ref([])
const emptyDaysViewMode = ref('list'); // 'list' or 'calendar'
const emptyDaysStartDate = ref(null);
const emptyDaysEndDate = ref(null);

const emptyDaysCalendar = computed(() => {
  if (!emptyDaysStartDate.value || !emptyDaysEndDate.value) return [];
  const result = [];
  
  let currMonth = new Date(emptyDaysStartDate.value.getFullYear(), emptyDaysStartDate.value.getMonth(), 1);
  const endMonth = new Date(emptyDaysEndDate.value.getFullYear(), emptyDaysEndDate.value.getMonth(), 1);
  
  while (currMonth <= endMonth) {
    const year = currMonth.getFullYear();
    const month = currMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
    
    // Adjust firstDayOfWeek if we want Monday to be first (0 = Monday, 6 = Sunday)
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const days = [];
    for (let i = 0; i < startOffset; i++) {
      days.push(null); // empty padding
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      // Only include if dateObj is within search range
      const inRange = dateObj >= emptyDaysStartDate.value && dateObj <= emptyDaysEndDate.value;
      
      const dayOfWeek = dateObj.getDay();
      const isSunday = dayOfWeek === 0;
      const isSaturday = dayOfWeek === 6;
      
      const emptyMorning = emptyDays.value.find(e => e.date.getTime() === dateObj.getTime() && e.period === 'Sáng');
      const emptyAfternoon = emptyDays.value.find(e => e.date.getTime() === dateObj.getTime() && e.period === 'Chiều');
      
      days.push({
        date: dateObj,
        dayNum: d,
        inRange,
        isSunday,
        isSaturday,
        emptyMorning: !!emptyMorning,
        emptyAfternoon: !!emptyAfternoon
      });
    }
    
    result.push({
      year,
      month: month + 1,
      days
    });
    
    currMonth.setMonth(currMonth.getMonth() + 1);
  }
  return result;
});

const getThuText = (date) => {
  const day = date.getDay();
  return day === 0 ? 'Chủ Nhật' : `Thứ ${day + 1}`;
}

const formatDateDMY = (date) => {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

const showEmptyDays = () => {
  try {
    const slots = [];
    const currentReports = reports.value || [];
    const workReports = currentReports.filter(r => r.phan_loai === 'CÔNG VIỆC');
    
    let startDate, endDate;
    
    if (filters.value.filterMode === 'day') {
      startDate = new Date(filters.value.dateFrom);
      endDate = new Date(filters.value.dateTo);
    } else if (filters.value.filterMode === 'month') {
      const [y, m] = filters.value.monthFrom.split('-');
      startDate = new Date(Number(y), Number(m) - 1, 1);
      const [ye, me] = filters.value.monthTo.split('-');
      endDate = new Date(Number(ye), Number(me), 0);
    } else {
      startDate = new Date(Number(filters.value.yearFrom), 0, 1);
      endDate = new Date(Number(filters.value.yearTo), 11, 31);
    }
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert("Vui lòng chọn khoảng thời gian hợp lệ.");
      return;
    }

    const reportSlots = new Set();
    workReports.forEach(r => {
      const d = parseDateFromReport(r.thoi_gian);
      if (d) {
        const displayTime = formatDisplayTime(r.thoi_gian);
        const dateStr = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
        reportSlots.add(`${dateStr}|${displayTime.period}`);
      }
    });
    
    const tempDate = new Date(startDate);
    tempDate.setHours(0,0,0,0);
    const finalDate = new Date(endDate);
    finalDate.setHours(23,59,59,999);
    
    emptyDaysStartDate.value = new Date(tempDate);
    emptyDaysEndDate.value = new Date(finalDate);
    emptyDaysViewMode.value = 'list';

    while (tempDate <= finalDate) {
      const dateStr = `${tempDate.getDate()}/${tempDate.getMonth()+1}/${tempDate.getFullYear()}`;
      const dayOfWeek = tempDate.getDay(); // 0: CN, 6: T7
      
      // Bỏ qua Sáng/Chiều Chủ Nhật (dayOfWeek === 0)
      if (dayOfWeek !== 0) {
        // Check morning
        if (!reportSlots.has(`${dateStr}|Sáng`)) {
          slots.push({ date: new Date(tempDate), period: 'Sáng' });
        }
        
        // Check afternoon (Bỏ qua Chiều Thứ 7)
        if (dayOfWeek !== 6) {
          if (!reportSlots.has(`${dateStr}|Chiều`)) {
            slots.push({ date: new Date(tempDate), period: 'Chiều' });
          }
        }
      }
      
      tempDate.setDate(tempDate.getDate() + 1);
      if (slots.length > 1000) break;
    }
    
    emptyDays.value = slots;
    isEmptyDaysModalOpen.value = true;
  } catch (error) {
    console.error("Lỗi showEmptyDays:", error);
    alert("Có lỗi xảy ra khi tính toán lịch trống.");
  }
}

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
        const [h, m] = timePart.split(':');
        const hour = parseInt(h, 10) || 0;
        const minute = parseInt(m, 10) || 0;
        const timeVal = hour + minute / 60;
        
        if (timeVal >= 4 && timeVal <= 12) {
          morningTasks.push(r.noi_dung);
        } else if (timeVal > 12 && timeVal <= 19) {
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

  const titleStyle = { font: { bold: true, sz: 14, name: "Arial" }, alignment: { horizontal: "center", vertical: "center" } };
  const subtitleStyle = { font: { bold: true, sz: 12, name: "Arial" }, alignment: { horizontal: "center", vertical: "center" } };
  const infoStyle = { font: { bold: true, sz: 12, name: "Arial" }, alignment: { horizontal: "left", vertical: "center" } };
  const headerStyle = { font: { bold: true, sz: 12, name: "Arial" }, alignment: { horizontal: "center", vertical: "center", wrapText: true }, border: borderAll };
  const dateStyle = { font: { sz: 12, name: "Arial" }, alignment: { horizontal: "center", vertical: "center", wrapText: true }, border: borderAll };
  const contentStyle = { font: { sz: 12, name: "Arial" }, alignment: { horizontal: "left", vertical: "center", wrapText: true }, border: borderAll };
  const contentEmptyStyle = { font: { sz: 12, name: "Arial" }, alignment: { horizontal: "left", vertical: "center", wrapText: true }, border: borderAll, fill: { fgColor: { rgb: "B8CCE4" } } };
  const footerLabelStyle = { font: { bold: true, sz: 12, name: "Arial" }, alignment: { horizontal: "left", vertical: "center" }, border: borderAll };
  const footerEmptyStyle = { font: { sz: 12, name: "Arial" }, border: borderAll };

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

/* Voice Recording Button */
.header-actions-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.elite-voice-btn {
  background: rgba(99, 102, 241, 0.08);
  color: #4f46e5;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.elite-voice-btn:hover {
  background: rgba(99, 102, 241, 0.15);
  transform: translateY(-1px);
}

.elite-voice-btn.is-recording {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
  animation: pulse-recording 1.5s infinite;
}

@keyframes pulse-recording {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.voice-recording-indicator {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.voice-recording-indicator.is-listening {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  animation: voice-pulse-indicator 1.5s infinite;
}

@keyframes voice-pulse-indicator {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.voice-transcript-box {
  min-height: 120px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  text-align: left;
  font-size: 1.05rem;
  color: #1e293b;
  line-height: 1.6;
  max-height: 250px;
  overflow-y: auto;
}

.voice-placeholder {
  color: #94a3b8;
  font-style: italic;
}

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


/* ============================================
   ELITE MODAL — Add/Edit Report
   ============================================ */
.elite-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  animation: fadeIn 0.2s ease forwards;
}

.elite-modal {
  background: white;
  width: calc(100% - 2rem);
  max-width: 550px;
  max-height: 95vh;
  overflow-y: auto;
  border-radius: 24px;
  padding: 0;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05);
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  display: flex;
  flex-direction: column;
}

.elite-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.75rem 1.25rem;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  background: linear-gradient(180deg, rgba(248,250,252,0.6) 0%, white 100%);
}

.elite-modal-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.elite-modal-title svg {
  color: #4f46e5;
}

.elite-modal-title h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.elite-btn-close {
  background: #f1f5f9;
  color: #64748b;
  padding: 0.5rem;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  cursor: pointer;
}

.elite-btn-close:hover {
  background: #e2e8f0;
  color: #0f172a;
  transform: rotate(90deg);
}

.elite-modal-body {
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.elite-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.elite-form-row {
  display: flex;
  gap: 1.25rem;
}

.elite-form-row .elite-form-group {
  flex: 1;
}

.elite-form-group label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.form-group-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.75rem;
}

.elite-quote-btn {
  background: #10b981;
  color: white;
  border: 1px solid #059669;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s;
  cursor: pointer;
  box-shadow: 0 2px 6px -1px rgba(16, 185, 129, 0.2);
}

.elite-quote-btn:hover {
  background: #059669;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -2px rgba(16, 185, 129, 0.4);
}

/* Time Picker inside Modal */
.elite-quick-times {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.elite-quick-btn {
  flex: 1;
  background: #f8fafc;
  color: #475569;
  border: 1.5px solid #e2e8f0;
  padding: 0.6rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
}

.elite-quick-btn:hover {
  background: white;
  border-color: #34d399;
  color: #059669;
  box-shadow: 0 4px 12px -2px rgba(16, 185, 129, 0.15);
}

.elite-quick-btn.active {
  background: #0f172a;
  color: #10b981;
  border-color: #0f172a;
  box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.3);
}

.elite-quick-btn.active svg {
  color: #10b981;
}

.elite-time-picker {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f8fafc;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  flex-wrap: wrap;
  justify-content: center;
}

.time-part, .date-part {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-part {
  flex: 1;
  justify-content: space-between;
}

.time-sep, .date-sep {
  font-weight: 700;
  color: #94a3b8;
  padding-top: 1.2rem;
}

.picker-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
}

.picker-item span {
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
}

.elite-select-mini {
  appearance: none;
  background: transparent;
  border: none;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  padding: 0.2rem 0.5rem;
  text-align: center;
  cursor: pointer;
  outline: none;
  border-radius: 6px;
  min-width: 50px;
}

.elite-select-mini:hover, .elite-select-mini:focus {
  background: white;
  box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
}

/* Status Toggle inside Modal */
.elite-status-toggle {
  display: flex;
  gap: 0.4rem;
  background: #f1f5f9;
  padding: 0.35rem;
  border-radius: 12px;
}

.toggle-btn {
  flex: 1;
  padding: 0.6rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: none;
  transition: all 0.2s;
  cursor: pointer;
}

.toggle-btn:hover:not(.active-success):not(.active-warning) {
  background: rgba(255,255,255,0.5);
  color: #334155;
}

.toggle-btn.active-success {
  background: white;
  color: #10b981;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
}

.toggle-btn.active-warning {
  background: white;
  color: #f59e0b;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.15);
}

/* Modal Actions */
.elite-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f1f5f9;
}

.elite-btn-cancel {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  color: #475569;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.elite-btn-cancel:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.elite-btn-primary {
  padding: 0.75rem 1.75rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  color: white;
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  border: none;
  box-shadow: 0 4px 12px -2px rgba(79, 70, 229, 0.3);
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.elite-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -2px rgba(79, 70, 229, 0.4);
}

.elite-btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.1);
  border: 1.5px solid rgba(79, 70, 229, 0.2);
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.elite-btn-secondary:hover {
  background: rgba(79, 70, 229, 0.15);
}

.btn-add-continue {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  color: white;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  box-shadow: 0 4px 12px -2px rgba(16, 185, 129, 0.3);
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-add-continue:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -2px rgba(16, 185, 129, 0.4);
}

.btn-add-empty {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  color: white;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  box-shadow: 0 4px 12px -2px rgba(59, 130, 246, 0.3);
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-add-empty:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -2px rgba(59, 130, 246, 0.4);
}

.btn-add-primary {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  box-shadow: 0 4px 12px -2px rgba(239, 68, 68, 0.3) !important;
}

.btn-add-primary:hover {
  box-shadow: 0 8px 16px -2px rgba(239, 68, 68, 0.4) !important;
}

/* Modal Form Actions 2x2 Grid (Global for PC & Mobile) */
.form-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
}
.form-actions-grid > button {
  width: 100%;
  margin: 0;
  white-space: normal;
  text-align: center;
  line-height: 1.3;
  min-height: 48px;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
}
.form-actions-grid > button:only-child {
  grid-column: 1 / -1;
}

/* Swap "Thêm & làm tiếp" with "Hủy bỏ" globally */
.form-actions-grid .elite-btn-cancel { order: 3; color: #ef4444; }
.form-actions-grid .elite-btn-cancel:hover { background: #fee2e2; color: #dc2626; }
.form-actions-grid .btn-add-empty { order: 2; }
.form-actions-grid .btn-add-continue { order: 1; }
.form-actions-grid .btn-add-primary { 
  order: 4; 
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 12px -2px rgba(16, 185, 129, 0.3);
}
.form-actions-grid .btn-add-primary:hover {
  box-shadow: 0 8px 16px -2px rgba(16, 185, 129, 0.4);
}

.empty-day-item:hover {
  transform: translateY(-2px);
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.empty-badge-morning {
  background: #fff7ed;
  color: #c2410c;
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 800;
  border: 1px solid #ffedd5;
}

.empty-badge-afternoon {
  background: #f0f9ff;
  color: #0369a1;
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 800;
  border: 1px solid #e0f2fe;
}


.elite-btn-secondary:hover:not(:disabled) {
  background: rgba(79, 70, 229, 0.15);
  border-color: rgba(79, 70, 229, 0.3);
  transform: translateY(-1px);
}

.elite-btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  display: none;
}

/* Action Bar (below stat cards) */
.action-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  justify-content: flex-end;
}
.mobile-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.05rem;
  border: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.mobile-action-btn.excel {
  background: #10b981;
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}
.mobile-action-btn.excel:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}
.mobile-action-btn.empty-days {
  background: #6366f1;
  color: white;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}
.mobile-action-btn.empty-days:hover {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}
.mobile-action-btn.add {
  background: #3b82f6;
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}
.mobile-action-btn.add:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
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
  background: #1e293b;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  border: 1px solid #334155;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.stat-card.elite-active {
  border-color: #10b981;
  background: #0f172a;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}
.stat-card.elite-active::after {
  content: '';
  position: absolute;
  top: 0; right: 0;
  width: 0; height: 0;
  border-style: solid;
  border-width: 0 16px 16px 0;
  border-color: transparent #10b981 transparent transparent;
}
.stat-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  transform: translateY(-3px);
  border-color: #475569;
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
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}
.stat-icon.pending {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}
.stat-icon.done {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
}
.stat-info {
  display: flex;
  flex-direction: column;
}
.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
}
.unit-text {
  font-size: 0.95rem;
  font-weight: 500;
  opacity: 0.8;
}
.stat-label {
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Colors by Card Type */
.card-total .stat-value { color: #60a5fa; }
.card-total .stat-label { color: #93c5fd; }

.card-pending .stat-value { color: #fbbf24; }
.card-pending .stat-label { color: #fcd34d; }

.card-done .stat-value { color: #34d399; }
.card-done .stat-label { color: #6ee7b7; }

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
    display: none !important;
  }

  .action-bar {
    display: flex !important;
    flex-direction: row !important;
    gap: 0.5rem !important;
    margin-bottom: 0.75rem;
  }
  .mobile-action-btn {
    flex: 1;
    padding: 0.65rem 0.75rem;
    font-size: 0.8rem;
  }
  .mobile-action-btn.excel {
    background: #10b981;
    color: white;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  }
  .mobile-action-btn.excel:hover {
    background: #059669;
  }
  .mobile-action-btn.empty-days {
    background: #6366f1;
    color: white;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  }
  .mobile-action-btn.add {
    background: #3b82f6;
    color: white;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }
  .mobile-action-btn.add:hover {
    background: #2563eb;
  }
  .report-container {
    padding-bottom: 80px;
  }

  .filters {
    flex-direction: column;
  }

  .filters select {
    width: 100%;
  }

  .stats-row {
    flex-direction: row;
    gap: 0.5rem;
  }
  .stat-card {
    padding: 0.7rem 0.6rem;
    gap: 0.5rem;
    border-radius: 12px;
  }
  .stat-icon {
    width: 34px;
    height: 34px;
    border-radius: 8px;
  }
  .stat-icon svg {
    width: 16px;
    height: 16px;
  }
  .stat-value {
    font-size: 1.15rem;
  }
  .unit-text {
    font-size: 0.7rem;
  }
  .stat-label {
    font-size: 0.65rem;
    margin-bottom: 0.15rem;
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

.time-primary svg { color: #10b981; }

.time-secondary {
  font-size: 0.8rem;
  color: #047857;
  font-weight: 600;
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
  background: #fff1f2;
  padding: 0.75rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  border-left: 3px solid #fecdd3;
}

.content-note {
  font-size: 0.85rem;
  color: #9f1239;
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

@keyframes progress-indeterminate {
  0% { left: -50%; width: 50%; }
  50% { left: 25%; width: 80%; }
  100% { left: 100%; width: 50%; }
}

/* CUSTOMER MODAL LIST STYLES */
.customer-list-item {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  background: transparent;
  border-left: 3px solid transparent;
}
.customer-list-item:last-child {
  border-bottom: none;
}
.customer-list-item:hover {
  background: white;
  border-left-color: #10b981;
  box-shadow: 0 4px 12px -4px rgba(0,0,0,0.05);
}
.customer-list-item .c-name {
  font-weight: 700;
  color: #1e293b;
  font-size: 1.05rem;
  transition: color 0.2s;
}
.customer-list-item:hover .c-name {
  color: #059669;
}
.customer-list-item .c-company {
  color: #64748b;
  font-size: 0.85rem;
  margin-top: 0.3rem;
  font-weight: 500;
}
.customer-list-item .c-phone {
  color: #94a3b8;
  font-size: 0.85rem;
  margin-top: 0.2rem;
  font-family: 'JetBrains Mono', monospace;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
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

.highlight-row {
  background-color: rgba(34, 197, 94, 0.15) !important;
  transition: background-color 0.5s ease;
}

.highlight-card {
  border-color: #22c55e !important;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3) !important;
  transition: all 0.5s ease;
}

/* ============================================
   ELITE FILTER PANEL — Glassmorphism + Accent
   ============================================ */
.elite-filter-panel {
  position: relative;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow:
    0 8px 32px -4px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(0, 0, 0, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
  z-index: 10;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.elite-filter-panel:hover {
  box-shadow:
    0 16px 48px -8px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}
.elite-filter-accent {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, #10b981 0%, #34d399 40%, #6ee7b7 70%, #a7f3d0 100%);
  border-radius: 20px 20px 0 0;
}
.elite-filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.75rem 0;
}
.elite-filter-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.01em;
}
.elite-filter-title svg { color: #10b981; }
.elite-refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.1rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(52, 211, 153, 0.08) 100%);
  color: #10b981;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid rgba(16, 185, 129, 0.12);
  transition: all 0.25s ease;
}
.elite-refresh-btn:hover {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.15) 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -2px rgba(16, 185, 129, 0.2);
}
.elite-filter-body {
  padding: 1.25rem 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.elite-filter-row {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}
/* Mode Tabs */
.elite-mode-tabs {
  display: flex;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 12px;
  padding: 4px;
  gap: 3px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);
}
.elite-mode-tabs button {
  padding: 0.5rem 1.4rem;
  border-radius: 9px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: none;
}
.elite-mode-tabs button.active {
  background: #0f172a;
  color: #34d399;
  box-shadow: 0 2px 8px -1px rgba(15, 23, 42, 0.4), 0 1px 2px rgba(15, 23, 42, 0.2);
}
.elite-mode-tabs button:hover:not(.active) {
  color: #334155;
  background: rgba(255, 255, 255, 0.5);
}
/* Date groups */
.elite-date-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 140px;
  max-width: 250px;
  flex: 1;
}
.group-period {
  order: -1;
}
.elite-date-group label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0;
}
.elite-input {
  width: 100%;
  padding: 0.6rem 1.2rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 9999px;
  font-family: inherit;
  font-size: 0.875rem;
  color: #1e293b;
  background: rgba(248, 250, 252, 0.8);
  transition: all 0.25s ease;
  box-sizing: border-box;
  font-weight: 500;
}
.elite-input:focus {
  border-color: #34d399;
  background: white;
  outline: none;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.08), 0 2px 8px -2px rgba(16, 185, 129, 0.12);
}
.elite-range-sep {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  color: #10b981;
  font-size: 1.1rem;
  font-weight: 600;
  opacity: 0.6;
}
/* Select groups */
.elite-select-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 150px;
  flex: 1;
}
.elite-select-group label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0;
}
.elite-select {
  width: 100%;
  padding: 0.6rem 2.5rem 0.6rem 1.2rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 9999px;
  font-family: inherit;
  font-size: 0.875rem;
  color: #1e293b;
  background: rgba(248, 250, 252, 0.8);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 14px;
  transition: all 0.25s ease;
  box-sizing: border-box;
  font-weight: 500;
}
.elite-select:focus {
  border-color: #34d399;
  background-color: white;
  outline: none;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.08), 0 2px 8px -2px rgba(16, 185, 129, 0.12);
}
.elite-filter-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #e2e8f0 30%, #e2e8f0 70%, transparent 100%);
}

/* ============================================
   ELITE TABLE — Dark Header + Premium Rows
   ============================================ */
.elite-table-container {
  background: white;
  border-radius: 20px;
  box-shadow:
    0 8px 32px -4px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.04);
}
.elite-table-toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid #d1fae5;
  background: linear-gradient(180deg, #ecfdf5 0%, #f0fdf4 50%, white 100%);
  position: relative;
}
.toolbar-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.toolbar-left svg { color: #10b981; }
.toolbar-left h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 800;
  color: #065f46;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: absolute;
  right: 1.75rem;
}
.record-badge {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  border: 1px solid rgba(16, 185, 129, 0.2);
  letter-spacing: 0.02em;
}
.elite-table-scroll { overflow-x: auto; }
.elite-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
.elite-table thead tr {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%);
}
.elite-table th {
  padding: 1rem 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  white-space: nowrap;
  position: relative;
}
.elite-table th:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0; top: 28%; height: 44%;
  width: 1px;
  background: rgba(255, 255, 255, 0.1);
}
.elite-table .elite-row {
  animation: fadeIn 0.4s ease forwards;
  opacity: 0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
}
.elite-table .elite-row:nth-child(1) { animation-delay: 0.03s; }
.elite-table .elite-row:nth-child(2) { animation-delay: 0.06s; }
.elite-table .elite-row:nth-child(3) { animation-delay: 0.09s; }
.elite-table .elite-row:nth-child(4) { animation-delay: 0.12s; }
.elite-table .elite-row:nth-child(5) { animation-delay: 0.15s; }
.elite-table .elite-row:nth-child(6) { animation-delay: 0.18s; }
.elite-table .elite-row:nth-child(7) { animation-delay: 0.21s; }
.elite-table .elite-row:nth-child(8) { animation-delay: 0.24s; }
.elite-table .elite-row:nth-child(odd) {
  background: rgba(16, 185, 129, 0.04);
}
.elite-table .elite-row:hover {
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.03) 50%, transparent 100%);
  box-shadow: inset 4px 0 0 #10b981;
}
.elite-table .elite-row:hover td:first-child {
  padding-left: calc(1.5rem + 4px);
}
.elite-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  font-size: 0.9rem;
  color: #334155;
  transition: padding 0.2s ease;
}

.deleting-row {
  animation: fadeOutDelete 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
  pointer-events: none;
}

@keyframes fadeOutDelete {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.98); opacity: 0.5; background-color: #fef2f2; }
  100% { transform: scale(0.95); opacity: 0; background-color: #fef2f2; }
}
.elite-table .elite-row:last-child td { border-bottom: none; }
/* Row Index Badge */
.row-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px; height: 32px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.78rem;
  color: #475569;
  transition: all 0.2s;
}
.elite-row:hover .row-index {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  color: #10b981;
}
/* Time Cell */
.elite-time-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.elite-time-main {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.elite-time-hm {
  font-weight: 700;
  font-size: 0.95rem;
  color: #1e293b;
  font-feature-settings: 'tnum';
  letter-spacing: 0.02em;
}
.elite-time-thu {
  color: #10b981;
  font-weight: 600;
  font-size: 0.7rem;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  letter-spacing: 0.02em;
}
.elite-time-period {
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.elite-time-period.is-morning {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.2);
}
.elite-time-period.is-afternoon {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.period-tag-mini {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 4px;
  margin-left: 0.4rem;
  text-transform: uppercase;
}
.period-tag-mini.is-morning {
  background: #fef3c7;
  color: #d97706;
}
.period-tag-mini.is-afternoon {
  background: #dbeafe;
  color: #2563eb;
}

.elite-time-date {
  font-size: 0.78rem;
  color: #047857;
  font-weight: 600;
  font-feature-settings: 'tnum';
}
/* Elite Action Buttons */
.elite-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
  margin-left: 0.35rem;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
}
.elite-action-btn.success {
  background: #10b981;
  color: white;
  box-shadow: 0 2px 6px -1px rgba(16, 185, 129, 0.3);
}
.elite-action-btn.success:hover {
  background: #059669;
  transform: scale(1.08);
  box-shadow: 0 4px 10px -2px rgba(16, 185, 129, 0.5);
}
.elite-action-btn.delete {
  background: #ef4444;
  color: white;
  box-shadow: 0 2px 6px -1px rgba(239, 68, 68, 0.3);
}
.elite-action-btn.delete:hover {
  background: #dc2626;
  transform: scale(1.08);
  box-shadow: 0 4px 10px -2px rgba(239, 68, 68, 0.5);
}

/* Filter mobile responsive */
@media (max-width: 768px) {
  .mobile-action-btn {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
    border-radius: 10px;
  }
  .elite-filter-panel {
    border-radius: 12px;
  }
  .elite-filter-header {
    padding: 0.75rem 1rem 0;
  }
  .elite-filter-header .elite-filter-title span {
    font-size: 0.85rem;
  }
  .elite-filter-body {
    padding: 0.75rem 1rem 1rem;
    gap: 0.6rem;
  }
  .elite-filter-divider {
    margin: 0.25rem 0;
  }

  /* Row 1: Mode tabs stay horizontal */
  .elite-filter-row {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 0.5rem;
  }
  .elite-mode-tabs {
    width: 100%;
  }
  .elite-mode-tabs button {
    flex: 1;
    justify-content: center;
    padding: 0.45rem 0.5rem;
    font-size: 0.8rem;
  }

  .elite-date-group {
    flex: 1;
    min-width: 0;
    max-width: none;
  }
  .elite-date-group.group-tabs {
    flex: 1 1 65% !important;
  }
  .elite-date-group.group-period {
    order: 0;
    flex: 1 1 25% !important;
    max-width: none !important;
  }
  .elite-date-group.group-date {
    flex: 1 1 40% !important;
  }
  
  .elite-date-group label {
    font-size: 0.7rem;
    margin-bottom: 0.15rem;
  }
  .elite-date-group .elite-input {
    padding: 0.45rem 0.6rem;
    font-size: 0.8rem;
  }
  .elite-range-sep {
    display: flex;
    font-size: 0.85rem;
    padding: 0 0.15rem;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  /* Row 3: Selects in 2x2 grid */
  .elite-filter-row:last-child {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  .elite-select-group {
    min-width: 0;
  }
  .elite-select-group label {
    font-size: 0.7rem;
    margin-bottom: 0.15rem;
  }

  /* Mobile overrides for Modal Form Actions Grid */
  .form-actions-grid {
    gap: 0.6rem;
  }
  .form-actions-grid > button {
    padding: 0.6rem 0.4rem !important;
    font-size: 0.85rem !important;
    min-height: 44px;
  }

  /* Compact Modal Layout for Mobile */
  .elite-modal-header {
    padding: 1rem 1.25rem 0.75rem;
  }
  .elite-modal-body {
    padding: 0.8rem 1.25rem 1.25rem;
    gap: 0.8rem;
  }
  .elite-form-row {
    gap: 0.8rem;
  }
  .elite-form-group {
    gap: 0.35rem;
  }
  .elite-form-group label {
    font-size: 0.75rem;
    margin-bottom: 0;
  }
  .elite-time-picker {
    padding: 0.6rem 0.75rem;
    gap: 0.6rem;
  }
  .elite-quick-times {
    margin-bottom: 0.25rem;
    gap: 0.5rem;
  }
  .elite-quick-btn {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
  .elite-modal-actions {
    margin-top: 0.25rem;
    padding-top: 0.75rem;
  }
  .elite-input, .elite-select {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>
