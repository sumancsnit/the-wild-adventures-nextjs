'use client';

import { useOptimistic } from 'react';
import ReservationCard from './ReservationCard';
import { deleteBooking } from '../_lib/actions';

const ReservationList = ({ bookings }) => {
  const [optimisticBooking, optimisticDelete] = useOptimistic(
    bookings,
    (currBookings, bookingId) => {
      return currBookings.filter((list) => list.id !== bookingId);
    }
  );
  const handleDelete = async (bookingId) => {
    optimisticDelete(bookingId);
    await deleteBooking(bookingId);
  };
  return (
    <ul className='space-y-6'>
      {optimisticBooking.map((booking) => (
        <ReservationCard
          onDelete={handleDelete}
          booking={booking}
          key={booking.id}
        />
      ))}
    </ul>
  );
};

export default ReservationList;
