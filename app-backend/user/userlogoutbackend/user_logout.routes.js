"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// User Logout Route
router.post('/logout', (req, res) => {
    const sessionId = req.body.sessionId;
    console.log('Session ID before logout:', sessionId);
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ message: 'Error logging out' });
        }
        else {
            res.status(200).json({ message: 'Logout successful' });
            console.log('Session destroyed:', sessionId);
        }
    });
});
exports.default = router;
