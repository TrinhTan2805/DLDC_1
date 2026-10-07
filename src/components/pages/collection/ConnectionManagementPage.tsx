import { useState } from 'react';
import { Server, Monitor, Network } from 'lucide-react';
import { SourceSystemManagementPage } from './SourceSystemManagementPage';
import { AgentManagementPage } from './AgentManagementPage';
import { UnitManagementPage } from './UnitManagementPage';
import { tabClass } from './collectionUi';

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
    <div className="flex flex-col h-full bg-[#F8FAFC] min-h-screen">
      {/* Tab Navigation (compomennt.md 5.9) */}
      <div className="bg-white border-b border-[#E2E8F0] px-6">
        <div className="flex items-center">
          <button type="button" onClick={() => setActiveTab('units')} className={tabClass(activeTab === 'units')}>
            <Network className="w-4 h-4" />
            Quản lý đơn vị
          </button>
          <button type="button" onClick={() => setActiveTab('source-systems')} className={tabClass(activeTab === 'source-systems')}>
            <Server className="w-4 h-4" />
            Hệ thống nguồn
          </button>
          <button type="button" onClick={() => setActiveTab('agents')} className={tabClass(activeTab === 'agents')}>
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
  );
}
