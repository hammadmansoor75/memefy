import  SyncUser  from '@/components/SyncUser';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        
        <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
        <SyncUser />
    </div>
  );
}
