import React, { useState } from 'react';
import { OpenDataCategoryFilters, OpenDataCategoryFilterPanel } from '../OpenDataCategoryFilters';
import { OpenDataCategoryActions } from '../OpenDataCategoryActions';
import { OpenDataCategoryGrid } from './OpenDataCategoryGrid';
import { OpenDataCategoryPagination } from './OpenDataCategoryPagination';
import { CategoryItem } from '../../OpenDataCategoryPage';

interface FilesTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  filteredData: CategoryItem[];
  paginatedData: CategoryItem[];
  totalItems: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  onViewDetail: (item: CategoryItem) => void;
  onEdit: (item: CategoryItem) => void;
  onDelete: (item: CategoryItem) => void;
  onViewVersion?: (item: CategoryItem) => void;
  activeTab: string;
  licenseFilter: string;
  setLicenseFilter: (license: string) => void;
  startDateFilter: string;
  setStartDateFilter: (date: string) => void;
  endDateFilter: string;
  setEndDateFilter: (date: string) => void;
}

export function FilesTab({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  filteredData,
  paginatedData,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  onViewDetail,
  onEdit,
  onDelete,
  onViewVersion,
  activeTab,
  licenseFilter,
  setLicenseFilter,
  startDateFilter,
  setStartDateFilter,
  endDateFilter,
  setEndDateFilter
}: FilesTabProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-3">
        <OpenDataCategoryFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
        <OpenDataCategoryActions />
      </div>

      {/* Advanced Filter Collapsible Panel */}
      {showFilters && (
        <OpenDataCategoryFilterPanel
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          licenseFilter={licenseFilter}
          setLicenseFilter={setLicenseFilter}
          startDateFilter={startDateFilter}
          setStartDateFilter={setStartDateFilter}
          endDateFilter={endDateFilter}
          setEndDateFilter={setEndDateFilter}
        />
      )}

      {/* Data Grid Table and Pagination card container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <OpenDataCategoryGrid
          paginatedData={paginatedData}
          currentPage={currentPage}
          pageSize={pageSize}
          onViewDetail={onViewDetail}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewVersion={onViewVersion}
          activeTab={activeTab}
        />
        <OpenDataCategoryPagination
          total={filteredData.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      </div>
    </div>
  );
}
