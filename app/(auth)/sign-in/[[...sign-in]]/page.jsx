import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br  to-white flex items-center justify-center">
      <div className="p-6 rounded-2xl bg-white/80 shadow-sm backdrop-blur-sm">
        <SignIn
          appearance={{
            elements: {
              card: 'rounded-xl shadow-md',
            },
          }}
        />
      </div>
    </div>
  );
}
