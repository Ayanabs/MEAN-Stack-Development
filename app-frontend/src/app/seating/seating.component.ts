import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { safeLocalStorage } from '../utils/local-storage.util'; // Update the path as needed
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'seat-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './seating.component.html',
  styleUrls: ['./seating.component.css']
})
export class SeatingComponent implements OnInit {
  // Movie and Showtime Management
  movies: any[] = [];
  selectedMovie: string = '';
  selectedTime: string = '';
  selectedMovieTimes: string[] = [];
  selectedMovieImage: string = '';

  // Calendar Management
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  currentDate: number = new Date().getDate();
  selectedDay: { day: number; month: number; year: number } | null = null;
  calendarDays: ({ day: number; isCurrent: boolean; isSelected: boolean } | null)[] = [];

  dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  seatOwnershipMap: { [seatKey: string]: string } = {}; // Tracks which user booked each seat

  // Seat Management
  rows = [
    Array(7).fill(null).map(() => ({ selected: false, booked: false })),
    Array(12).fill(null).map(() => ({ selected: false, booked: false })),
    Array(15).fill(null).map(() => ({ selected: false, booked: false })),
    Array(12).fill(null).map(() => ({ selected: false, booked: false })),
    Array(7).fill(null).map(() => ({ selected: false, booked: false })),
  ];

