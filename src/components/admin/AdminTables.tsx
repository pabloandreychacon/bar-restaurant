import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Users, MapPin, CheckCircle, AlertCircle, Armchair, Calendar, Phone, Mail, Clock, Utensils } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getTablesWithStatus, createTable, updateTable, deleteTable, type RestaurantTableWithStatus, type CreateRestaurantTable } from '../../utils/tables';
import { getReservations, cancelReservation, type ReservationWithTable } from '../../utils/reservations';
import { defaultSettings } from '../../utils/settings';

const AdminTables = () => {
  const { t } = useTranslation();
  const [tables, setTables] = useState<RestaurantTableWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState<RestaurantTableWithStatus | null>(null);
  const [formData, setFormData] = useState<CreateRestaurantTable>({
    number: 0,
    capacity: 1,
    location: '',
    is_bar_chair: false,
    active: true,
    id_business: defaultSettings.id
  });
  const [reservations, setReservations] = useState<ReservationWithTable[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    loadTables();
    loadReservations(defaultSettings.id);
  }, []);

  const loadReservations = async (idBusiness: number, date?: string) => {
    setReservationsLoading(true);
    try {
      const data = await getReservations(idBusiness, date);
      setReservations(data);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setReservationsLoading(false);
    }
  };

  const handleDateFilter = (date: string) => {
    setDateFilter(date);
    loadReservations(defaultSettings.id, date || undefined);
  };

  const handleCancelReservation = async (id: number) => {
    if (!window.confirm(t('admin.confirmCancel'))) return;
    const success = await cancelReservation(id);
    if (success) loadReservations(defaultSettings.id, dateFilter || undefined);
  };

  const loadTables = async () => {
    setLoading(true);
    try {
      const data = await getTablesWithStatus(defaultSettings.id);
      setTables(data);
    } catch (error) {
      console.error('Error loading tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTable) {
        const updated = await updateTable(editingTable.id_restaurant_table, formData);
        if (updated) {
          loadTables();
          setShowForm(false);
          setEditingTable(null);
          resetForm();
        }
      } else {
        const created = await createTable({ ...formData, id_business: defaultSettings.id });
        if (created) {
          loadTables();
          setShowForm(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving table:', error);
    }
  };

  const handleEdit = (table: RestaurantTableWithStatus) => {
    setEditingTable(table);
    setFormData({
      number: table.number,
      capacity: table.capacity,
      location: table.location,
      is_bar_chair: table.is_bar_chair,
      active: table.active,
      id_business: defaultSettings.id
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t('admin.deleteTable'))) {
      try {
        const success = await deleteTable(id);
        if (success) {
          loadTables();
        }
      } catch (error) {
        console.error('Error deleting table:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      number: 0,
      capacity: 1,
      location: '',
      is_bar_chair: false,
      active: true,
      id_business: defaultSettings.id
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'occupied':
        return <Users className="text-red-500" size={20} />;
      case 'reserved':
        return <AlertCircle className="text-yellow-500" size={20} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'occupied':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'reserved':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stadium-orange"></div>
      </div>
    );
  }

  return (
    <div className="mt-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Utensils className="text-stadium-orange" />
            {t('admin.tables').toUpperCase()}
          </h2>
          {/* <p className="text-gray-400 mt-2 text-sm sm:text-base truncate">{t('admin.tablesSubtitle')}</p> */}
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingTable(null);
            resetForm();
          }}
          className="flex items-center gap-2 bg-stadium-orange text-black px-4 py-2 rounded-sm font-bold hover:bg-white transition-all"
        >
          <Plus size={20} />
          <span className="truncate">{t('admin.newTable').toUpperCase()}</span>
        </button>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4 max-w-full">
        {tables.map((table) => (
          <div key={table.id_restaurant_table} className="bg-stadium-grey border border-white/5 rounded-sm p-4 hover:border-stadium-orange/30 transition-all w-full max-w-full overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white truncate">Mesa {table.number}</h3>
                <p className="text-gray-400 text-sm truncate">{table.location}</p>
              </div>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => handleEdit(table)}
                  className="p-2 text-gray-400 hover:text-stadium-orange transition-colors"
                  title="Editar mesa"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(table.id_restaurant_table)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Eliminar mesa"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Users size={16} className="flex-shrink-0" />
                <span className="text-sm truncate">{table.capacity} personas</span>
              </div>

              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={16} className="flex-shrink-0" />
                <span className="text-sm truncate">{table.location}</span>
              </div>

              {table.is_bar_chair && (
                <div className="flex items-center gap-2 text-stadium-orange">
                  <Armchair size={16} className="flex-shrink-0" />
                  <span className="text-sm font-bold truncate">SILLA DE BAR</span>
                </div>
              )}
            </div>

            <div className="flex items-center mt-3">
              <div className={`px-2 py-1 rounded-full border text-xs font-bold flex items-center gap-1 flex-shrink-0 ${getStatusColor(table.status)}`}>
                {getStatusIcon(table.status)}
                <span>
                  {table.status === 'available' ? t('admin.available').toUpperCase() : table.status === 'occupied' ? t('admin.occupied').toUpperCase() : t('admin.reserved').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Grid View */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div key={table.id_restaurant_table} className="bg-stadium-grey border border-white/5 rounded-sm p-6 hover:border-stadium-orange/30 transition-all w-full">
            <div className="flex justify-between items-start mb-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold text-white truncate">Mesa {table.number}</h3>
                <p className="text-gray-400 text-sm truncate">{table.location}</p>
              </div>
              <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1 flex-shrink-0 ml-2 ${getStatusColor(table.status)}`}>
                {getStatusIcon(table.status)}
                <span>
                  {table.status === 'available' ? t('admin.available').toUpperCase() : table.status === 'occupied' ? t('admin.occupied').toUpperCase() : t('admin.reserved').toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-400">
                <Users size={16} className="flex-shrink-0" />
                <span className="text-sm truncate">{table.capacity} personas</span>
              </div>

              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={16} className="flex-shrink-0" />
                <span className="text-sm truncate">{table.location}</span>
              </div>

              {table.is_bar_chair && (
                <div className="flex items-center gap-2 text-stadium-orange">
                  <Armchair size={16} className="flex-shrink-0" />
                  <span className="text-sm font-bold truncate">SILLA DE BAR</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => handleEdit(table)}
                className="flex-1 flex items-center justify-center bg-stadium-orange/10 text-stadium-orange p-2 rounded-sm hover:bg-stadium-orange/20 transition-all"
                title="Editar mesa"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(table.id_restaurant_table)}
                className="flex-1 flex items-center justify-center bg-red-500/10 text-red-500 p-2 rounded-sm hover:bg-red-500/20 transition-all"
                title="Eliminar mesa"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reservations List */}
      <div className="mt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="text-stadium-orange" />
            {t('admin.reservations')}
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => handleDateFilter(e.target.value)}
              className="bg-stadium-dark border border-white/10 rounded-sm px-4 py-2 focus:border-stadium-orange outline-none text-white text-sm"
            />
            {dateFilter && (
              <button
                onClick={() => handleDateFilter('')}
                className="text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
              >
                {t('admin.viewAll')}
              </button>
            )}
          </div>
        </div>

        {reservationsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stadium-orange"></div>
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-sm">
            <Calendar size={40} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">{t('admin.noReservations')}</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3">
              {reservations.map((r) => (
                <div key={r.id_reservation} className="bg-stadium-grey border border-white/5 rounded-sm p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white truncate">{r.customer_name}</h4>
                      <p className="text-gray-400 text-sm truncate">Mesa {r.restaurant_tables.number}</p>
                    </div>
                    <button
                      onClick={() => r.id_reservation && handleCancelReservation(r.id_reservation)}
                      className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest flex-shrink-0"
                    >
                      {t('admin.cancelReservation')}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar size={14} className="flex-shrink-0" />
                      <span className="truncate">{r.date}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock size={14} className="flex-shrink-0" />
                      <span className="truncate">{r.start_time.slice(0, 5)} – {r.end_time.slice(0, 5)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Users size={14} className="flex-shrink-0" />
                      <span className="truncate">{r.restaurant_tables.capacity} {t('admin.people')}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin size={14} className="flex-shrink-0" />
                      <span className="truncate">{r.restaurant_tables.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Mail size={14} className="flex-shrink-0" />
                      <span className="truncate">{r.customer_email}</span>
                    </div>

                    {r.customer_phone && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Phone size={14} className="flex-shrink-0" />
                        <span className="truncate">{r.customer_phone}</span>
                      </div>
                    )}

                    {r.comments && (
                      <div className="text-gray-400 text-sm">
                        <span className="font-bold">{t('admin.comments')}: </span>
                        <span className="truncate block">{r.comments}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-widest">{t('admin.table')}</th>
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-widest">{t('admin.client')}</th>
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-widest">{t('admin.contact')}</th>
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-widest">{t('admin.date')}</th>
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-widest">{t('admin.schedule')}</th>
                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-widest">{t('admin.comments')}</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reservations.map((r) => (
                    <tr key={r.id_reservation} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 pr-4">
                        <div className="font-bold text-white">Mesa {r.restaurant_tables.number}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin size={10} />{r.restaurant_tables.location}
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="font-bold text-white">{r.customer_name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Users size={10} />{r.restaurant_tables.capacity} {t('admin.people')}
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Mail size={12} />{r.customer_email}
                        </div>
                        {r.customer_phone && (
                          <div className="flex items-center gap-1 text-gray-400 mt-1">
                            <Phone size={12} />{r.customer_phone}
                          </div>
                        )}
                      </td>
                      <td className="py-4 pr-4 text-gray-300">{r.date}</td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-1 text-gray-300">
                          <Clock size={12} />
                          {r.start_time.slice(0, 5)} – {r.end_time.slice(0, 5)}
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-gray-400 max-w-[160px] truncate">{r.comments || '—'}</td>
                      <td className="py-4">
                        <button
                          onClick={() => r.id_reservation && handleCancelReservation(r.id_reservation)}
                          className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest"
                        >
                          {t('admin.cancelReservation')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-stadium-grey border border-white/5 rounded-sm p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingTable ? t('admin.update').toUpperCase() : t('admin.newTable').toUpperCase()}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('admin.tableNumber')}</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) })}
                  className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('admin.capacity')}</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{t('admin.location')}</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-stadium-dark border border-white/10 rounded-sm px-4 py-3 focus:border-stadium-orange outline-none text-white"
                  placeholder={t('admin.locationPlaceholder')}
                />
              </div>

              <div>
                <label className="flex items-center gap-3 text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_bar_chair}
                    onChange={(e) => setFormData({ ...formData, is_bar_chair: e.target.checked })}
                    className="w-4 h-4 bg-stadium-dark border border-white/10 rounded-sm focus:border-stadium-orange outline-none text-stadium-orange"
                  />
                  <span className="text-sm font-bold">{t('admin.isBarChair')}</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-stadium-orange text-black font-bold py-3 rounded-sm hover:bg-white transition-all"
                >
                  {editingTable ? t('admin.update').toUpperCase() : t('admin.create').toUpperCase()}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTable(null);
                    resetForm();
                  }}
                  className="flex-1 bg-stadium-dark border border-white/10 text-white font-bold py-3 rounded-sm hover:bg-white/10 transition-all"
                >
                  {t('admin.cancel').toUpperCase()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTables;
