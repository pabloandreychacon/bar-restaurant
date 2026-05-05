import { supabase } from '../lib/supabase';

export interface RestaurantTable {
  id_restaurant_table: number;
  number: number;
  capacity: number;
  location: string;
  is_bar_chair: boolean;
  active: boolean;
}

export interface RestaurantTableWithStatus extends RestaurantTable {
  status: 'available' | 'occupied' | 'reserved';
}

export interface CreateRestaurantTable {
  number: number;
  capacity: number;
  location: string;
  is_bar_chair?: boolean;
  active?: boolean;
  id_business: number;
}

export interface UpdateRestaurantTable {
  number?: number;
  capacity?: number;
  location?: string;
  is_bar_chair?: boolean;
  active?: boolean;
}

// Get all tables
export async function getTables(idBusiness: number): Promise<RestaurantTable[]> {
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
    console.error('Error fetching tables:', error);
    return [];
  }
}

// Get table by ID
export async function getTableById(id: number): Promise<RestaurantTable | null> {
  try {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('id_restaurant_table', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching table:', error);
    return null;
  }
}

// Create new table
export async function createTable(table: CreateRestaurantTable): Promise<RestaurantTable | null> {
  try {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .insert({
        ...table,
        active: table.active !== false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating table:', error);
    return null;
  }
}

// Update table
export async function updateTable(id: number, table: UpdateRestaurantTable): Promise<RestaurantTable | null> {
  try {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .update(table)
      .eq('id_restaurant_table', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating table:', error);
    return null;
  }
}

// Delete table (soft delete by setting active to false)
export async function deleteTable(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('restaurant_tables')
      .update({ active: false })
      .eq('id_restaurant_table', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting table:', error);
    return false;
  }
}

// Get tables with their current status based on reservations
export async function getTablesWithStatus(idBusiness: number): Promise<RestaurantTableWithStatus[]> {
  try {
    const { data: tables, error: tablesError } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('active', true)
      .eq('id_business', idBusiness)
      .order('number', { ascending: true });

    if (tablesError) throw tablesError;

    // Get current date and time
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    // Get all active reservations for current date
    const { data: reservations, error: reservationsError } = await supabase
      .from('reservations')
      .select('*')
      .eq('date', currentDate)
      .eq('reserved', true);

    if (reservationsError) throw reservationsError;

    // Determine status for each table
    const tablesWithStatus: RestaurantTableWithStatus[] = tables?.map(table => {
      const tableReservations = reservations?.filter(r => r.id_restaurant_table === table.id_restaurant_table) || [];

      // Check if table has a reservation at current time
      const currentReservation = tableReservations.find(reservation => {
        const reservationStart = reservation.start_time;
        const reservationEnd = reservation.end_time;
        return currentTime >= reservationStart && currentTime <= reservationEnd;
      });

      // Check if table has any reservations today (for reserved status)
      const hasReservationsToday = tableReservations.length > 0;

      let status: 'available' | 'occupied' | 'reserved';
      if (currentReservation) {
        status = 'occupied';
      } else if (hasReservationsToday) {
        status = 'reserved';
      } else {
        status = 'available';
      }

      return {
        ...table,
        status
      };
    }) || [];

    return tablesWithStatus;
  } catch (error) {
    console.error('Error fetching tables with status:', error);
    return [];
  }
}

// Get available tables for a specific date and time
export async function getAvailableTablesForDateTime(date: string, time: string): Promise<RestaurantTable[]> {
  try {
    // First get all active tables
    const { data: tables, error: tablesError } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('active', true);

    if (tablesError) throw tablesError;

    // Get reservations for the specific date and time
    const endTime = calculateEndTime(time);
    const { data: reservations, error: reservationsError } = await supabase
      .from('reservations')
      .select('id_restaurant_table')
      .eq('date', date)
      .eq('reserved', true)
      .or(`start_time.lte.${time} AND end_time.gte.${endTime}`);

    if (reservationsError) throw reservationsError;

    // Filter out tables that are reserved at this time
    const reservedTableIds = reservations?.map(r => r.id_restaurant_table) || [];
    const availableTables = tables?.filter(table => !reservedTableIds.includes(table.id_restaurant_table)) || [];

    return availableTables;
  } catch (error) {
    console.error('Error fetching available tables:', error);
    return [];
  }
}

// Helper function to calculate end time (2 hours after start time)
function calculateEndTime(startTime: string): string {
  const [time, period] = startTime.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  // Convert to 24-hour format
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  // Add 2 hours
  hours += 2;

  // Convert back to 12-hour format
  let endPeriod = 'AM';
  if (hours >= 12) {
    endPeriod = 'PM';
    if (hours > 12) hours -= 12;
  }
  if (hours === 0) hours = 12;

  return `${hours}:${minutes.toString().padStart(2, '0')} ${endPeriod}`;
}
