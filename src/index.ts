import app from './app.js';
import { PORT } from './config/config.js';

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;