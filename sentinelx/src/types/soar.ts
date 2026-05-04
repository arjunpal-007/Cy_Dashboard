export type WorkflowTrigger = 'brute_force' | 'suspicious_login' | 'sql_injection' | 'data_exfiltration' | 'malware_detection' | 'manual';

export type WorkflowStatus = 'active' | 'inactive' | 'executing' | 'completed' | 'failed' | 'paused';

export type ActionType = 
  | 'identify_ip'
  | 'check_reputation'
  | 'block_ip'
  | 'lock_account'
  | 'create_alert'
  | 'create_incident'
  | 'notify_admin'
  | 'compare_geolocation'
  | 'flag_anomaly'
  | 'send_mfa_request'
  | 'notify_user'
  | 'block_request'
  | 'log_payload'
  | 'increase_risk_score'
  | 'monitor_data_volume'
  | 'flag_behavior'
  | 'restrict_access'
  | 'notify_security_team'
  | 'isolate_system'
  | 'scan_file'
  | 'block_execution'
  | 'track_ip_activity'
  | 'escalate_approval';

export interface WorkflowAction {
  id: string;
  type: ActionType;
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  enabled: boolean;
  order: number;
  requiresApproval: boolean;
  timeout?: number;
  retryCount?: number;
}

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'in' | 'not_in';
  value: unknown;
  enabled: boolean;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  actions: WorkflowAction[];
  conditions?: WorkflowCondition[];
  order: number;
  isParallel: boolean;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: WorkflowStatus;
  startTime: Date;
  endTime?: Date;
  triggeredBy: 'automatic' | 'manual';
  triggerData?: Record<string, unknown>;
  currentStep?: string;
  executedSteps: Array<{
    stepId: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    startTime?: Date;
    endTime?: Date;
    result?: unknown;
    error?: string;
  }>;
  logs: Array<{
    timestamp: Date;
    level: 'info' | 'warning' | 'error';
    message: string;
    stepId?: string;
  }>;
}

export interface SOARWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  status: WorkflowStatus;
  enabled: boolean;
  steps: WorkflowStep[];
  conditions: WorkflowCondition[];
  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    lastExecuted?: Date;
    executionCount: number;
    successCount: number;
    failureCount: number;
    averageExecutionTime: number;
  };
  configuration: {
    autoTrigger: boolean;
    requireApproval: boolean;
    timeout: number;
    retryAttempts: number;
    notificationChannels: string[];
  };
}

export interface SOARDashboard {
  activeWorkflows: number;
  totalExecutions: number;
  successRate: number;
  averageExecutionTime: number;
  recentExecutions: WorkflowExecution[];
  workflowStats: Array<{
    workflowId: string;
    workflowName: string;
    executions: number;
    successRate: number;
    lastExecution: Date;
  }>;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  category: string;
  template: Partial<SOARWorkflow>;
  isRecommended: boolean;
}
