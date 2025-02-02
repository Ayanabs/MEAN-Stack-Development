"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const database_1 = __importDefault(require("./database")); // MongoDB connection
const user_signup_backend_routes_1 = __importDefault(require("./user/user_signup_backend/user_signup_backend.routes")); // Routes for user signup
const userloginbackend_routes_1 = __importDefault(require("./user/userloginbackend/userloginbackend.routes"));
const admin_insert_movie_routes_1 = __importDefault(require("./admin/admin_movie/admin_insert_movie.routes"));
const retrieve_movie_routes_1 = __importDefault(require("./movies/retrieve_movie.routes"));
const retrieve_movie_byName_1 = __importDefault(require("./movies/retrieve_movie_byName"));
const admin_user_signup_1 = __importDefault(require("./admin/admin_user/admin_user_signup"));
const admin_user_signin_1 = __importDefault(require("./admin/admin_user/admin_user_signin"));
const admin_delete_movie_routes_1 = __importDefault(require("./admin/admin_movie/admin_delete_movie.routes"));
const admin_update_movie_routes_1 = __importDefault(require("./admin/admin_movie/admin_update_movie.routes"));
const admin_retrieve_movieById_1 = __importDefault(require("./admin/admin_movie/admin_retrieve_movieById"));
const user_logout_routes_1 = __importDefault(require("./user/userlogoutbackend/user_logout.routes"));
const up_save_bookings_routes_1 = __importDefault(require("./seating/up_save_bookings_routes"));
const get_bookings_routes_1 = __importDefault(require("./seating/get_bookings_routes"));
const remove_booking_routes_1 = __importDefault(require("./seating/remove_booking_routes"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
dotenv.config(); // Load environment variables from .env
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
// Allow requests from localhost:4200 (frontend)
app.use(cors({
    origin: 'http://localhost:4200', // Allow only your frontend's domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// Middleware
app.use(express_1.default.json());
// Connect to MongoDB
(0, database_1.default)();
// Configure Sessions
app.use((0, express_session_1.default)({
    secret: 'your-secret-key', // Use a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set 'true' if using HTTPS
}));
const isAuthenticated = (req, Request, res, Response, next) => {
    if (req.session && req.session.id) {
        next();
    }
    else {
        res.status(401).json({ message: 'Unauthorized access' });
    }
};
exports.isAuthenticated = isAuthenticated;
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// Log every request to /api/users routes
app.use('/api/users', (req, res, next) => {
    console.log(`Accessed route: ${req.originalUrl}`);
    next(); // Pass control to the next handler
});
// Use the insert booking route
app.use('/api/users/booking', remove_booking_routes_1.default);
// Use the get seating route
app.use('/api/users', get_bookings_routes_1.default);
// Use the signup route
app.use('/api/users', user_signup_backend_routes_1.default);
// Use the login route
app.use('/api/users', userloginbackend_routes_1.default);
// Use the logout route
app.use('/api/users', user_logout_routes_1.default);
// Use the insert movie route
app.use('/api/users', admin_insert_movie_routes_1.default);
// Use the retrieve movie route
app.use('/api/users', retrieve_movie_routes_1.default);
// Use the retrieve movie by name route
app.use('/api/users', retrieve_movie_byName_1.default);
// Use the admin signup route
app.use('/api/admin', admin_user_signup_1.default);
// Use the admin signin route
app.use('/api/admin', admin_user_signin_1.default);
// Use the delete movie route
app.use('/api/users', admin_delete_movie_routes_1.default);
// Use the update movie route
app.use('/api/users', admin_update_movie_routes_1.default);
// Use the retrieve movieById route
app.use('/api/users', admin_retrieve_movieById_1.default);
// Use the insert booking route
app.use('/api/users', up_save_bookings_routes_1.default);
// Default route
app.get('/', (req, res) => {
    res.send('Backend server for signup functionality');
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
