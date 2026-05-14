import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { employeeAPI } from '../../../services/api';
import toast from 'react-hot-toast';

const API_SERVER = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api').replace('/api', '');
const getPhotoUrl = (photo?: string) => {
  if (!photo) return null;
  if (photo.startsWith('http')) return photo;
  return `${API_SERVER}${photo}`;
};

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department?: string;
  photo?: string;
  notes?: string;
  active: boolean;
  order?: number;
}

const DEPARTMENTS = ['Leadership', 'Management', 'Advisory'];

const emptyForm = {
  firstName: '',
  lastName: '',
  position: '',
  department: 'Management',
  notes: '',
  active: true,
  photo: null as File | null,
};

const TeamManagement = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await employeeAPI.getAll();
      const data: TeamMember[] = Array.isArray(res.data) ? res.data : [];
      setMembers(data);
      // Load saved order from localStorage, append any new members at end
      const saved: string[] = JSON.parse(localStorage.getItem('falcon_team_order') || '[]');
      const allIds = data.map(m => m.id);
      const merged = [...saved.filter(id => allIds.includes(id)), ...allIds.filter(id => !saved.includes(id))];
      setOrderedIds(merged);
    } catch {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const saveOrder = (ids: string[]) => {
    setOrderedIds(ids);
    localStorage.setItem('falcon_team_order', JSON.stringify(ids));
  };

  const moveUp = (id: string) => {
    const idx = orderedIds.indexOf(id);
    if (idx <= 0) return;
    const next = [...orderedIds];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    saveOrder(next);
  };

  const moveDown = (id: string) => {
    const idx = orderedIds.indexOf(id);
    if (idx < 0 || idx >= orderedIds.length - 1) return;
    const next = [...orderedIds];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    saveOrder(next);
  };

  const openAdd = () => {
    setSelected(null);
    setFormData({ ...emptyForm });
    setPhotoPreview(null);
    setIsModalOpen(true);
  };

  const openEdit = (m: TeamMember) => {
    setSelected(m);
    setFormData({
      firstName: m.firstName,
      lastName: m.lastName,
      position: m.position,
      department: m.department || 'Management',
      notes: m.notes || '',
      active: m.active,
      photo: null,
    });
    setPhotoPreview(getPhotoUrl(m.photo));
    setIsModalOpen(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setFormData(prev => ({ ...prev, photo: file }));
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim()) { toast.error('First name is required'); return; }
    if (!formData.position.trim()) { toast.error('Position is required'); return; }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('firstName', formData.firstName.trim());
      fd.append('lastName', formData.lastName.trim());
      fd.append('position', formData.position.trim());
      fd.append('department', formData.department);
      if (formData.notes) fd.append('notes', formData.notes.trim());
      fd.append('active', String(formData.active));
      // Required fields for employee schema
      if (!selected) {
        fd.append('employeeId', `TM-${Date.now()}`);
        fd.append('email', `${formData.firstName.toLowerCase().replace(/\s/g, '')}.${formData.lastName.toLowerCase().replace(/\s/g, '') || Date.now()}@falcon.team`);
        fd.append('country', 'Bangladesh');
        fd.append('employmentType', 'full-time');
        fd.append('joinDate', new Date().toISOString().split('T')[0]);
        fd.append('status', 'active');
      }
      if (formData.photo) fd.append('photo', formData.photo);

      if (selected) {
        await employeeAPI.update(selected.id, fd);
        toast.success('Team member updated!');
      } else {
        await employeeAPI.create(fd);
        toast.success('Team member added!');
      }
      await fetchMembers();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save team member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await employeeAPI.delete(selected.id);
      toast.success('Team member deleted');
      await fetchMembers();
      setIsDeleteModalOpen(false);
      setSelected(null);
    } catch {
      toast.error('Failed to delete');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (m: TeamMember) => {
    try {
      const fd = new FormData();
      fd.append('active', String(!m.active));
      await employeeAPI.update(m.id, fd);
      setMembers(prev => prev.map(x => x.id === m.id ? { ...x, active: !m.active } : x));
      toast.success(`${m.firstName} ${m.active ? 'hidden from' : 'shown on'} team page`);
    } catch {
      toast.error('Failed to update');
    }
  };

  const orderedMembers = orderedIds
    .map(id => members.find(m => m.id === id))
    .filter(Boolean) as TeamMember[];

  const filtered = orderedMembers.filter(m => {
    const name = `${m.firstName} ${m.lastName}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || m.position.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === 'all' || (m.department || '').toLowerCase() === filterDept.toLowerCase();
    return matchSearch && matchDept;
  });

  const stats = [
    { label: 'Total', value: members.length, color: 'text-gray-700 dark:text-gray-200' },
    { label: 'Visible', value: members.filter(m => m.active).length, color: 'text-green-600' },
    { label: 'Hidden', value: members.filter(m => !m.active).length, color: 'text-gray-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Management</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage team members shown on the public Team page</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow"
        >
          <PlusIcon className="w-5 h-5" /> Add Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center shadow-sm">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or position..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...DEPARTMENTS].map(d => (
            <button
              key={d}
              onClick={() => setFilterDept(d)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                filterDept === d
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {d === 'all' ? 'All' : d}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => <div key={i} className="h-56 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600">
          <UserGroupIcon className="w-14 h-14 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No team members found</p>
          <button onClick={openAdd} className="mt-4 text-green-600 font-semibold hover:underline text-sm">+ Add first member</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((m, i) => {
            const photoUrl = getPhotoUrl(m.photo);
            const initials = `${m.firstName.charAt(0)}${(m.lastName || '').charAt(0)}`;
            const globalIdx = orderedIds.indexOf(m.id);
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl border shadow-sm overflow-hidden transition-all ${
                  m.active ? 'border-gray-200 dark:border-gray-700' : 'border-dashed border-gray-300 dark:border-gray-600 opacity-60'
                }`}
              >
                {/* Photo */}
                <div className="relative h-36 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden">
                  {photoUrl ? (
                    <img src={photoUrl} alt={`${m.firstName} ${m.lastName}`} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-green-600 flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">{initials}</span>
                    </div>
                  )}
                  {/* Order number badge */}
                  <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-gray-900/70 text-white text-[10px] font-bold flex items-center justify-center">
                    {globalIdx + 1}
                  </span>
                  {/* Active badge */}
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${m.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                    {m.active ? 'Visible' : 'Hidden'}
                  </span>
                  {/* Up/Down order controls */}
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    <button
                      onClick={() => moveUp(m.id)}
                      disabled={globalIdx === 0}
                      title="Move up"
                      className="w-6 h-6 rounded bg-white/80 hover:bg-white disabled:opacity-30 flex items-center justify-center shadow transition-colors"
                    >
                      <ArrowUpIcon className="w-3 h-3 text-gray-700" />
                    </button>
                    <button
                      onClick={() => moveDown(m.id)}
                      disabled={globalIdx === orderedIds.length - 1}
                      title="Move down"
                      className="w-6 h-6 rounded bg-white/80 hover:bg-white disabled:opacity-30 flex items-center justify-center shadow transition-colors"
                    >
                      <ArrowDownIcon className="w-3 h-3 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{m.firstName} {m.lastName}</h3>
                  <p className="text-amber-600 dark:text-amber-400 text-xs font-medium mt-0.5 line-clamp-2">{m.position}</p>
                  {m.notes && <p className="text-gray-400 text-xs mt-1 line-clamp-1">{m.notes}</p>}
                  {m.department && (
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                      {m.department}
                    </span>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => toggleActive(m)}
                      title={m.active ? 'Hide from team page' : 'Show on team page'}
                      className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${
                        m.active
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {m.active ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={() => openEdit(m)}
                      className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 hover:bg-amber-100 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setSelected(m); setIsDeleteModalOpen(true); }}
                      className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between z-10">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selected ? 'Edit Team Member' : 'Add Team Member'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Photo</label>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-green-500 transition-colors flex-shrink-0"
                      onClick={() => fileRef.current?.click()}
                    >
                      {photoPreview ? (
                        <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <PhotoIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        {photoPreview ? 'Change Photo' : 'Upload Photo'}
                      </button>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP · Max 5MB</p>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </div>
                </div>

                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">First Name / Title *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))}
                      placeholder="e.g. Major Zulfiqar H."
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))}
                      placeholder="e.g. Choudhury (Retd)"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Position / Title *</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={e => setFormData(p => ({ ...p, position: e.target.value }))}
                    placeholder="e.g. Managing Director"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Department / Category</label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData(p => ({ ...p, department: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Credentials / Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Credentials / Qualifications</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                    placeholder="e.g. MBA, PGDHRM, ISO 9001:2015"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Visible toggle */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, active: !p.active }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${formData.active ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.active ? 'translate-x-5' : ''}`} />
                  </button>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {formData.active ? 'Visible on team page' : 'Hidden from team page'}
                    </p>
                    <p className="text-xs text-gray-400">Toggle to show/hide this member publicly</p>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircleIcon className="w-4 h-4" />
                    )}
                    {selected ? 'Update Member' : 'Add Member'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60"
              onClick={() => setIsDeleteModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Member</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete <strong>{selected?.firstName} {selected?.lastName}</strong>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamManagement;
