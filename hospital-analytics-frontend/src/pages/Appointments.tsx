import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Search, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import api from '../lib/api';

interface Patient {
  id: number;
  name: string;
}

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

interface Appointment {
  id: number;
  patient: Patient;
  doctor: Doctor;
  appointmentTime: string;
  status: string;
  type: string;
}

export default function Appointments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // For booking
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [bookingData, setBookingData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    type: 'Checkup'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aptRes, patRes, docRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/patients'),
        api.get('/doctors')
      ]);
      setAppointments(aptRes.data);
      setPatients(patRes.data);
      setDoctors(docRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointment data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAppointments = appointments.filter(apt => 
    apt.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    apt.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const appointmentTime = `${bookingData.date}T${bookingData.time}:00`;
    
    api.post('/appointments', {
      patientId: parseInt(bookingData.patientId),
      doctorId: parseInt(bookingData.doctorId),
      appointmentTime,
      type: bookingData.type
    })
    .then(() => {
      fetchData();
      setIsModalOpen(false);
      setBookingData({ patientId: '', doctorId: '', date: '', time: '', type: 'Checkup' });
    })
    .catch(error => {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please check inputs.');
    });
  };

  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timeStr;
    }
  };

  const formatDate = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleDateString();
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Appointments</h1>
          <p className="text-slate-500 mt-1">Manage patient appointments and hospital schedules</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" /> Book Appointment
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>Today's appointments across all departments</CardDescription>
          </div>
          <div className="w-72">
            <Input 
              icon={<Search className="w-4 h-4" />} 
              placeholder="Search by patient or doctor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <div className="p-0">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading schedule...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor & Dept</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.length > 0 ? filteredAppointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell className="font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <User className="w-4 h-4" />
                        </div>
                        {apt.patient?.name || 'Unknown Patient'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{apt.doctor?.name || 'Unassigned'}</span>
                        <span className="text-xs text-slate-500">{apt.doctor?.specialization || 'General'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1 text-slate-700">
                          <Calendar className="w-3 h-3 text-slate-400" /> {formatDate(apt.appointmentTime)}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <Clock className="w-3 h-3" /> {formatTime(apt.appointmentTime)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">{apt.type}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        apt.status === 'SCHEDULED' ? 'info' : 
                        apt.status === 'ATTENDED' ? 'success' : 
                        apt.status === 'MISSED' ? 'danger' : 'outline'
                      }>
                        {apt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Details</Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                      No appointments found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
      
      {/* Smart Doctor Recommendation Engine Window kept as visual feature */}
      <h2 className="text-lg font-semibold tracking-tight text-slate-900 mt-8 mb-4">Smart Doctor Recommendation Engine</h2>
      <Card className="bg-gradient-to-br from-primary-50 to-white border-primary-100 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 space-y-4">
              <h3 className="text-primary-800 font-medium text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-500" /> Need to schedule a new patient?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our smart recommendation engine analyzes current doctor workload, department flow limits, and sub-specialties to suggest the best available doctors immediately.
              </p>
              <div className="flex gap-3">
                <Button variant="default" onClick={() => setIsModalOpen(true)}>Try Booking Flow</Button>
                <Button variant="outline">View Workload Map</Button>
              </div>
            </div>
            <div className="w-full md:w-1/3 h-40 bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col justify-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">EC</div>
                 <div>
                   <p className="font-semibold text-sm text-slate-900">Dr. Emily Chen</p>
                   <p className="text-xs text-slate-500">Cardiology • 85% Available</p>
                 </div>
               </div>
               <Badge variant="success" className="w-fit mb-2">Recommended</Badge>
               <p className="text-xs text-slate-500 mt-1">Has 3 open slots this afternoon.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Book Appointment"
        description="Schedule a new patient visit and select from our available specialists."
      >
        <form onSubmit={handleBookAppointment} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Patient</label>
            <Select 
              required 
              value={bookingData.patientId} 
              onChange={(e) => setBookingData({ ...bookingData, patientId: e.target.value })}
            >
              <option value="" disabled>Select patient...</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Doctor</label>
            <Select 
              required 
              value={bookingData.doctorId} 
              onChange={(e) => setBookingData({ ...bookingData, doctorId: e.target.value })}
            >
              <option value="" disabled>Select doctor...</option>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Date</label>
              <Input 
                type="date" 
                required 
                value={bookingData.date} 
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Time</label>
              <Input 
                type="time" 
                required 
                value={bookingData.time} 
                onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Appointment Type</label>
            <Select 
              required 
              value={bookingData.type} 
              onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
            >
              <option value="Checkup">Checkup</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Consultation">Consultation</option>
              <option value="Surgery">Surgery</option>
              <option value="Vaccination">Vaccination</option>
            </Select>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Confirm Booking</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