  bookedSeat: { row: number; seat: number; status: string } | null = null;
  loggedInUserId: string | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private sessionService: SessionService) {}

  ngOnInit(): void {
    // Removed token-based authentication logic
    this.generateCalendar();
    this.loadMovies();
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

      this.calendarDays.push({ day, isCurrent: isCurrentDay, isSelected: isSelectedDay });
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
      this.resetSeats();
      this.selectedDay = { day: day.day, month: this.currentMonth, year: this.currentYear };
      this.loadBookingsForDate();
      this.generateCalendar();
    }
  }
  

  resetSeats(): void {
    this.rows.forEach((row) => {
      row.forEach((seat) => {
        seat.selected = false;
        seat.booked = false;
      });
    });
  }

  loadMovies(): void {
    this.http.get<any[]>('http://localhost:5000/api/users/getmovies').subscribe(
      (movies) => {
        this.movies = [{ movieName: 'Select Movie', showTimes: [], picture: '' }, ...movies];
        this.selectedMovie = this.movies[0].movieName;
        this.selectedMovieImage = '';
        this.selectedMovieTimes = this.movies[0].showTimes;
        this.selectedTime = this.selectedMovieTimes[0];
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching movies:', error);
      }
    );
  }

  onMovieChange(): void {
    const selectedMovie = this.movies.find((movie) => movie.movieName === this.selectedMovie);
    if (selectedMovie) {
      this.selectedMovieImage = selectedMovie.picture;
      this.selectedMovieTimes = selectedMovie.showTimes;
      this.selectedTime = this.selectedMovieTimes[0];
      this.loadBookingsForDate();

      this.updateSession();
    }
  }

  confirmAllBookings(): void {
    if (!this.cartData.selectedSeats.length) {
      console.warn('No seats in the cart to confirm.');
      return;
    }
    if (!this.selectedDay) {
      console.error('No date selected.');
      return;
    }
  
    const formattedDate = `${this.selectedDay?.year}-${this.selectedDay.month + 1}-${this.selectedDay?.day}`;
  
    // Convert selectedSeats into the correct format
    const formattedSeats = this.cartData.selectedSeats.map((seat) => {
      const [row, seatNumber] = seat.split('-');
      if (row && seatNumber) {
        return { row: parseInt(row, 10), seat: parseInt(seatNumber, 10) };
      } else {
        console.warn(`Invalid seat format: ${seat}`);
        return null;
      }
    }).filter(seat => seat !== null);
  
    if (formattedSeats.length === 0) {
      console.error('No valid seats to confirm.');
      return;
    }
  
    const bookingData = {
      userid: this.cartData.userid,
      username: this.cartData.username,
      date: formattedDate,
      movieName: this.cartData.selectedMovie,
      showTime: this.cartData.selectedTime,
      seats: formattedSeats
    };
  
    console.log("Booking data:", bookingData);
  
    this.http.post('http://localhost:5000/api/users/bookings_collection', bookingData).subscribe(
      (response) => {
        console.log('Booking saved successfully:', response);
        this.cartData.selectedSeats = [];
        this.loadBookingsForDate();
      },
      (error) => {
        console.error('Error saving booking:', error);
      }
    );
  }
  
  

  cartData: {
    userid: string,
    username: string;
    selectedMovie: string;
    selectedTime: string;
    selectedSeats: string[];
  } = {
    userid:'',
    username: '',
    selectedMovie: '',
    selectedTime: '',
    selectedSeats: []
  };

  cartItems: any[] = [];

  updateSession(): void {
    const sessionData = this.sessionService.getSession(); // Assuming your session service has a method to get the session data

    if (sessionData) {
      const selectedSeats = this.rows.flatMap((row, rowIndex) =>
        row.map((seat, seatIndex) => (seat.selected ? { row: rowIndex + 1, seat: seatIndex + 1 } : null))
      ).filter((seat) => seat !== null);
  
      const updatedSessionData = {
        sessionId: sessionData.sessionId,
        userId: sessionData.userId,
        username: sessionData.username,
        selectedMovie: this.selectedMovie,
        selectedTime: this.selectedTime,
        selectedSeats: selectedSeats // Now it stores objects with row and seat
      };
  
      this.sessionService.setSession(updatedSessionData);
  
      this.cartData = {
        userid :updatedSessionData.userId,
        username: updatedSessionData.username || '',
        selectedMovie: updatedSessionData.selectedMovie,
        selectedTime: updatedSessionData.selectedTime,
        selectedSeats: selectedSeats.map(seat => `${seat.row}-${seat.seat}`), // Convert the seat objects back to a string format for the cartData
      };
  
      this.cartItems = [...selectedSeats.map(seat => `${seat.row}-${seat.seat}`)];
      console.log("Session data after movie selection:", updatedSessionData);
    } else {
      console.error('No session data found. Please log in again.');
    }
  }

  loadBookingsForDate(): void {
    if (!this.selectedDay || !this.selectedMovie || !this.selectedTime) {
      this.resetSeats();
      return;
    }

    const formattedDate = `${this.selectedDay.year}-${this.selectedDay.month + 1}-${this.selectedDay.day}`;
    
   
    const url = `http://localhost:5000/api/users/bookings_collection/${formattedDate}/${this.selectedMovie}/${this.selectedTime}`;
    
    // Send the booking data to the server to fetch booked seats
    this.http.get<any>(url).subscribe(
      (response) => {
        if (response && response.seats && response.seats.length > 0) {
          // Populate booked seats based on the response
          response.seats.forEach((seat: { row: number; seat: number }) => {
            if (
              seat.row > 0 &&
              seat.row <= this.rows.length &&
              seat.seat > 0 &&
              seat.seat <= this.rows[seat.row - 1].length
            ) {
              this.rows[seat.row - 1][seat.seat - 1].booked = true;
            }
          });
        } else {
          console.log('No bookings found for the selected configuration.');
        }
      },
      (error) => {
        console.error('Error fetching bookings:', error);
        this.resetSeats(); // Ensure seats are cleared on error
      }
    );

  }



  toggleSeat(rowIndex: number, seatIndex: number): void {
    const seat = this.rows[rowIndex][seatIndex];
    if (!seat.booked) {
      seat.selected = !seat.selected;
      console.log(`Seat toggled: row=${rowIndex + 1}, seat=${seatIndex + 1}, selected=${seat.selected}`);
  
      // Ensure seat format is 'row-seat'
      const seatKey = `${rowIndex + 1}-${seatIndex + 1}`;
      if (seat.selected) {
        this.cartData.selectedSeats.push(seatKey);
      } else {
        const seatIndex = this.cartData.selectedSeats.indexOf(seatKey);
        if (seatIndex !== -1) {
          this.cartData.selectedSeats.splice(seatIndex, 1);
        }
      }
  
      this.updateSession();
    }
  }
  
  

  getSeatNumber(rowIndex: number, seatIndex: number): number {
    let seatStart = 1;
    for (let i = 0; i < rowIndex; i++) {
      seatStart += this.rows[i].length;
    }
    return seatStart + seatIndex;
  }

  // confirmBooking(rowIndex: number, seatIndex: number): void {
  //   const seat = this.rows[rowIndex][seatIndex];
  //   if (seat.selected) {
  //     seat.booked = true;
  //     seat.selected = false;
  //     this.saveBookings();
  //   } else {
  //     console.warn('Seat not selected for booking.');
  //   }
  // }

  removeBooking(rowIndex: number, seatIndex: number): void {
    const seatKey = `${rowIndex + 1}-${seatIndex + 1}`;
    const seat = this.rows[rowIndex][seatIndex];
    if (
      seat.booked &&
      this.selectedDay &&
      this.selectedMovie &&
      this.selectedTime &&
      this.seatOwnershipMap[seatKey] === this.loggedInUserId
    ) {
      const formattedDate = `${this.selectedDay.year}-${this.selectedDay.month + 1}-${this.selectedDay.day}`;
      const url = `http://localhost:5000/api/bookings_collection/${formattedDate}/${this.selectedMovie}/${this.selectedTime}`;

      this.http.delete(url).subscribe(
        (response) => {
          console.log('Booking removed successfully:', response);
          delete this.seatOwnershipMap[seatKey];
          seat.booked = false;
          this.loadBookingsForDate();
        },
        (error) => {
          console.error('Error removing booking:', error);
        }
      );
    } else {
      console.warn('Invalid configuration for removing booking');
    }
  }

  isSeatOwnedByUser(rowIndex: number, seatIndex: number): boolean {
    const seatKey = `${rowIndex + 1}-${seatIndex + 1}`;
    return this.seatOwnershipMap[seatKey] === this.loggedInUserId;
  }
}
