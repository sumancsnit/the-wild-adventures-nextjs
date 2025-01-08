'use server';
import { auth, signIn, signOut } from '@/app/_lib/auth';
import { supabase } from './supabase';
import { revalidatePath } from 'next/cache';
import { getBookings } from './data-service';

export const updateGuest = async (formData) => {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');
  const nationalID = formData.get('nationalID');
  const [nationality, countryFlag] = formData.get('nationality').split('%');
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error('please provide a valid national ID');
  }
  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from('guests')
    .update(updateData)
    .eq('id', session.user.guestId);

  if (error) {
    throw new Error('Guest could not be updated');
  }

  revalidatePath('/account/profile');
};

export const signInAction = async () => {
  await signIn('google', {
    redirectTo: '/account',
  });
};

export const signOutAction = async () => {
  await signOut({
    redirectTo: '/',
  });
};

export const deleteReservation = async (bookingId) => {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');
  const guestBookings = await getBookings(session.user.guestId);
  const isBookingAllowed = guestBookings.some(
    (booking) => booking.id === bookingId
  );
  if (!isBookingAllowed) {
    throw new Error('You are not allowed to delete this booking');
  }

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) throw new Error('Booking could not be deleted');
  revalidatePath('/account/reservations');
};
