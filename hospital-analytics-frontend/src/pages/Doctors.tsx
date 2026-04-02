import { useState, useEffect } from 'react';
import { Search, Stethoscope, UserPlus, HeartPulse, Brain, Bone, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import api from '../lib/api';

interface Doctor {
  id: string | number;
  name: string;
  specialization: string;
  experience: number;
  availability: string;
  workload: number;
  rating: number;
}

const departments = ['All', 'Cardiology', 'Orthopedics', 'Neurology', 'Pediatrics'];

const getIconForSpecialization = (spec: string) => {
  const s = spec.toLowerCase();
  if (s.includes('cardio')) return HeartPulse;
  if (s.includes('neuro')) return Brain;
  if (s.includes('ortho')) return Bone;
  if (s.includes('pediat')) return Activity;
  return Stethoscope;
};

const getColorForSpecialization = (spec: string) => {
  const s = spec.toLowerCase();
  if (s.includes('cardio')) return { color: 'text-red-500', bg: 'bg-red-50' };
  if (s.includes('neuro')) return { color: 'text-indigo-500', bg: 'bg-indigo-50' };
  if (s.includes('ortho')) return { color: 'text-orange-500', bg: 'bg-orange-50' };
  if (s.includes('pediat')) return { color: 'text-emerald-500', bg: 'bg-emerald-50' };
  return { color: 'text-primary-500', bg: 'bg-primary-50' };
};

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New doctor form
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialization: '',
    experience: 0,
    availability: 'Available'
  });

  const fetchDoctors = () => {
    setLoading(true);
    api.get('/doctors')
      .then(response => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || doc.specialization === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const doctorData = {
      ...newDoctor,
      workload: Math.floor(Math.random() * 50) + 20, // Initial workload
      rating: 4.5
    };

    api.post('/doctors', doctorData)
      .then(() => {
        fetchDoctors();
        setIsModalOpen(false);
        setNewDoctor({ name: '', specialization: '', experience: 0, availability: 'Available' });
      })
      .catch(error => {
        console.error('Error saving doctor:', error);
        alert('Failed to save doctor details.');
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Doctors & Workload</h1>
          <p className="text-slate-500 mt-1">Monitor doctor capacity across all hospital departments</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <UserPlus className="w-4 h-4" /> Add Doctor
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <div className="w-full max-w-sm">
          <Input 
            icon={<Search className="w-4 h-4" />} 
            placeholder="Search doctors by name or specialization..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {departments.map(dept => (
            <Badge 
              key={dept}
              variant={activeTab === dept ? "default" : "outline"} 
              className={`cursor-pointer ${activeTab !== dept ? 'bg-white text-slate-500 font-normal hover:bg-slate-50' : ''}`}
              onClick={() => setActiveTab(dept)}
            >
              {dept}
            </Badge>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading doctors...</div>
      ) : filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDoctors.map(doc => {
            const Icon = getIconForSpecialization(doc.specialization);
            const { color, bg } = getColorForSpecialization(doc.specialization);
            return (
              <Card key={doc.id} className="overflow-visible hover:border-primary-200 transition-colors">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg} ${color} shadow-sm border border-white`}>
                      <Icon className={`w-6 h-6 ${doc.workload > 90 ? 'animate-heartbeat' : ''}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{doc.name}</CardTitle>
                      <CardDescription className="text-xs font-medium">{doc.specialization}</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant={doc.availability === 'Available' ? 'success' : 'warning'} className="text-[10px] py-0">
                      {doc.availability}
                    </Badge>
                    <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      ⭐ {doc.rating}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Experience</span>
                    <span className="font-semibold text-slate-700">{doc.experience} years</span>
                  </div>
                  
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Resource Load</span>
                      <span className={`font-medium ${doc.workload > 90 ? 'text-red-600' : 'text-primary-600'}`}>{doc.workload}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          doc.workload > 90 ? 'bg-red-500' : doc.workload > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} 
                        style={{ width: `${doc.workload}%` }} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="w-full h-32 flex items-center justify-center bg-white border border-slate-200 border-dashed rounded-xl text-slate-500">
          No doctors found for this filter.
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Hospital Staff"
        description="Onboard a new doctor or specialist into the tracking system."
      >
        <form onSubmit={handleAddDoctor} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Doctor Name</label>
            <Input 
              placeholder="E.g., Dr. Jane Smith" 
              required 
              value={newDoctor.name} 
              onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Specialization</label>
            <Select 
              required 
              value={newDoctor.specialization} 
              onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
            >
              <option value="" disabled>Select specialization...</option>
              {departments.filter(d => d !== 'All').map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
              <option value="General">General Practice</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Experience (Years)</label>
              <Input 
                type="number" 
                min="0" 
                required 
                value={newDoctor.experience || ''} 
                onChange={(e) => setNewDoctor({ ...newDoctor, experience: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Availability</label>
              <Select 
                required 
                value={newDoctor.availability} 
                onChange={(e) => setNewDoctor({ ...newDoctor, availability: e.target.value })}
              >
                <option value="Available">Available</option>
                <option value="On Break">On Break</option>
                <option value="Busy">Busy</option>
              </Select>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Doctor</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
