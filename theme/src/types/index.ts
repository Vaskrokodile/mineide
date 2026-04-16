export interface User {
  id: number;
  external_id: string | null;
  uuid: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  language: string;
  root_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Server {
  id: number;
  external_id: string | null;
  uuid: string;
  identifier: string;
  name: string;
  description: string;
  status: ServerStatus;
  node: number;
  user: number;
  allocation: number;
  nest: number;
  egg: number;
  created_at: string;
  updated_at: string;
}

export type ServerStatus = 'installing' | 'installed' | 'suspended' | 'restoring_backup' | null;

export interface Node {
  id: number;
  uuid: string;
  name: string;
  description: string;
  location_id: number;
  fqdn: string;
  scheme: string;
  behind_proxy: boolean;
  maintenance_mode: boolean;
  memory: number;
  memory_overallocate: number;
  disk: number;
  disk_overallocate: number;
  cpu: number;
  cpu_overallocate: number;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Allocation {
  id: number;
  ip: string;
  port: number;
  alias: string | null;
  assigned: boolean;
}

export interface Database {
  id: number;
  name: string;
  username: string;
  remote: string;
  max_connections: number;
  created_at: string;
}

export interface Nest {
  id: number;
  uuid: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Egg {
  id: number;
  nest: number;
  uuid: string;
  name: string;
  description: string;
  docker_image: string;
  startup: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  object: 'list';
  data: T[];
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    };
  };
}