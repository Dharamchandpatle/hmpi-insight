import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { motion } from 'framer-motion';
import {
    Calendar,
    Download,
    FileText,
    Filter,
    Search,
    Shield,
    User
} from 'lucide-react';
import { useState } from 'react';

// Generate mock audit logs
const generateAuditLogs = () => {
  const actions = [
    'User Login', 'User Logout', 'Data Upload', 'Sample Added', 'Sample Modified',
    'Sample Deleted', 'Report Generated', 'Settings Changed', 'User Created',
    'User Modified', 'Alert Acknowledged', 'System Backup', 'Password Changed'
  ];

  const users = ['admin', 'scientist1', 'scientist2', 'policymaker1', 'system'];
  const severities = ['info', 'warning', 'error', 'critical'];

  const logs = [];
  for (let i = 0; i < 100; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    logs.push({
      id: i + 1,
      timestamp: date.toISOString(),
      user: users[Math.floor(Math.random() * users.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      details: `Additional details for ${actions[Math.floor(Math.random() * actions.length)].toLowerCase()}`,
      status: Math.random() > 0.1 ? 'success' : 'failed'
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const AuditLogsTab = () => {
  const [logs] = useState(generateAuditLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7days');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUser = userFilter === 'all' || log.user === userFilter;
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;

    // Date filtering
    const logDate = new Date(log.timestamp);
    const now = new Date();
    let dateMatch = true;

    switch (dateRange) {
      case '1day':
        dateMatch = (now - logDate) <= (24 * 60 * 60 * 1000);
        break;
      case '7days':
        dateMatch = (now - logDate) <= (7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        dateMatch = (now - logDate) <= (30 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateMatch = true;
    }

    return matchesSearch && matchesUser && matchesAction && matchesSeverity && dateMatch;
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'success'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const handleExportLogs = () => {
    const csvContent = [
      ['ID', 'Timestamp', 'User', 'Action', 'Severity', 'Status', 'IP Address', 'Details'],
      ...filteredLogs.map(log => [
        log.id,
        log.timestamp,
        log.user,
        log.action,
        log.severity,
        log.status,
        log.ipAddress,
        log.details
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit_logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const auditStats = {
    total: logs.length,
    today: logs.filter(log => {
      const today = new Date();
      const logDate = new Date(log.timestamp);
      return logDate.toDateString() === today.toDateString();
    }).length,
    errors: logs.filter(log => log.severity === 'error' || log.severity === 'critical').length,
    failed: logs.filter(log => log.status === 'failed').length
  };

  const uniqueUsers = [...new Set(logs.map(log => log.user))];
  const uniqueActions = [...new Set(logs.map(log => log.action))];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Audit Logs</h2>
          <p className="text-muted-foreground">System activity tracking and security monitoring</p>
        </div>
        <Button onClick={handleExportLogs} className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Logs</span>
        </Button>
      </div>

      {/* Audit Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{auditStats.total}</p>
                <p className="text-xs text-muted-foreground">Total Logs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{auditStats.today}</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{auditStats.errors}</p>
                <p className="text-xs text-muted-foreground">Errors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{auditStats.failed}</p>
                <p className="text-xs text-muted-foreground">Failed Actions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </CardTitle>
          <CardDescription>
            Filter audit logs by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>User</Label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map(user => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Action</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map(action => (
                    <SelectItem key={action} value={action}>{action}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Severity</Label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1day">Last 24 Hours</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} of {logs.length} audit entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.slice(0, 50).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.user}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(log.severity)}>
                        {log.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                    <TableCell className="max-w-xs truncate" title={log.details}>
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length > 50 && (
            <div className="flex justify-center mt-4">
              <p className="text-sm text-muted-foreground">
                Showing first 50 results. Export to see all logs.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuditLogsTab;