import React, { useState, useEffect } from 'react';
import { Search, Database, Shield, Settings } from 'lucide-react';
import { provisionServicesData, ProvisionService } from '../../../data/provisionServicesData';
import { PacketDesignTab } from './tabs/PacketDesignTab';
import { AccessControlTab } from './tabs/AccessControlTab';

interface DataProvisionServicesPageProps {
  category: 'internal' | 'shared' | 'open' | 'master';
  group?: string;
  title: string;
  description: string;
}

export function DataProvisionServicesPage({ category, group, title, description }: DataProvisionServicesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<ProvisionService | null>(null);
  const [activeTab, setActiveTab] = useState<'packet' | 'access'>('packet');

  // Lọc dữ liệu theo category và group
  const groupData = provisionServicesData.filter(item => {
    const matchesCategory = item.category === category;
    const matchesGroup = group ? item.group === group : true;
    return matchesCategory && matchesGroup;
  });

  const filteredInnerList = groupData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (filteredInnerList.length > 0 && !selectedService) {
      setSelectedService(filteredInnerList[0]);
    }
  }, [group, category, filteredInnerList, selectedService]);

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50 flex-shrink-0">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h3 className="font-semibold text-slate-800 text-lg mb-4">{group || title}</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm dữ liệu..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredInnerList.map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedService(item)}
              className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-colors ${
                selectedService?.id === item.id
                  ? 'bg-blue-50 border border-blue-200 text-blue-700 font-medium'
                  : 'hover:bg-slate-100 text-slate-600 border border-transparent'
              }`}
            >
              {item.name}
            </button>
          ))}
          {filteredInnerList.length === 0 && (
            <div className="p-4 text-center text-sm text-slate-500">
              Không tìm thấy dữ liệu phù hợp
            </div>
          )}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {selectedService ? (
          <>
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-2">{selectedService.name}</h2>
              <p className="text-sm text-slate-500">
                Nguồn dữ liệu: {selectedService.group || selectedService.category} | Dữ liệu {selectedService.category === 'internal' ? 'danh mục nội ngành' : 'dùng chung'}
              </p>
            </div>
            
            <div className="px-6 pt-4 border-b border-slate-200 bg-slate-50">
              <div className="flex space-x-6">
                <button
                  onClick={() => setActiveTab('packet')}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
                    activeTab === 'packet'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Thiết kế cấu trúc gói tin
                </button>
                <button
                  onClick={() => setActiveTab('access')}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
                    activeTab === 'access'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Cấu hình quyền truy cập
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              {activeTab === 'packet' && <PacketDesignTab service={selectedService} />}
              {activeTab === 'access' && <AccessControlTab service={selectedService} />}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 bg-slate-50">
            <div className="text-center">
              <Database className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Vui lòng chọn một dữ liệu để xem chi tiết</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
