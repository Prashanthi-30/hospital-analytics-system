import { useState, useEffect } from 'react';
import { Search, UserPlus, FileText, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import api from '../lib/api';

interface Patient {
  id: string | number;
  name: string;
  gender: string;
  age: number;
  lastVisit: string;
  attendanceRate: string;
  status: string;
  email?: string;
  phone?: string;
}

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [newPatient, setNewPatient] = useState({
    name: '',
    gender: '',
    age: 0,
    phone: '',
    email: '',
  });

  const fetchPatients = () => {
    setLoading(true);
    api.get('/patients')
      .then(response => {
        setPatients(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching patients:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const patientData = {
      ...newPatient,
      status: 'active',
      attendanceRate: '100%',
      lastVisit: new Date().toISOString().split('T')[0]
    };

    api.post('/patients', patientData)
      .then(() => {
        fetchPatients();
        setIsModalOpen(false);
        setNewPatient({ name: '', gender: '', age: 0, phone: '', email: '' });
      })
      .catch(error => {
        console.error('Error saving patient:', error);
        alert('Failed to save patient. Please try again.');
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patients</h1>
          <p className="text-slate-500 mt-1">Manage patient records and track their hospital attendance</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <UserPlus className="w-4 h-4" /> Add Patient
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle>Patient Database</CardTitle>
            <CardDescription>View all registered hospital patients</CardDescription>
          </div>
          <div className="w-72">
            <Input 
              icon={<Search className="w-4 h-4" />} 
              placeholder="Search by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <div className="p-0">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading patients...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Demographics</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Attendance Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-mono text-xs text-slate-500">P-{patient.id}</TableCell>
                    <TableCell className="font-medium text-slate-900">{patient.name}</TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {patient.gender}, {patient.age} yrs
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{patient.lastVisit}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${parseInt(patient.attendanceRate || '0') >= 80 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                            style={{ width: patient.attendanceRate }} 
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-600">{patient.attendanceRate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {patient.status === 'active' 
                        ? <Badge variant="success">Active</Badge>
                        : <Badge variant="danger">High No-Show Risk</Badge>
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary-600">
                          <Activity className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary-600">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                      No patients found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Patient"
        description="Register a new patient into the hospital system."
      >
        <form onSubmit={handleAddPatient} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <Input 
              placeholder="E.g., John Doe" 
              required 
              value={newPatient.name} 
              onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Gender</label>
              <Select 
                required 
                value={newPatient.gender} 
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
              >
                <option value="" disabled>Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Age</label>
              <Input 
                type="number" 
                min="0" max="150" 
                placeholder="E.g., 34" 
                required 
                value={newPatient.age || ''} 
                onChange={(e) => setNewPatient({ ...newPatient, age: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Contact Number</label>
            <Input 
              type="tel" 
              placeholder="+1 (555) 000-0000" 
              required 
              value={newPatient.phone} 
              onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <Input 
              type="email" 
              placeholder="john.doe@example.com" 
              required 
              value={newPatient.email} 
              onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
            />
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Patient</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
