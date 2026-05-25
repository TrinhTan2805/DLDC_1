import React, { useState } from 'react';
import { Server, Monitor, Network } from 'lucide-react';
import { SourceSystemManagementPage } from './SourceSystemManagementPage';
import { AgentManagementPage } from './AgentManagementPage';
import { UnitManagementPage } from './UnitManagementPage';

export interface Unit {
  id: string;
  unitName: string;
  unitCode: string;
  unitType: string;
}

const initialUnits: Unit[] = [
  {
    id: '1',
    unitName: 'Cục Hộ tịch, quốc tịch, chứng thực',
    unitCode: 'CHQTCT',
    unitType: 'Trong ngành'
  },
  {
    id: '2',
    unitName: 'Trung tâm Lý lịch tư pháp quốc gia',
    unitCode: 'TTLLTPQG',
    unitType: 'Trong ngành'
  },
  {
    id: '3',
    unitName: 'Cục Công nghệ thông tin',
    unitCode: 'CCNTT',
    unitType: 'Trong ngành'
  }
];

export interface ConnectionManagementPageProps {
  activeTab?: 'units' | 'source-systems' | 'agents';
  onTabChange?: (tab: 'units' | 'source-systems' | 'agents') => void;
}

export function ConnectionManagementPage({ activeTab: propActiveTab, onTabChange }: ConnectionManagementPageProps = {}) {
  const [localActiveTab, setLocalActiveTab] = useState<'units' | 'source-systems' | 'agents'>('units');
  const activeTab = propActiveTab !== undefined ? propActiveTab : localActiveTab;
  const setActiveTab = (tab: 'units' | 'source-systems' | 'agents') => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setLocalActiveTab(tab);
    }
  };

  const [units, setUnits] = useState<Unit[]>(initialUnits);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
      <div className="flex flex-col h-full bg-[#f8f9fa] min-h-screen">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setActiveTab('units')}
            className={`py-4 px-2 border-b-2 transition-all flex items-center gap-2 font-medium text-[13px] ${
              activeTab === 'units'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Network className="w-4 h-4" />
            Quản lý đơn vị
          </button>
          <button
            onClick={() => setActiveTab('source-systems')}
            className={`py-4 px-2 border-b-2 transition-all flex items-center gap-2 font-medium text-[13px] ${
              activeTab === 'source-systems'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Server className="w-4 h-4" />
            Hệ thống nguồn
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`py-4 px-2 border-b-2 transition-all flex items-center gap-2 font-medium text-[13px] ${
              activeTab === 'agents'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Monitor className="w-4 h-4" />
            Trạm kết nối
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'units' ? (
          <UnitManagementPage units={units} onUnitsChange={setUnits} />
        ) : activeTab === 'source-systems' ? (
          <SourceSystemManagementPage units={units} />
        ) : (
          <AgentManagementPage />
        )}
      </div>
    </div>
    </div>
  );
}
