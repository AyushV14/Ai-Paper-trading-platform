import { User, Wallet } from "lucide-react";

const UserHeader = ({ name, profileImage, virtualBalance, email }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white transform transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center gap-6">
        {/* Profile Picture */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt={name} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
        </div>
        
        {/* User Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-1">{name || 'Trader'}</h1>
          <p className="text-blue-100 text-sm mb-3">{email || 'trader@example.com'}</p>
          
          {/* Virtual Balance */}
          {/* <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 w-fit">
            <Wallet className="w-5 h-5" />
            <span className="font-semibold">Virtual Balance:</span>
            <span className="text-xl font-bold">₹{(virtualBalance || 0).toLocaleString()}</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserHeader;