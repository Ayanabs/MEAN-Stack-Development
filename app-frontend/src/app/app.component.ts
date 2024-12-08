import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  rows = [
    Array(7).fill(null).map(() => ({ selected: false, booked: false })), // Row 1
    Array(12).fill(null).map(() => ({ selected: false, booked: false })), // Row 2
    Array(15).fill(null).map(() => ({ selected: false, booked: false })), // Row 3
    Array(12).fill(null).map(() => ({ selected: false, booked: false })), // Row 4
    Array(7).fill(null).map(() => ({ selected: false, booked: false })), // Row 5
  ];
  bookedSeat: { row: number; seat: number; status: string } | null = null;

  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  currentDate: number = new Date().getDate();
  selectedDay: { day: number; month: number; year: number } | null = null;
  calendarDays: ({ day: number; isCurrent: boolean; isSelected: boolean } | null)[] = [];

  dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const today = new Date();
    this.selectedDay = { day: today.getDate(), month: today.getMonth(), year: today.getFullYear() };
    this.generateCalendar();
    this.loadBookingsForDate(today); // Load bookings for the current day
  }
  

  generateCalendar(): void {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDay = firstDayOfMonth.getDay();

    this.calendarDays = [];

    for (let i = 0; i < startingDay; i++) {
      this.calendarDays.push(null);
    }

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

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  selectDay(day: { day: number; isCurrent: boolean } | null): void {
    if (day) {
      this.resetSeats(); // Reset seats when changing the day
      this.selectedDay = { day: day.day, month: this.currentMonth, year: this.currentYear };
      const selectedDate = new Date(this.selectedDay.year, this.selectedDay.month, this.selectedDay.day);
      this.loadBookingsForDate(selectedDate);
      this.generateCalendar();
    }
  }

  loadBookingsForDate(date: Date): void {
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    this.http.get<any>(`http://localhost:5000/api/bookings/${formattedDate}`).subscribe({
      next: (response) => {
        if (response && response.seats) {
          response.seats.forEach((seat: { row: number; seat: number }) => {
            this.rows[seat.row - 1][seat.seat - 1].booked = true;
          });
        }
      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
        this.resetSeats();
      },
    });
  }

  resetSeats(): void {
    this.rows.forEach((row) => {
      row.forEach((seat) => {
        seat.selected = false;
        seat.booked = false;
      });
    });
  }

  toggleSeat(rowIndex: number, seatIndex: number): void {
    const seat = this.rows[rowIndex][seatIndex];
    if (!seat.booked) {
      seat.selected = !seat.selected;
      this.bookedSeat = seat.selected
        ? { row: rowIndex + 1, seat: seatIndex + 1, status: 'Selected' }
        : null;
    }
  }

  confirmBooking(rowIndex: number, seatIndex: number): void {
    const seat = this.rows[rowIndex][seatIndex];
    if (seat.selected) {
      seat.booked = true;
      seat.selected = false;

      if (this.selectedDay) {
        const formattedDate = `${this.selectedDay.year}-${this.selectedDay.month + 1}-${this.selectedDay.day}`;
        const seatData = {
          date: formattedDate,
          seats: this.rows.flatMap((row, rowIdx) =>
            row
              .map((s, seatIdx) => (s.booked ? { row: rowIdx + 1, seat: seatIdx + 1 } : null))
              .filter((s) => s !== null)
          ),
        };

        this.http.post('http://localhost:5000/api/bookings', seatData).subscribe({
          next: () => console.log('Booking saved to database!'),
          error: (err) => console.error('Error saving booking:', err),
        });
      } else {
        console.error('Error: No selected day to confirm booking.');
      }
    }
  }

  removeBooking(rowIndex: number, seatIndex: number): void {
    const seat = this.rows[rowIndex][seatIndex];
    if (seat.booked) {
      seat.booked = false;

      if (this.selectedDay) {
        const formattedDate = `${this.selectedDay.year}-${this.selectedDay.month + 1}-${this.selectedDay.day}`;
        const seatData = {
          date: formattedDate,
          seats: this.rows.flatMap((row, rowIdx) =>
            row
              .map((s, seatIdx) => (s.booked ? { row: rowIdx + 1, seat: seatIdx + 1 } : null))
              .filter((s) => s !== null)
          ),
        };

        this.http.post('http://localhost:5000/api/bookings', seatData).subscribe({
          next: () => console.log('Booking updated in database!'),
          error: (err) => console.error('Error updating booking:', err),
        });
      } else {
        console.error('Error: No selected day to remove booking.');
      }
    }
  }

  getSeatNumber(rowIndex: number, seatIndex: number): number {
    let seatStart = 1;
    for (let i = 0; i < rowIndex; i++) {
      seatStart += this.rows[i].length;
    }
    return seatStart + seatIndex;
  }
}
