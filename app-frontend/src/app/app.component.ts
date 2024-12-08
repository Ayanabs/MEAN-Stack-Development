import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Define the rows with different seat counts
  rows = [
    Array(7).fill(null).map(() => ({ selected: false, booked: false })),  // Row 1
    Array(12).fill(null).map(() => ({ selected: false, booked: false })), // Row 2
    Array(15).fill(null).map(() => ({ selected: false, booked: false })), // Row 3
    Array(12).fill(null).map(() => ({ selected: false, booked: false })), // Row 4
    Array(7).fill(null).map(() => ({ selected: false, booked: false })),  // Row 5
  ];

  // Store the selected seat for display
  bookedSeat: { row: number, seat: number, status: string } | null = null;

  // Handle seat selection
  toggleSeat(rowIndex: number, seatIndex: number): void {
    const seat = this.rows[rowIndex][seatIndex];
    // Only toggle the seat if it is not booked
    if (!seat.booked) {
      seat.selected = !seat.selected;  // Toggle seat selection
      const seatNum = this.getSeatNumber(rowIndex, seatIndex);
      this.bookedSeat = seat.selected
        ? { row: rowIndex + 1, seat: seatNum, status: 'Selected' }
        : null;
    }
  }

  // Confirm the booking for the selected seat
  confirmBooking(rowIndex: number, seatIndex: number): void {
    const seat = this.rows[rowIndex][seatIndex];
    if (!seat.booked && seat.selected) {
      seat.booked = true;
      seat.selected = false; // Deselect the seat after booking
      this.bookedSeat = { row: rowIndex + 1, seat: seatIndex + 1, status: 'Booked' }; // Update booked seat
    }
  }
 // Remove the booking from the selected seat
 removeBooking(rowIndex: number, seatIndex: number): void {
  const seat = this.rows[rowIndex][seatIndex];
  if (seat.booked) {
    seat.booked = false;  // Remove booking
    seat.selected = false; // Deselect the seat
    this.bookedSeat = { row: rowIndex + 1, seat: seatIndex + 1, status: 'Unbooked' }; // Update unbooked seat
  }
}
  // Update the seat numbering dynamically
  getSeatNumber(rowIndex: number, seatIndex: number): number {
    let seatStart = 1;
    // Calculate the starting seat number for each row
    for (let i = 0; i < rowIndex; i++) {
      seatStart += this.rows[i].length; // Add seat count of previous rows
    }
    return seatStart + seatIndex;
  }
}
