import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';

async function seedUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    // Create test user for API testing
    const testUser = await authService.register(
      'testadmin',
      'admin@schoolpay.com', 
      'admin123'
    );
    
    console.log('✅ Test user created:', {
      username: 'testadmin',
      email: 'admin@schoolpay.com',
      password: 'admin123',
      id: testUser._id
    });
    
  } catch (error) {
    console.log('User might already exist or error:', error.message);
  }
  
  await app.close();
}

seedUser();
