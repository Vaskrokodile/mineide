import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Mail, Shield, Users } from 'lucide-react';

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', servers: 5 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', servers: 2 },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'User', servers: 8 },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Admin', servers: 3 },
];

export const UsersPage: React.FC = () => {
  return (
    <div>
      <Header title="Users" description="Manage panel users" />
      <div className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <Input placeholder="Search users..." className="pl-9" />
          </div>
          <Button size="sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add User
          </Button>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--secondary)]/50">
                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Servers</th>
                    <th className="px-4 py-3 text-right text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-[var(--theme-primary)]/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--theme-button-primary)] to-[var(--theme-button-secondary)] flex items-center justify-center shadow-md shadow-[var(--theme-button-primary)]/20">
                            <span className="text-[10px] font-bold text-white">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-[var(--foreground)]">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                          <Mail className="h-3.5 w-3.5" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                          <Shield className="mr-0.5 h-2.5 w-2.5" />
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                          <Users className="h-3.5 w-3.5" />
                          {user.servers}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="hover:bg-[var(--theme-primary)]/10 text-xs">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};