import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { safeLocalStorage } from '../utils/local-storage.util'; // Update the path as needed
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';


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
    Array(7).fill(null).map(() => ({ selected: false, booked: false, ownedByUser: false })),
    Array(12).fill(null).map(() => ({ selected: false, booked: false, ownedByUser: false })),
    Array(15).fill(null).map(() => ({ selected: false, booked: false, ownedByUser: false })),
    Array(12).fill(null).map(() => ({ selected: false, booked: false, ownedByUser: false })),
    Array(7).fill(null).map(() => ({ selected: false, booked: false, ownedByUser: false })),
  ];

  bookedSeat: { row: number; seat: number; status: string } | null = null;
  loggedInUserId: string | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private sessionService: SessionService,private router: Router) { }

  ngOnInit(): void {
    const sessionData = this.sessionService.getSession();
    if (sessionData) {
      this.loggedInUserId = sessionData.userId;
    }
    const today = new Date();
    this.selectedDay = { day: today.getDate(), month: today.getMonth(), year: today.getFullYear() };
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

      this.resetSeats();
      this.seatOwnershipMap = {}; // Clear the seat ownership map as well

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
      showTimes: this.cartData.selectedTime,
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
      userid: '',
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
        userid: updatedSessionData.userId,
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
    const sessionData = this.sessionService.getSession();
    const loggedInUserId = sessionData ? sessionData.userId : null;

    const url = `http://localhost:5000/api/users/bookings_collection/${formattedDate}/${this.selectedMovie}/${this.selectedTime}`;

    this.http.get<any>(url).subscribe(
      (response) => {
        if (response && response.seats && response.seats.length > 0) {
          const bookedSeats = response.seats;

          bookedSeats.forEach((seat: { row: number; seat: number }) => {
            const seatRowIndex = seat.row - 1; // Adjust for zero-indexing
            const seatColumnIndex = seat.seat - 1; // Adjust for zero-indexing

            this.rows[seatRowIndex][seatColumnIndex].booked = true;

            if (loggedInUserId) {
              // Check if the logged-in user owns the seat
              const isOwnedByUser = response.userid === loggedInUserId;
              this.rows[seatRowIndex][seatColumnIndex].ownedByUser = isOwnedByUser;

              // Update the seatOwnershipMap for tracking
              const seatKey = `${seat.row}-${seat.seat}`;
              this.seatOwnershipMap[seatKey] = isOwnedByUser ? loggedInUserId : '';
            } else {
              // If no session data, default ownership to false
              this.rows[seatRowIndex][seatColumnIndex].ownedByUser = false;
            }
          });
        } else {
          console.log('No bookings found for the selected date and movie.');
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


  // console.log("Remove Booking data")
  //     console.log("seat key:",seatKey)
  //     console.log("seat:",seat)
  //     console.log("UserId:",loggedInUserId)
  //     console.log("Selected movie:",this.selectedMovie)
  //     console.log("Selected movie:",this.selectedTime)
  //     console.log("Seat Ownership Map:", this.seatOwnershipMap);
  //     console.log("User owned:",this.seatOwnershipMap[seatKey] );

  removeBooking(rowIndex: number, seatIndex: number): void {
    const sessionData = this.sessionService.getSession();
    const loggedInUserId = sessionData.userId;
    console.log("Booking Remove");
    console.log("UserId:", loggedInUserId);

    console.log("Selected movie:", this.selectedMovie);
    console.log("Selected time:", this.selectedTime);
    console.log("seat", rowIndex, seatIndex);

    if (!this.selectedDay || !this.selectedMovie || !this.selectedTime || !loggedInUserId) {
      console.error('Missing necessary information for booking removal.');
      return;
    }

    const formattedDate = `${this.selectedDay.year}-${this.selectedDay.month + 1}-${this.selectedDay.day}`;
    const seatToRemove = `${rowIndex + 1}-${seatIndex + 1}`; // 'row-seat' format

    // Get the current booking data
    this.http.get<any>(`http://localhost:5000/api/users/bookings_collection/${formattedDate}/${this.selectedMovie}/${this.selectedTime}`)
      .subscribe(
        (response) => {
          if (!response || !response.seats) {
            console.error('No bookings found for the selected configuration.');
            return;
          }

          console.log("Selected seating from DB:", response);
          const bookingid = response._id;

          console.log("userid in the booked seat:", response.userid);
          console.log("userid in the session:", loggedInUserId);

          // Check if the logged-in user is the one who made the booking
          if (response.userid !== loggedInUserId) {
            console.error('You cannot remove a booking that was not made by you.');
            return;
          }

          // Send a request to the backend to remove the specific seat
          this.http.put(`http://localhost:5000/api/users/booking/remove_seat/${bookingid}`, { seat: seatToRemove })
            .subscribe(
              () => {
                console.log('Seat removed successfully.');

                // Update the UI by marking the seat as available again
                this.rows[rowIndex][seatIndex].booked = false;

                // Optionally, reset the seat selection after removal
                this.rows[rowIndex][seatIndex].selected = false;

                // Reload the bookings after removal
                this.loadBookingsForDate();
              },
              (error) => {
                console.error('Error removing the seat:', error);
              }
            );
        },
        (error) => {
          console.error('Error fetching booking:', error);
        }
      );
  }





  isSeatOwnedByUser(rowIndex: number, seatIndex: number): boolean {
    const sessionData = this.sessionService.getSession();
    const seatKey = `${rowIndex + 1}-${seatIndex + 1}`;
    return this.seatOwnershipMap[seatKey] === sessionData.userId;
  }

  getTotalBookedSeats(): number {
    let totalSeatsBooked = 0;
  
    this.rows.forEach((row) => {
      row.forEach((seat) => {
        if (seat.booked) {
          totalSeatsBooked++;
        }
      });
    });
  
    return totalSeatsBooked;
  }
  
  totalBookedSeats: number = 0;

  @Output() bookedSeatsChange = new EventEmitter<number>();

  bookSeat(): void {
    this.totalBookedSeats += 1; // Increment seat count
    this.bookedSeatsChange.emit(this.totalBookedSeats); // Emit the updated seat count
  }
  



   // Method to redirect to the PaymentComponent
   redirectToPayment(): void {
    const totalBookedSeats = this.getTotalBookedSeats();
    console.log(`Total seats booked for payment: ${totalBookedSeats}`);
    
    // Optionally, pass this information to the payment route
    this.router.navigate(['/payment'], {
      queryParams: { totalBookedSeats },
    });
  }
  
}
