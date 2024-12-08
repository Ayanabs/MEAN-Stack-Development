import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Define the rows with different seat counts using map()
  rows = [
    Array(7).fill(null).map(() => ({ selected: false, booked: false })),  // Row 1
    Array(12).fill(null).map(() => ({ selected: false, booked: false })), // Row 2
    Array(15).fill(null).map(() => ({ selected: false, booked: false })), // Row 3
    Array(12).fill(null).map(() => ({ selected: false, booked: false })), // Row 4
    Array(7).fill(null).map(() => ({ selected: false, booked: false })),  // Row 5
  ];

  // Store the selected seat for display
  bookedSeat: { row: number, seat: number, status: string } | null = null;

  // Month and year state
  currentMonth: number = new Date().getMonth();  // Get the current month (0 = January)
  currentYear: number = new Date().getFullYear();  // Get the current year
  currentDate: number = new Date().getDate(); // Current day
  currentDayIndex: number = new Date().getDay(); // Current day of the week (0 = Sunday)
  calendarDays: ({ day: number, isCurrent: boolean } | null)[] = [];  // Store the days of the month

  dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];  // Days of the week

  // Handle seat selection
  toggleSeat(rowIndex: number, seatIndex: number): void {
    const seat = this.rows[rowIndex][seatIndex];
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
    for (let i = 0; i < rowIndex; i++) {
      seatStart += this.rows[i].length; // Add seat count of previous rows
    }
    return seatStart + seatIndex;
  }

  // Generate the days for the current month
  generateCalendar(): void {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
  
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDay = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
    this.calendarDays = [];
  
    // Fill in the empty days before the start of the month
    for (let i = 0; i < startingDay; i++) {
      this.calendarDays.push(null);
    }
  
    // Fill in the days of the month, marking the current day (if in the current month)
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = (day === this.currentDate) && (this.currentMonth === new Date().getMonth()) && (this.currentYear === new Date().getFullYear());
      this.calendarDays.push(isCurrentDay ? { day, isCurrent: true } : { day, isCurrent: false });
    }
  }
  

  // Move to the previous month
  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;  // December
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  // Move to the next month
  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;  // January
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  ngOnInit() {
    this.generateCalendar();  // Initialize the calendar when the component loads
  }
}
