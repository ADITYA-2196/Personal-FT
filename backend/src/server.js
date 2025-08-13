import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import xss from 'xss-clean';
import cors from 'cors';
import morgan from 'morgan';
import { rateLimiter } from './utils/rateLimiter.js';
import authRoutes from './routes/auth.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import userRoutes from './routes/user.routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger.js';

const app = express();


app.use(helmet());
app.use(hpp());
app.use(xss());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));


if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}


app.use(rateLimiter.global);

app.use('/api/auth', rateLimiter.auth, authRoutes);
app.use('/api/transactions', rateLimiter.transactions, transactionRoutes);
app.use('/api/analytics', rateLimiter.analytics, analyticsRoutes);
app.use('/api/users', rateLimiter.admin, userRoutes);


app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => res.json({ status: 'ok', service: 'PFT Backend' }));


app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
