'use server';
import { auth, signIn, signOut } from '@/app/_lib/auth';
import { supabase } from './supabase';
import { revalidatePath } from 'next/cache';
import { getBookings } from './data-service';
import { redirect } from 'next/navigation';

export const updateGuest = async (formData) => {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');
  const nationalID = formData.get('nationalID');
  const [nationality, countryFlag] = formData.get('nationality').split('%');
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error('please provide a valid national ID');
  }
  const updateData = { nationality, countryFlag, nationalID };

  const { error } = await supabase
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

export const createBooking = async (bookingData, formData) => {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations').slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: 'unconfirmed',
  };

  const { error } = await supabase.from('bookings').insert([newBooking]);

  if (error) {
    throw new Error('Booking could not be created');
  }
  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect('/cabins/thankyou');
};

export const deleteBooking = async (bookingId) => {
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

export const updateBooking = async (formData) => {
  const bookingId = Number(formData.get('bookingId'));
  // 1. Authentication
  const session = await auth();
  if (!session) throw new Error('You must be logged in');
  // 2. Authorization
  const guestBookings = await getBookings(session.user.guestId);
  const isBookingAllowed = guestBookings.some(
    (booking) => booking.id === bookingId
  );
  if (!isBookingAllowed) {
    throw new Error('You are not allowed to edit this booking');
  }
  // 3. building update data
  const updateData = {
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations').slice(0, 1000),
  };
  // 4. mutation
  const { error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', bookingId)
    .select()
    .single();
  // 5. error handling
  if (error) {
    throw new Error('Booking could not be updated');
  }

  // 6. revalidation
  revalidatePath('/account/reservations');
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  // 6 redirecting
  redirect('/account/reservations');
};
