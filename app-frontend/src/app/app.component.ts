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
  // Calendar state
  currentMonth: number = new Date().getMonth(); // Current month (0 = January)
  currentYear: number = new Date().getFullYear(); // Current year
  currentDate: number = new Date().getDate(); // Today's date
  selectedDay: { day: number, month: number, year: number } | null = null; // Selected date
  calendarDays: ({ day: number, isCurrent: boolean, isSelected: boolean } | null)[] = []; // Days of the month

  dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Days of the week

  // Seats state
  rows = [
    Array(7).fill(null).map(() => ({ selected: false, booked: false })),  // Row 1
    Array(12).fill(null).map(() => ({ selected: false, booked: false })), // Row 2
    Array(15).fill(null).map(() => ({ selected: false, booked: false })), // Row 3
    Array(12).fill(null).map(() => ({ selected: false, booked: false })), // Row 4
    Array(7).fill(null).map(() => ({ selected: false, booked: false })),  // Row 5
  ];

  bookedSeat: { row: number, seat: number, status: string } | null = null; // Last booked seat info

  // Initialize calendar
  ngOnInit(): void {
    this.generateCalendar();
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

    // Fill in the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay =
        day === this.currentDate &&
        this.currentMonth === new Date().getMonth() &&
        this.currentYear === new Date().getFullYear();
      const isSelectedDay =
        this.selectedDay?.day === day &&
        this.selectedDay?.month === this.currentMonth &&
        this.selectedDay?.year === this.currentYear;

      this.calendarDays.push({ day, isCurrent: isCurrentDay, isSelected: isSelectedDay });
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

  // Select a day
  selectDay(day: { day: number, isCurrent: boolean } | null): void {
    if (day) {
      this.selectedDay = { day: day.day, month: this.currentMonth, year: this.currentYear };
      this.generateCalendar(); // Regenerate calendar to reflect the selected day
    }
  }

  // Toggle seat selection
  toggleSeat(rowIndex: number, seatIndex: number): void {
    const seat = this.rows[rowIndex][seatIndex];
    if (!seat.booked) {
      seat.selected = !seat.selected;
      this.bookedSeat = seat.selected
        ? { row: rowIndex + 1, seat: this.getSeatNumber(rowIndex, seatIndex), status: 'Selected' }
        : null;
    }
  }

  // Confirm booking for a seat
  confirmBooking(rowIndex: number, seatIndex: number): void {
    const seat = this.rows[rowIndex][seatIndex];
    if (seat.selected) {
      seat.booked = true;
      seat.selected = false; // Deselect after booking
      this.bookedSeat = { row: rowIndex + 1, seat: this.getSeatNumber(rowIndex, seatIndex), status: 'Booked' };
    }
  }

  // Remove booking for a seat
  removeBooking(rowIndex: number, seatIndex: number): void {
    const seat = this.rows[rowIndex][seatIndex];
    if (seat.booked) {
      seat.booked = false;
      this.bookedSeat = { row: rowIndex + 1, seat: this.getSeatNumber(rowIndex, seatIndex), status: 'Unbooked' };
    }
  }

  // Get seat number
  getSeatNumber(rowIndex: number, seatIndex: number): number {
    let seatStart = 1;
    for (let i = 0; i < rowIndex; i++) {
      seatStart += this.rows[i].length;
    }
    return seatStart + seatIndex;
  }
}
