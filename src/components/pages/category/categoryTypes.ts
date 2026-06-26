export type TabType = 'setup' | 'attributes' | 'relationships' | 'approval' | 'version-history' | 'publish';
export type RelationshipType = '1-1' | '1-n' | 'n-1' | 'n-n';
export type RelationshipStatus = 'active' | 'inactive';

export type LifecycleStatus = 'active' | 'draft' | 'inactive' | 'archived' | 'pending_approval' | 'pending_expiration';
export type DataType = 'standard' | 'reference' | 'transactional';
export type ScopeType = 'national' | 'ministry' | 'provincial' | 'internal';
export type DataSourceType = 'dldc' | 'lgsp' | 'ndxp' | 'manual';
export type UpdateStrategyType = 'reference' | 'scheduled' | 'realtime';
export type SyncFrequencyType = 'daily' | 'weekly' | 'monthly' | 'event';
export type FieldDataType = 'string' | 'number' | 'date' | 'datetime' | 'boolean' | 'text' | 'email' | 'phone' | 'url';
export type ApprovalType = 'category' | 'structure' | 'version' | 'relationship' | 'expire';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'partial';

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  actionType?: 'create' | 'update' | 'expire';
  entityId: string;
  entityCode: string;
  entityName: string;
  requestedBy: string;
  requestedDate: string;
  status: ApprovalStatus;
  reviewedBy?: string;
  reviewedDate?: string;
  comments?: string;
  changes?: any;
  lineStatuses?: Record<string, 'approved' | 'rejected'>;
}

export interface CustomField {
  id: string;
  name: string;
  dataType: FieldDataType;
  length?: number;
  defaultValue?: string;
  isPrimaryKey: boolean;
  foreignKey?: string;
}

export interface MasterDataAttribute {
  id: string;
  fieldName: string;
  displayName: string;
  dataType: FieldDataType;
  length?: number;
  required: boolean;
  unique: boolean;
  indexed: boolean;
  defaultValue?: string;
  description?: string;
  validationRules?: string;
  createdDate: string;
  version: number;
  status?: 'draft' | ApprovalStatus;
  submittedDate?: string;
  approvedDate?: string;
  sourceType?: 'manual' | 'reference' | 'system';
  sourceTable?: string;
  sourceField?: string;
  sourceKey?: string;
  apiEndpoint?: string;
  jsonPath?: string;
  masked?: boolean;
  keyType?: 'primary' | 'foreign' | 'none';
  foreignTable?: string;
  foreignField?: string;
}

export interface EntityRelationship {
  id: string;
  sourceEntityId: string;
  sourceEntityName: string;
  targetEntityId: string;
  targetEntityName: string;
  relationshipType: RelationshipType;
  mappingTable?: string;
  sourceKey?: string;
  targetKey?: string;
  targetDisplayField?: string;
  status: RelationshipStatus;
  createdDate: string;
  createdBy: string;
  updatedDate?: string;
  updatedBy?: string;
}

export interface MasterDataEntity {
  id: string;
  code: string;
  name: string;
  dataType: DataType;
  managingAgency: string;
  scope: ScopeType;
  description: string;
  lifecycleStatus: LifecycleStatus;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  databaseSystem?: string;
  canCu?: string;
  // Data source fields
  dataSource?: DataSourceType;
  dldcTable?: string;
  dldcColumns?: string[];
  apiSystem?: string;
  apiManagingUnit?: string;
  apiEndpoint?: string;
  apiMethod?: 'GET' | 'POST' | 'PUT';
  apiAuthType?: 'none' | 'bearer' | 'apikey';
  apiBearerToken?: string;
  apiKeyName?: string;
  apiKeyValue?: string;
  apiParams?: { key: string; value: string }[];
  apiHeaders?: { key: string; value: string }[];
  apiBody?: string;
  updateStrategy?: UpdateStrategyType;
  syncFrequency?: SyncFrequencyType;
  customFields?: CustomField[];
  version?: number;
}
