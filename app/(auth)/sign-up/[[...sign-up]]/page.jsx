import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen flex">
     
      <div
        className="hidden lg:flex w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: 'url(https://source.unsplash.com/random/800x1200)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
          <h1 className="text-white text-4xl font-extrabold mb-4">Welcome to PrepPal</h1>
          <p className="text-white text-lg">Sign Up to begin your journey</p>
        </div>
      </div>
      
     
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 bg-gray-50">
        <div className="w-full max-w-md">
          
          <div>
            <SignIn />
          </div>
        </div>
      </div>
    </div>
  );
}
