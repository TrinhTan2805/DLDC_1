export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  callCycle: number;
  dbAgentId?: string;
  agentKey?: string;
  lastDbUpdate?: string;
  fileAgent: {
    id: string;
    url: string;
    isActive: boolean;
    status: 'active' | 'inactive';
  };
  databases: {
    id: string;
    name: string;
    originalName: string;
    type: string;
    status: string;
  }[];
}

export const initialAgents: Agent[] = [
  {
    id: '7',
    name: 'Trạm HL',
    status: 'inactive',
    callCycle: 30,
    dbAgentId: '7',
    agentKey: '03a7e504b44e272d32afc60d1eec6093',
    lastDbUpdate: '17:44:54 20-11-2025',
    fileAgent: {
      id: 'GS-HienLT52',
      url: 'http://10.86.142.136:1201',
      isActive: false,
      status: 'inactive'
    },
    databases: [
      { id: '348', name: 'ExportFile_CapDonViToanQuoc', originalName: 'cap_don_vi_tinh_moi_toan_quoc_new_one_sheet', type: 'FILE', status: 'DATA_UPDATED' },
      { id: '350', name: 'ExportFile_DuLieuMauJSON', originalName: 'DuLieuMau', type: 'FILE', status: 'DATA_UPDATED' },
      { id: '352', name: 'ExportFile_DonViCapPhuongXaMoi', originalName: 'cap_don_vi_phuong_moi_toan_quoc_update', type: 'FILE', status: 'DATA_UPDATED' },
      { id: '353', name: 'ImportAPI_DNI_GDDT_DM_KhenThuong', originalName: 'DNI_GDDT_DM_KhenThuong', type: 'API', status: 'DATA_INCOMPLETED' },
      { id: '355', name: 'ExportFile_DanhMucKhenThuongJSON', originalName: 'DanhMucKhenThuong', type: 'FILE', status: 'DATA_INCOMPLETED' },
      { id: '358', name: 'ExportFile_UserProfiles64', originalName: 'UserProfiles', type: 'FILE', status: 'DATA_UPDATED' },
    ]
  },
  {
    id: '2',
    name: 'Trạm TH',
    status: 'active',
    callCycle: 60,
    dbAgentId: '2',
    agentKey: 'b7e2a9c1d0f5g4h3j2k1l0m9n8o7p6q5',
    lastDbUpdate: '09:15:22 18-11-2025',
    fileAgent: {
      id: 'Agent-TH-01',
      url: 'http://192.168.1.100:1201',
      isActive: true,
      status: 'active'
    },
    databases: [
      { id: '101', name: 'DB_Citizen_Info', originalName: 'citizen_info_v2', type: 'DBT_POSTGRES_14', status: 'DATA_UPDATED' },
    ]
  }
];
