import  SyncUser  from '@/components/SyncUser';
import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        <SyncUser/>
    </div>
  );
}
