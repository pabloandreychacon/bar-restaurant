import { supabase } from '../lib/supabase';

export interface RestaurantTable {
  id_restaurant_table: number;
  number: number;
  capacity: number;
  location: string;
  is_bar_chair: boolean;
  active: boolean;
}

export interface Reservation {
  id_reservation?: number;
  id_restaurant_table: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  date: string;
  start_time: string;
  end_time: string;
  comments?: string;
  reserved?: boolean;
}

// Delete reservations older than 1 week
export async function deleteOldReservations(idBusiness: number): Promise<void> {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const cutoffDate = oneWeekAgo.toISOString().split('T')[0];

    // Get table ids for this business first
    const { data: tables } = await supabase
      .from('restaurant_tables')
      .select('id_restaurant_table')
      .eq('id_business', idBusiness);

    const tableIds = (tables || []).map(t => t.id_restaurant_table);
    if (tableIds.length === 0) return;

    await supabase
      .from('reservations')
      .delete()
      .lt('date', cutoffDate)
      .in('id_restaurant_table', tableIds);
  } catch (error) {
    console.error('Error deleting old reservations:', error);
  }
}

// Get all available tables
export async function getAvailableTables(idBusiness: number): Promise<RestaurantTable[]> {
  try {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('active', true)
      .eq('id_business', idBusiness)
      .order('number', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching available tables:', error);
    return [];
  }
}

// Get all tables (for admin purposes)
export async function getAllTables(): Promise<RestaurantTable[]> {
  try {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('active', true)
      .order('number', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all tables:', error);
    return [];
  }
}

// Check if a table is available for a specific date and time
export async function checkTableAvailability(
  tableId: number,
  date: string,
  startTime: string,
  endTime: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('start_time, end_time')
      .eq('id_restaurant_table', tableId)
      .eq('date', date)
      .eq('reserved', true);

    if (error) throw error;

    const hasOverlap = (data || []).some(r =>
      r.start_time < endTime && r.end_time > startTime
    );

    return !hasOverlap;
  } catch (error) {
    console.error('Error checking table availability:', error);
    return false;
  }
}

// Get available tables for specific date and time
export async function getAvailableTablesForDateTime(
  date: string,
  startTime: string,
  endTime: string,
  idBusiness: number
): Promise<RestaurantTable[]> {
  try {
    const availableTables = await getAvailableTables(idBusiness);
    
    // Then check each table for availability at the requested time
    const availableTablesForDateTime = await Promise.all(
      availableTables.map(async (table) => {
        const isAvailable = await checkTableAvailability(
          table.id_restaurant_table,
          date,
          startTime,
          endTime
        );
        return isAvailable ? table : null;
      })
    );

    return availableTablesForDateTime.filter(
      (table): table is RestaurantTable => table !== null
    );
  } catch (error) {
    console.error('Error fetching available tables for datetime:', error);
    return [];
  }
}

// Create a new reservation
export async function createReservation(reservation: Omit<Reservation, 'id_reservation'>): Promise<Reservation | null> {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .insert([{
        ...reservation,
        reserved: true
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    return null;
  }
}

// Get reservations for a specific date
export async function getReservationsByDate(date: string): Promise<Reservation[]> {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('date', date)
      .eq('reserved', true)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching reservations by date:', error);
    return [];
  }
}

export interface ReservationWithTable extends Reservation {
  restaurant_tables: {
    number: number;
    location: string;
    capacity: number;
  };
}

// Get all reservations with table info, optionally filtered by date
export async function getReservations(idBusiness: number, date?: string): Promise<ReservationWithTable[]> {
  try {
    let query = supabase
      .from('reservations')
      .select('*, restaurant_tables!inner(number, location, capacity, id_business)')
      .eq('reserved', true)
      .eq('restaurant_tables.id_business', idBusiness)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (date) query = query.eq('date', date);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }
}

// Cancel a reservation
export async function cancelReservation(reservationId: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('reservations')
      .update({ reserved: false })
      .eq('id_reservation', reservationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error canceling reservation:', error);
    return false;
  }
}


